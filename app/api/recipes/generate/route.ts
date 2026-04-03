import { NextRequest, NextResponse } from 'next/server'
import { generateRecipesByIngredients } from '@/lib/zhipu'
import { saveInventory, saveHistory } from '@/lib/db'
import { Recipe } from '@/lib/types'

export async function POST(request: NextRequest) {
  try {
    const { ingredients, cuisines = [], favorites = [], date = new Date().toISOString().split('T')[0] } = await request.json()

    if (!ingredients || ingredients.length === 0) {
      return NextResponse.json({ error: 'Ingredients are required' }, { status: 400 })
    }

    saveInventory({
      date,
      ingredients,
      cuisine_preferences: cuisines,
    })

    // Always use meal types + selected cuisine for variety
    const selectedCuisine = cuisines.length > 0 ? cuisines[0] : '家常菜'
    const breakfastCuisine = '早餐'
    const lunchCuisine = '午餐'
    const dinnerCuisine = '晚餐'

    const [breakfast, lunch, dinner] = await Promise.all([
      generateRecipesByIngredients(ingredients, breakfastCuisine, favorites as Recipe[]),
      generateRecipesByIngredients(ingredients, lunchCuisine, favorites as Recipe[]),
      generateRecipesByIngredients(ingredients, dinnerCuisine, favorites as Recipe[]),
    ])

    saveHistory({
      date,
      breakfast_id: 0,
      lunch_id: 0,
      dinner_id: 0,
      ingredients,
    })

    return NextResponse.json({ breakfast, lunch, dinner })
  } catch (error) {
    console.error('Generate error:', error)
    return NextResponse.json({ error: 'Failed to generate meal plan' }, { status: 500 })
  }
}
