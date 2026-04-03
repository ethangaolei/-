import Image from 'next/image'
import { Recipe } from '@/lib/types'

interface MealCardProps {
  type: 'breakfast' | 'lunch' | 'dinner'
  recipe: Recipe | null
  onClick: () => void
}

const mealTypeLabels = {
  breakfast: '🌅 早餐',
  lunch: '☀️ 午餐',
  dinner: '🌙 晚餐',
}

export default function MealCard({ type, recipe, onClick }: MealCardProps) {
  if (!recipe) {
    return (
      <div className="bg-white rounded-2xl p-6 shadow-sm text-center">
        <p className="text-gray-400">{mealTypeLabels[type]}</p>
        <p className="text-sm text-gray-400 mt-2">未找到合适的菜谱</p>
      </div>
    )
  }

  return (
    <button
      onClick={onClick}
      className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow text-left w-full"
    >
      <div className="relative h-40 w-full">
        <Image
          src={recipe.image}
          alt={recipe.title}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, 33vw"
        />
      </div>
      <div className="p-4">
        <p className="text-xs text-gray-400 mb-1">{mealTypeLabels[type]}</p>
        <h3 className="font-bold text-gray-800 truncate">{recipe.title}</h3>
        <p className="text-sm text-gray-500 mt-1">
          ⏱️ {recipe.readyInMinutes}分钟 · 👤 {recipe.servings}人份
        </p>
      </div>
    </button>
  )
}
