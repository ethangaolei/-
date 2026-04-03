const BASE_URL = 'https://api.spoonacular.com'

const ingredientTranslation: Record<string, string> = {
  '鸡蛋': 'egg',
  '鸡肉': 'chicken',
  '番茄': 'tomato',
  '西红柿': 'tomato',
  '牛肉': 'beef',
  '猪肉': 'pork',
  '鱼肉': 'fish',
  '虾': 'shrimp',
  '白菜': 'cabbage',
  '菠菜': 'spinach',
  '土豆': 'potato',
  '胡萝卜': 'carrot',
  '洋葱': 'onion',
  '大蒜': 'garlic',
  '姜': 'ginger',
  '葱': 'green onion',
  '米饭': 'rice',
  '面条': 'noodles',
  '豆腐': 'tofu',
  '牛奶': 'milk',
  '奶酪': 'cheese',
  '黄油': 'butter',
  '盐': 'salt',
  '糖': 'sugar',
  '油': 'oil',
  '酱油': 'soy sauce',
  '醋': 'vinegar',
  '辣椒': 'chili',
  '青椒': 'bell pepper',
  '黄瓜': 'cucumber',
  '茄子': 'eggplant',
  '南瓜': 'pumpkin',
  '蘑菇': 'mushroom',
  '芹菜': 'celery',
  '生菜': 'lettuce',
  '苹果': 'apple',
  '香蕉': 'banana',
  '橙子': 'orange',
  '葡萄': 'grape',
  '草莓': 'strawberry',
  '西瓜': 'watermelon',
  '柠檬': 'lemon',
  '牛油果': 'avocado',
  '酸奶': 'yogurt',
  '面包': 'bread',
  '三文鱼': 'salmon',
  '蟹': 'crab',
  '龙虾': 'lobster',
}

export function translateIngredient(chineseName: string): string {
  return ingredientTranslation[chineseName] || chineseName.toLowerCase()
}

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
