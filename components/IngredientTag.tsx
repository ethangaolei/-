interface IngredientTagProps {
  name: string
  quantity: number
  unit: string
  onRemove?: () => void
}

export default function IngredientTag({ name, quantity, unit, onRemove }: IngredientTagProps) {
  return (
    <span className="inline-flex items-center gap-2 px-3 py-2 bg-orange-50 border border-orange-200 rounded-full text-sm">
      <span className="text-gray-700">{name}</span>
      <span className="text-gray-500">×{quantity}{unit}</span>
      {onRemove && (
        <button
          onClick={onRemove}
          className="w-5 h-5 rounded-full bg-orange-200 text-orange-600 hover:bg-orange-300 transition-colors text-xs font-bold flex items-center justify-center"
        >
          ×
        </button>
      )}
    </span>
  )
}