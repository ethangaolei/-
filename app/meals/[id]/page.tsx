'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { useParams } from 'next/navigation'
import NutritionInfo from '@/components/NutritionInfo'
import { Recipe } from '@/lib/types'

export default function RecipeDetailPage() {
  const params = useParams()
  const [recipe, setRecipe] = useState<Recipe | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!params.id) return

    fetch(`/api/recipe/${params.id}`)
      .then(res => res.json())
      .then(data => {
        setRecipe(data)
        setLoading(false)
      })
      .catch(err => {
        console.error(err)
        setLoading(false)
      })
  }, [params.id])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500">🔄 加载中...</p>
      </div>
    )
  }

  if (!recipe) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4">
        <p className="text-gray-500">菜谱不存在</p>
        <a href="/" className="px-6 py-3 bg-primary text-white rounded-xl font-medium">
          返回首页
        </a>
      </div>
    )
  }

  return (
    <div className="min-h-screen pb-8">
      {/* Header */}
      <header className="bg-white shadow-sm px-4 py-4 flex items-center sticky top-0 z-10">
        <button onClick={() => history.back()} className="text-gray-600 mr-4 text-2xl">←</button>
        <h1 className="text-xl font-bold text-gray-800 truncate">{recipe.title}</h1>
      </header>

      {/* Hero Image */}
      <div className="relative h-64 w-full">
        <Image
          src={recipe.image}
          alt={recipe.title}
          fill
          className="object-cover"
          sizes="100vw"
        />
      </div>

      {/* Content */}
      <main className="max-w-lg mx-auto px-4 py-6 space-y-6">
        {/* Basic Info */}
        <div className="flex gap-4 text-sm text-gray-600">
          <span>⏱️ {recipe.readyInMinutes}分钟</span>
          <span>👤 {recipe.servings}人份</span>
          {recipe.cuisines.length > 0 && (
            <span>{recipe.cuisines[0]}</span>
          )}
        </div>

        {/* Nutrition */}
        <NutritionInfo nutrition={recipe.nutrition} />

        {/* Ingredients */}
        <div className="bg-white rounded-2xl p-4 shadow-sm">
          <h3 className="font-bold text-gray-800 mb-3">🥗 所需食材</h3>
          <ul className="space-y-2">
            {recipe.extendedIngredients.map((ing, index) => (
              <li key={index} className="flex items-center gap-2 text-sm text-gray-600">
                <span className="w-2 h-2 rounded-full bg-primary flex-shrink-0"></span>
                {ing}
              </li>
            ))}
          </ul>
        </div>

        {/* Instructions */}
        <div className="bg-white rounded-2xl p-4 shadow-sm">
          <h3 className="font-bold text-gray-800 mb-3">👨‍🍳 烹饪步骤</h3>
          <ol className="space-y-4">
            {recipe.analyzedInstructions.map((step, index) => (
              <li key={index} className="flex gap-3">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary text-white text-sm font-bold flex items-center justify-center">
                  {index + 1}
                </span>
                <p className="text-sm text-gray-600 leading-relaxed">{step}</p>
              </li>
            ))}
          </ol>
        </div>
      </main>
    </div>
  )
}
