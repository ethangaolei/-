import { NextRequest, NextResponse } from 'next/server'
import { getRecipeDetails } from '@/lib/spoonacular'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id)
    if (isNaN(id)) {
      return NextResponse.json({ error: 'Invalid recipe ID' }, { status: 400 })
    }

    const recipe = await getRecipeDetails(id)
    return NextResponse.json(recipe)
  } catch (error) {
    console.error('Recipe fetch error:', error)
    return NextResponse.json({ error: 'Failed to fetch recipe' }, { status: 500 })
  }
}
