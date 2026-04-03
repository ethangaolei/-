interface DailyInventory {
  id: number
  date: string
  ingredients: Array<{ name: string; quantity: number; unit: string }>
  cuisine_preferences: string[]
  created_at: string
}

interface HistoryRecord {
  id: number
  date: string
  breakfast_id: number
  lunch_id: number
  dinner_id: number
  ingredients: Array<{ name: string; quantity: number; unit: string }>
}

const inventories = new Map<string, DailyInventory>()
const histories: HistoryRecord[] = []
let inventoryId = 1
let historyId = 1

export function saveInventory(inventory: Omit<DailyInventory, 'id' | 'created_at'>): DailyInventory {
  const existing = inventories.get(inventory.date)
  if (existing) {
    existing.ingredients = inventory.ingredients
    existing.cuisine_preferences = inventory.cuisine_preferences
    return existing
  }
  const newInventory: DailyInventory = {
    ...inventory,
    id: inventoryId++,
    created_at: new Date().toISOString(),
  }
  inventories.set(inventory.date, newInventory)
  return newInventory
}

export function getInventory(date: string): DailyInventory | null {
  return inventories.get(date) || null
}

export function saveHistory(record: Omit<HistoryRecord, 'id'>): HistoryRecord {
  const newRecord: HistoryRecord = { ...record, id: historyId++ }
  histories.push(newRecord)
  return newRecord
}

export function getHistories(): HistoryRecord[] {
  return histories.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
}
