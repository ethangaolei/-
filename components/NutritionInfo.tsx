import { Recipe } from '@/lib/types'

interface NutritionInfoProps {
  nutrition: Recipe['nutrition']
}

function formatValue(value: string | number, unit: string): { value: string; unit: string } {
  const str = String(value)
  // If value already contains Chinese unit (克), don't add additional unit
  if (str.includes('克') || str.includes('kcal') || str.includes('卡')) {
    return { value: str, unit: '' }
  }
  return { value: str, unit }
}

export default function NutritionInfo({ nutrition }: NutritionInfoProps) {
  const caloriesInfo = formatValue(nutrition.calories, 'kcal')
  const proteinInfo = formatValue(nutrition.protein, 'g')
  const carbsInfo = formatValue(nutrition.carbs, 'g')
  const fatInfo = formatValue(nutrition.fat, 'g')

  const items = [
    { label: '热量', value: caloriesInfo.value, unit: caloriesInfo.unit },
    { label: '蛋白质', value: proteinInfo.value, unit: proteinInfo.unit },
    { label: '碳水', value: carbsInfo.value, unit: carbsInfo.unit },
    { label: '脂肪', value: fatInfo.value, unit: fatInfo.unit },
  ]

  return (
    <div className="bg-orange-50 rounded-xl p-4">
      <h4 className="text-sm font-medium text-gray-600 mb-3">📊 营养信息</h4>
      <div className="grid grid-cols-4 gap-2">
        {items.map(item => (
          <div key={item.label} className="text-center">
            <p className="text-lg font-bold text-primary">{item.value}{item.unit}</p>
            <p className="text-xs text-gray-500">{item.label}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
