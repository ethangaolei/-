import { NextRequest, NextResponse } from 'next/server'
import { generateSingleMeal } from '@/lib/zhipu'
import { Recipe } from '@/lib/types'

export async function POST(request: NextRequest) {
  try {
    const { ingredients, cuisine, favorites = [] } = await request.json()

    if (!ingredients || ingredients.length === 0) {
      return NextResponse.json({ error: 'Ingredients are required' }, { status: 400 })
    }

    if (!cuisine) {
      return NextResponse.json({ error: 'Cuisine type is required' }, { status: 400 })
    }

    const recipe = await generateSingleMeal(ingredients, cuisine, favorites as Recipe[])

    return NextResponse.json(recipe)
  } catch (error) {
    console.error('Regenerate error:', error)
    return NextResponse.json({ error: 'Failed to regenerate meal' }, { status: 500 })
  }
}