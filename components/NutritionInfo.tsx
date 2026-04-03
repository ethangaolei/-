import { Recipe } from '@/lib/types'

interface NutritionInfoProps {
  nutrition: Recipe['nutrition']
}

export default function NutritionInfo({ nutrition }: NutritionInfoProps) {
  const items = [
    { label: '热量', value: `${nutrition.calories}`, unit: 'kcal' },
    { label: '蛋白质', value: nutrition.protein, unit: 'g' },
    { label: '碳水', value: nutrition.carbs, unit: 'g' },
    { label: '脂肪', value: nutrition.fat, unit: 'g' },
  ]

  return (
    <div className="bg-orange-50 rounded-xl p-4">
      <h4 className="text-sm font-medium text-gray-600 mb-3">📊 营养信息</h4>
      <div className="grid grid-cols-4 gap-2">
        {items.map(item => (
          <div key={item.label} className="text-center">
            <p className="text-lg font-bold text-primary">{item.value}</p>
            <p className="text-xs text-gray-500">{item.label}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
