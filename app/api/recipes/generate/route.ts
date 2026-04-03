import { NextRequest, NextResponse } from 'next/server'
import { findRecipesByIngredients, getRecipeDetails } from '@/lib/spoonacular'
import { saveInventory, saveHistory } from '@/lib/db'

const cuisineMap: Record<string, string> = {
  '川菜': 'Sichuan',
  '粤菜': 'Cantonese',
  '江浙菜': 'Jiangsu',
  '湘菜': 'Hunan',
  '鲁菜': 'Shandong',
  '西餐': 'European',
  '日料': 'Japanese',
  '韩料': 'Korean',
  '东南亚菜': 'Southeast Asian',
  '中式早餐': 'Chinese',
  '西式早餐': 'European',
  '日式早餐': 'Japanese',
}

export async function POST(request: NextRequest) {
  try {
    const { ingredients, cuisines = [], date = new Date().toISOString().split('T')[0] } = await request.json()

    if (!ingredients || ingredients.length === 0) {
      return NextResponse.json({ error: 'Ingredients are required' }, { status: 400 })
    }

    const ingredientNames = ingredients.map((i: any) => i.name)
    const mappedCuisines = cuisines.map((c: string) => cuisineMap[c]).filter(Boolean)

    saveInventory({
      date,
      ingredients,
      cuisine_preferences: cuisines,
    })

    const breakfastRecipes = await findRecipesByIngredients(ingredientNames, mappedCuisines.slice(0, 1), 3)
    const lunchRecipes = await findRecipesByIngredients(ingredientNames, mappedCuisines.slice(1, 2), 3)
    const dinnerRecipes = await findRecipesByIngredients(ingredientNames, mappedCuisines.slice(2, 3), 3)

    const breakfast = breakfastRecipes[0] ? await getRecipeDetails(breakfastRecipes[0].id) : null
    const lunch = lunchRecipes[0] ? await getRecipeDetails(lunchRecipes[0].id) : null
    const dinner = dinnerRecipes[0] ? await getRecipeDetails(dinnerRecipes[0].id) : null

    if (breakfast || lunch || dinner) {
      saveHistory({
        date,
        breakfast_id: breakfast?.id || 0,
        lunch_id: lunch?.id || 0,
        dinner_id: dinner?.id || 0,
        ingredients,
      })
    }

    return NextResponse.json({ breakfast, lunch, dinner })
  } catch (error) {
    console.error('Generate error:', error)
    return NextResponse.json({ error: 'Failed to generate meal plan' }, { status: 500 })
  }
}
