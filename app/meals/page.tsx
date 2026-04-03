'use client'

import { useState, useEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import MealCard from '@/components/MealCard'
import { Ingredient, Recipe } from '@/lib/types'

interface MealPlan {
  breakfast: Recipe | null
  lunch: Recipe | null
  dinner: Recipe | null
}

function MealsContent() {
  const searchParams = useSearchParams()
  const [mealPlan, setMealPlan] = useState<MealPlan | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const ingredientsParam = searchParams.get('ingredients')
    const cuisinesParam = searchParams.get('cuisines')

    if (!ingredientsParam) {
      setLoading(false)
      return
    }

    const ingredients: Ingredient[] = JSON.parse(ingredientsParam)
    const cuisines: string[] = cuisinesParam ? JSON.parse(cuisinesParam) : []

    fetch('/api/recipes/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ingredients, cuisines }),
    })
      .then(res => res.json())
      .then(data => {
        setMealPlan(data)
        setLoading(false)
      })
      .catch(err => {
        console.error(err)
        setLoading(false)
      })
  }, [searchParams])

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
          <MealCard
            type="breakfast"
            recipe={mealPlan.breakfast}
            onClick={() => mealPlan.breakfast && (window.location.href = `/meals/${mealPlan.breakfast.id}`)}
          />
          <MealCard
            type="lunch"
            recipe={mealPlan.lunch}
            onClick={() => mealPlan.lunch && (window.location.href = `/meals/${mealPlan.lunch.id}`)}
          />
          <MealCard
            type="dinner"
            recipe={mealPlan.dinner}
            onClick={() => mealPlan.dinner && (window.location.href = `/meals/${mealPlan.dinner.id}`)}
          />
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
