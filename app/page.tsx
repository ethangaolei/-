'use client'

import { useState } from 'react'
import IngredientInput from '@/components/IngredientInput'
import IngredientTag from '@/components/IngredientTag'
import CuisineSelector from '@/components/CuisineSelector'
import { Ingredient } from '@/lib/types'

export default function HomePage() {
  const [ingredients, setIngredients] = useState<Ingredient[]>([])
  const [selectedCuisines, setSelectedCuisines] = useState<string[]>([])

  const handleGenerateMeals = async () => {
    if (ingredients.length === 0) {
      alert('请先添加食材')
      return
    }
    const params = new URLSearchParams({
      ingredients: JSON.stringify(ingredients),
      cuisines: JSON.stringify(selectedCuisines),
    })
    window.location.href = `/meals?${params.toString()}`
  }

  const removeIngredient = (index: number) => {
    setIngredients(prev => prev.filter((_, i) => i !== index))
  }

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="bg-white shadow-sm px-4 py-4 flex justify-between items-center sticky top-0 z-10">
        <h1 className="text-xl font-bold text-gray-800">📅 今日食材</h1>
        <a href="/history" className="text-primary text-sm font-medium">历史记录</a>
      </header>

      {/* Main Content */}
      <main className="max-w-lg mx-auto px-4 py-6 space-y-4">
        {/* Ingredient Input */}
        <IngredientInput
          onIngredientsChange={(newIngredients) => {
            setIngredients(prev => [...prev, ...newIngredients])
          }}
        />

        {/* Ingredients List */}
        {ingredients.length > 0 && (
          <div className="bg-white rounded-2xl p-4 shadow-sm">
            <h3 className="text-sm font-medium text-gray-500 mb-3">已识别的食材：</h3>
            <div className="flex flex-wrap gap-2">
              {ingredients.map((ing, index) => (
                <IngredientTag
                  key={index}
                  name={ing.name}
                  quantity={ing.quantity}
                  unit={ing.unit}
                  onRemove={() => removeIngredient(index)}
                />
              ))}
            </div>
          </div>
        )}

        {/* Cuisine Selector */}
        <CuisineSelector selected={selectedCuisines} onChange={setSelectedCuisines} />

        {/* Generate Button */}
        <button
          onClick={handleGenerateMeals}
          disabled={ingredients.length === 0}
          className="w-full py-4 bg-primary text-white rounded-2xl font-bold text-lg shadow-lg hover:bg-orange-600 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
        >
          一键生成三餐
        </button>
      </main>
    </div>
  )
}