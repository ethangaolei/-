'use client'

import { CUISINES } from '@/lib/types'

interface CuisineSelectorProps {
  selected: string[]
  onChange: (cuisines: string[]) => void
}

export default function CuisineSelector({ selected, onChange }: CuisineSelectorProps) {
  const allCuisines = [...CUISINES.breakfast, ...CUISINES.main]

  const toggle = (cuisine: string) => {
    if (selected.includes(cuisine)) {
      onChange(selected.filter(c => c !== cuisine))
    } else {
      onChange([...selected, cuisine])
    }
  }

  return (
    <div className="bg-white rounded-2xl p-4 shadow-sm">
      <h3 className="text-sm font-medium text-gray-500 mb-3">🍳 偏好菜系（可多选）</h3>
      <div className="flex flex-wrap gap-2">
        {allCuisines.map(cuisine => (
          <button
            key={cuisine}
            onClick={() => toggle(cuisine)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              selected.includes(cuisine)
                ? 'bg-primary text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {cuisine}
          </button>
        ))}
      </div>
      {selected.length === 0 && (
        <p className="text-xs text-gray-400 mt-2">留空则接受任意菜系</p>
      )}
    </div>
  )
}