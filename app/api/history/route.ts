import { NextResponse } from 'next/server'
import { getHistories } from '@/lib/db'

export async function GET() {
  try {
    const histories = getHistories()
    return NextResponse.json(histories)
  } catch (error) {
    console.error('History fetch error:', error)
    return NextResponse.json({ error: 'Failed to fetch history' }, { status: 500 })
  }
}
