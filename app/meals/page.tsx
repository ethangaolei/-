'use client'

import { useState, useEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import MealCard from '@/components/MealCard'
import { Ingredient, Recipe } from '@/lib/types'
import { getFavorites } from '@/lib/favorites'
import { generateSingleMeal } from '@/lib/zhipu'

interface MealPlan {
  breakfast: Recipe | null
  lunch: Recipe | null
  dinner: Recipe | null
}

type MealType = 'breakfast' | 'lunch' | 'dinner'

function MealsContent() {
  const searchParams = useSearchParams()
  const [mealPlan, setMealPlan] = useState<MealPlan | null>(null)
  const [loading, setLoading] = useState(true)
  const [regenerating, setRegenerating] = useState<MealType | null>(null)

  const ingredientsRef = { current: [] as Ingredient[] }
  const cuisinesRef = { current: [] as string[] }

  useEffect(() => {
    const ingredientsParam = searchParams.get('ingredients')
    const cuisinesParam = searchParams.get('cuisines')

    if (!ingredientsParam) {
      setLoading(false)
      return
    }

    const ingredients: Ingredient[] = JSON.parse(ingredientsParam)
    const cuisines: string[] = cuisinesParam ? JSON.parse(cuisinesParam) : []
    ingredientsRef.current = ingredients
    cuisinesRef.current = cuisines
    const favorites = getFavorites()

    fetch('/api/recipes/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ingredients, cuisines, favorites }),
    })
      .then(res => res.json())
      .then(data => {
        setMealPlan(data)
        sessionStorage.setItem('currentMealPlan', JSON.stringify(data))
        setLoading(false)
      })
      .catch(err => {
        console.error(err)
        setLoading(false)
      })
  }, [searchParams])

  const handleRegenerate = async (type: MealType) => {
    if (!mealPlan || regenerating) return
    setRegenerating(type)

    try {
      const ingredients = ingredientsRef.current
      const cuisines = cuisinesRef.current
      const favorites = getFavorites()
      const cuisineType = type === 'breakfast' ? '早餐' : type === 'lunch' ? '午餐' : '晚餐'

      const newRecipe = await generateSingleMeal(ingredients, cuisineType, favorites)

      setMealPlan(prev => {
        if (!prev) return prev
        return { ...prev, [type]: newRecipe }
      })
    } catch (error) {
      console.error('Failed to regenerate:', error)
    } finally {
      setRegenerating(null)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500">🔄 正在生成三餐推荐...</p>
      </div>
    )
  }

  if (!mealPlan) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4">
        <p className="text-gray-500">请先在首页添加食材</p>
        <a href="/" className="px-6 py-3 bg-primary text-white rounded-xl font-medium">
          返回首页
        </a>
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="bg-white shadow-sm px-4 py-4 flex items-center sticky top-0 z-10">
        <a href="/" className="text-gray-600 mr-4 text-2xl">←</a>
        <h1 className="text-xl font-bold text-gray-800">今日三餐推荐</h1>
      </header>

      {/* Meal Cards */}
      <main className="max-w-lg mx-auto px-4 py-6">
        <div className="grid grid-cols-1 gap-4">
          {/* Breakfast */}
          <div className="relative">
            <MealCard
              type="breakfast"
              recipe={mealPlan.breakfast}
              onClick={() => {
                if (mealPlan.breakfast) {
                  sessionStorage.setItem('selectedRecipe', JSON.stringify(mealPlan.breakfast))
                  window.location.href = `/meals/${mealPlan.breakfast.id}`
                }
              }}
            />
            <button
              onClick={() => handleRegenerate('breakfast')}
              disabled={regenerating !== null}
              className="absolute top-2 right-2 px-3 py-1 bg-white/90 rounded-full text-sm shadow hover:bg-white transition-colors disabled:opacity-50"
            >
              {regenerating === 'breakfast' ? '🔄' : '🔄 换一换'}
            </button>
          </div>

          {/* Lunch */}
          <div className="relative">
            <MealCard
              type="lunch"
              recipe={mealPlan.lunch}
              onClick={() => {
                if (mealPlan.lunch) {
                  sessionStorage.setItem('selectedRecipe', JSON.stringify(mealPlan.lunch))
                  window.location.href = `/meals/${mealPlan.lunch.id}`
                }
              }}
            />
            <button
              onClick={() => handleRegenerate('lunch')}
              disabled={regenerating !== null}
              className="absolute top-2 right-2 px-3 py-1 bg-white/90 rounded-full text-sm shadow hover:bg-white transition-colors disabled:opacity-50"
            >
              {regenerating === 'lunch' ? '🔄' : '🔄 换一换'}
            </button>
          </div>

          {/* Dinner */}
          <div className="relative">
            <MealCard
              type="dinner"
              recipe={mealPlan.dinner}
              onClick={() => {
                if (mealPlan.dinner) {
                  sessionStorage.setItem('selectedRecipe', JSON.stringify(mealPlan.dinner))
                  window.location.href = `/meals/${mealPlan.dinner.id}`
                }
              }}
            />
            <button
              onClick={() => handleRegenerate('dinner')}
              disabled={regenerating !== null}
              className="absolute top-2 right-2 px-3 py-1 bg-white/90 rounded-full text-sm shadow hover:bg-white transition-colors disabled:opacity-50"
            >
              {regenerating === 'dinner' ? '🔄' : '🔄 换一换'}
            </button>
          </div>
        </div>
      </main>
    </div>
  )
}

export default function MealsPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500">🔄 加载中...</p>
      </div>
    }>
      <MealsContent />
    </Suspense>
  )
}
