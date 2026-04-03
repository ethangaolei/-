const BASE_URL = 'https://api.spoonacular.com'

interface SpoonacularRecipe {
  id: number
  title: string
  image: string
  readyInMinutes: number
  servings: number
  cuisines: string[]
  analyzedInstructions: string[]
  extendedIngredients: string[]
  nutrition: {
    calories: number
    protein: string
    carbs: string
    fat: string
  }
}

export async function findRecipesByIngredients(
  ingredients: string[],
  cuisines: string[] = [],
  number: number = 1
): Promise<SpoonacularRecipe[]> {
  const params = new URLSearchParams({
    ingredients: ingredients.join(','),
    number: number.toString(),
    ranking: '2',
    ignorePantry: 'true',
    apiKey: process.env.SPOONACULAR_API_KEY!,
  })

  if (cuisines.length > 0) {
    params.set('cuisine', cuisines[0])
  }

  const response = await fetch(`${BASE_URL}/recipes/findByIngredients?${params}`)
  if (!response.ok) throw new Error('Failed to fetch recipes')
  return response.json()
}

export async function getRecipeDetails(recipeId: number): Promise<SpoonacularRecipe> {
  const params = new URLSearchParams({
    apiKey: process.env.SPOONACULAR_API_KEY!,
    includeNutrition: 'true',
  })

  const response = await fetch(`${BASE_URL}/recipes/${recipeId}/information?${params}`)
  if (!response.ok) throw new Error('Failed to fetch recipe details')

  const data = await response.json()
  return {
    id: data.id,
    title: data.title,
    image: data.image,
    readyInMinutes: data.readyInMinutes,
    servings: data.servings,
    cuisines: data.cuisines || [],
    analyzedInstructions: data.analyzedInstructions?.[0]?.steps?.map((s: any) => s.step) || [],
    extendedIngredients: data.extendedIngredients?.map((i: any) => i.original) || [],
    nutrition: {
      calories: data.nutrition?.nutrients?.find((n: any) => n.name === 'Calories')?.amount || 0,
      protein: (data.nutrition?.nutrients?.find((n: any) => n.name === 'Protein')?.amount || 0) + 'g',
      carbs: (data.nutrition?.nutrients?.find((n: any) => n.name === 'Carbohydrates')?.amount || 0) + 'g',
      fat: (data.nutrition?.nutrients?.find((n: any) => n.name === 'Fat')?.amount || 0) + 'g',
    },
  }
}
