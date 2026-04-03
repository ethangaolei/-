'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

interface HistoryRecord {
  id: number
  date: string
  breakfast_id: number
  lunch_id: number
  dinner_id: number
  ingredients: Array<{ name: string; quantity: number; unit: string }>
}

export default function HistoryPage() {
  const [histories, setHistories] = useState<HistoryRecord[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/history')
      .then(res => res.json())
      .then(data => {
        setHistories(data)
        setLoading(false)
      })
      .catch(err => {
        console.error(err)
        setLoading(false)
      })
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500">🔄 加载中...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="bg-white shadow-sm px-4 py-4 flex items-center sticky top-0 z-10">
        <Link href="/" className="text-gray-600 mr-4 text-2xl">←</Link>
        <h1 className="text-xl font-bold text-gray-800">历史记录</h1>
      </header>

      {/* Content */}
      <main className="max-w-lg mx-auto px-4 py-6">
        {histories.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-400">暂无历史记录</p>
            <p className="text-sm text-gray-400 mt-2">开始规划今日三餐吧</p>
          </div>
        ) : (
          <div className="space-y-4">
            {histories.map(record => (
              <div key={record.id} className="bg-white rounded-2xl p-4 shadow-sm">
                <p className="font-bold text-gray-800 mb-3">{record.date}</p>
                <div className="flex flex-wrap gap-2 mb-3">
                  {record.ingredients.slice(0, 5).map((ing, index) => (
                    <span key={index} className="text-xs px-2 py-1 bg-gray-100 rounded-full text-gray-600">
                      {ing.name} ×{ing.quantity}
                    </span>
                  ))}
                  {record.ingredients.length > 5 && (
                    <span className="text-xs px-2 py-1 text-gray-400">
                      +{record.ingredients.length - 5}更多
                    </span>
                  )}
                </div>
                <div className="flex gap-2 text-xs text-gray-500">
                  {record.breakfast_id > 0 && <span>🌅 早餐</span>}
                  {record.lunch_id > 0 && <span>☀️ 午餐</span>}
                  {record.dinner_id > 0 && <span>🌙 晚餐</span>}
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
