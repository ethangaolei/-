'use client'

import { useState } from 'react'

interface IngredientInputProps {
  onIngredientsChange: (ingredients: Array<{ name: string; quantity: number; unit: string }>) => void
}

export default function IngredientInput({ onIngredientsChange }: IngredientInputProps) {
  const [mode, setMode] = useState<'photo' | 'manual'>('photo')
  const [inputValue, setInputValue] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setIsLoading(true)
    try {
      const formData = new FormData()
      formData.append('image', file)

      const res = await fetch('/api/ingredients/recognize', {
        method: 'POST',
        body: JSON.stringify({ image: await fileToBase64(file) }),
        headers: { 'Content-Type': 'application/json' },
      })
      const data = await res.json()
      if (data.ingredients) {
        onIngredientsChange(data.ingredients)
      }
    } catch (error) {
      console.error('Recognition error:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = () => resolve(reader.result as string)
      reader.onerror = reject
      reader.readAsDataURL(file)
    })
  }

  const handleManualAdd = () => {
    if (!inputValue.trim()) return
    const parts = inputValue.split(',').map(s => s.trim()).filter(Boolean)
    const newIngredients = parts.map(part => {
      const match = part.match(/^(.+?)\s*[x×]?\s*(\d+)?\s*(个|克|斤|kg|ml|升)?$/)
      if (match) {
        return {
          name: match[1].trim(),
          quantity: parseInt(match[2]) || 1,
          unit: match[3] || '个'
        }
      }
      return { name: part, quantity: 1, unit: '个' }
    })
    onIngredientsChange(newIngredients)
    setInputValue('')
  }

  return (
    <div className="bg-white rounded-2xl p-4 shadow-sm">
      <div className="flex gap-2 mb-4">
        <button
          onClick={() => setMode('photo')}
          className={`flex-1 py-3 rounded-xl font-medium transition-colors ${
            mode === 'photo' ? 'bg-primary text-white' : 'bg-gray-100 text-gray-600'
          }`}
        >
          📷 拍照识别
        </button>
        <button
          onClick={() => setMode('manual')}
          className={`flex-1 py-3 rounded-xl font-medium transition-colors ${
            mode === 'manual' ? 'bg-primary text-white' : 'bg-gray-100 text-gray-600'
          }`}
        >
          ✏️ 手动输入
        </button>
      </div>

      {mode === 'photo' ? (
        <label className="block border-2 border-dashed border-gray-300 rounded-xl p-8 text-center cursor-pointer hover:border-primary transition-colors">
          <input type="file" accept="image/*" capture="environment" onChange={handlePhotoUpload} className="hidden" />
          {isLoading ? (
            <span className="text-gray-500">🔄 识别中...</span>
          ) : (
            <span className="text-gray-500">📸 点击拍照或上传食材图片</span>
          )}
        </label>
      ) : (
        <div className="flex gap-2">
          <input
            type="text"
            value={inputValue}
            onChange={e => setInputValue(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleManualAdd()}
            placeholder="输入食材，如：鸡蛋 x3, 番茄 x2"
            className="flex-1 px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-primary"
          />
          <button
            onClick={handleManualAdd}
            className="px-6 py-3 bg-primary text-white rounded-xl font-medium hover:bg-orange-600 transition-colors"
          >
            添加
          </button>
        </div>
      )}
    </div>
  )
}