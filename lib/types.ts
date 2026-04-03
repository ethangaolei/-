export interface Ingredient {
  name: string
  quantity: number
  unit: string
}

export interface DailyInventory {
  id: number
  date: string
  ingredients: Ingredient[]
  cuisine_preferences: string[]
  created_at: string
}

export interface Recipe {
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

export interface MealPlan {
  breakfast: Recipe | null
  lunch: Recipe | null
  dinner: Recipe | null
}

export const CUISINES = {
  breakfast: ['中式早餐', '西式早餐', '日式早餐'],
  main: ['川菜', '粤菜', '江浙菜', '湘菜', '鲁菜', '西餐', '日料', '韩料', '东南亚菜'],
} as const

export type BreakfastCuisine = typeof CUISINES.breakfast[number]
export type MainCuisine = typeof CUISINES.main[number]
