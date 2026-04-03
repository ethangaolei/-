import { Recipe } from './types'

const FAVORITES_KEY = 'favorites'

export function getFavorites(): Recipe[] {
  if (typeof window === 'undefined') return []
  const stored = localStorage.getItem(FAVORITES_KEY)
  if (!stored) return []
  try {
    return JSON.parse(stored)
  } catch {
    return []
  }
}

export function addFavorite(recipe: Recipe): void {
  const favorites = getFavorites()
  if (!favorites.some(f => f.id === recipe.id)) {
    favorites.push(recipe)
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites))
  }
}

export function removeFavorite(recipeId: string): void {
  const favorites = getFavorites().filter(f => f.id !== recipeId)
  localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites))
}

export function isFavorite(recipeId: string): boolean {
  return getFavorites().some(f => f.id === recipeId)
}

export function toggleFavorite(recipe: Recipe): boolean {
  if (isFavorite(recipe.id)) {
    removeFavorite(recipe.id)
    return false
  } else {
    addFavorite(recipe)
    return true
  }
}
