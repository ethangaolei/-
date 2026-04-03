import { NextRequest, NextResponse } from 'next/server'
import { recognizeIngredientsFromImage } from '@/lib/claude'
import { saveInventory } from '@/lib/db'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { image } = body
    const date = body.date || new Date().toISOString().split('T')[0]

    if (!image) {
      return NextResponse.json({ error: 'Image is required' }, { status: 400 })
    }

    const ingredients = await recognizeIngredientsFromImage(image)
    const inventory = saveInventory({
      date,
      ingredients,
      cuisine_preferences: [],
    })

    return NextResponse.json({ ingredients, inventory })
  } catch (error) {
    console.error('Recognition error:', error)
    return NextResponse.json({ error: 'Failed to recognize ingredients' }, { status: 500 })
  }
}
