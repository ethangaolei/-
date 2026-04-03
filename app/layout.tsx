import './globals.css'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: '今日食材 - 家庭三餐规划',
  description: '拍照识别食材，AI推荐一日三餐菜谱',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="zh-CN">
      <body className="min-h-screen bg-gray-50">{children}</body>
    </html>
  )
}
