const dishImages: Record<string, string> = {
  '番茄炒蛋': 'https://images.unsplash.com/photo-1482049016688-2d3e1b311543?w=400&h=300&fit=crop',
  '西红柿炒蛋': 'https://images.unsplash.com/photo-1482049016688-2d3e1b311543?w=400&h=300&fit=crop',
  '宫保鸡丁': 'https://images.unsplash.com/photo-1525755662778-989d0524087e?w=400&h=300&fit=crop',
  '鱼香肉丝': 'https://images.unsplash.com/photo-1617093727343-374698b1b08d?w=400&h=300&fit=crop',
  '回锅肉': 'https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?w=400&h=300&fit=crop',
  '红烧肉': 'https://images.unsplash.com/photo-1623689046286-6776e8b9e526?w=400&h=300&fit=crop',
  '麻婆豆腐': 'https://images.unsplash.com/photo-1582576163090-09d3b89f4fc0?w=400&h=300&fit=crop',
  '青椒肉丝': 'https://images.unsplash.com/photo-1603360946369-dc9bb6258143?w=400&h=300&fit=crop',
  '番茄牛腩': 'https://images.unsplash.com/photo-1546549032-9571cd6b27a7?w=400&h=300&fit=crop',
  '土豆烧牛肉': 'https://images.unsplash.com/photo-1534932955809-5f7d4d5cff56?w=400&h=300&fit=crop',
  '清蒸鱼': 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400&h=300&fit=crop',
  '糖醋排骨': 'https://images.unsplash.com/photo-1544025162-d76694265947?w=400&h=300&fit=crop',
  '蛋炒饭': 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=400&h=300&fit=crop',
  '苦瓜炒蛋': 'https://images.unsplash.com/photo-1595295333158-4742f28fbd85?w=400&h=300&fit=crop',
  '韭菜鸡蛋': 'https://images.unsplash.com/photo-1482049016688-2d3e1b311543?w=400&h=300&fit=crop',
  '红烧排骨': 'https://images.unsplash.com/photo-1544025162-d76694265947?w=400&h=300&fit=crop',
  '清蒸鲈鱼': 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400&h=300&fit=crop',
  '口水鸡': 'https://images.unsplash.com/photo-1534951009808-766178b47a4f?w=400&h=300&fit=crop',
  '白斩鸡': 'https://images.unsplash.com/photo-1534960480485-9ad7e01234f2?w=400&h=300&fit=crop',
  '辣子鸡': 'https://images.unsplash.com/photo-1525755662778-989d0524087e?w=400&h=300&fit=crop',
  '蒜泥白肉': 'https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?w=400&h=300&fit=crop',
  '糖醋里脊': 'https://images.unsplash.com/photo-1544025162-d76694265947?w=400&h=300&fit=crop',
  '番茄炖牛腩': 'https://images.unsplash.com/photo-1546549032-9571cd6b27a7?w=400&h=300&fit=crop',
  '牙签牛肉': 'https://images.unsplash.com/photo-1534932955809-5f7d4d5cff56?w=400&h=300&fit=crop',
  '干煸四季豆': 'https://images.unsplash.com/photo-1582576163090-09d3b89f4fc0?w=400&h=300&fit=crop',
  '蒜蓉西兰花': 'https://images.unsplash.com/photo-1459411552884-841db9b3cc2a?w=400&h=300&fit=crop',
  '蚝油生菜': 'https://images.unsplash.com/photo-1459411552884-841db9b3cc2a?w=400&h=300&fit=crop',
  '家常豆腐': 'https://images.unsplash.com/photo-1582576163090-09d3b89f4fc0?w=400&h=300&fit=crop',
  '皮蛋豆腐': 'https://images.unsplash.com/photo-1582576163090-09d3b89f4fc0?w=400&h=300&fit=crop',
  '蚂蚁上树': 'https://images.unsplash.com/photo-1559314809-0d155014e29e?w=400&h=300&fit=crop',
  '青椒牛肉': 'https://images.unsplash.com/photo-1603360946369-dc9bb6258143?w=400&h=300&fit=crop',
  '牛肉炒蛋': 'https://images.unsplash.com/photo-1482049016688-2d3e1b311543?w=400&h=300&fit=crop',
}

const fallbackImages = {
  breakfast: 'https://images.unsplash.com/photo-1533089860892-a7c6f0a88666?w=400&h=300&fit=crop',
  lunch: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&h=300&fit=crop',
  dinner: 'https://images.unsplash.com/photo-1547592180-85f173990554?w=400&h=300&fit=crop',
}

export function getDishImage(title: string, mealType?: string): string {
  if (dishImages[title]) {
    return dishImages[title]
  }
  for (const [dish, image] of Object.entries(dishImages)) {
    if (title.includes(dish) || dish.includes(title)) {
      return image
    }
  }
  if (mealType && fallbackImages[mealType as keyof typeof fallbackImages]) {
    return fallbackImages[mealType as keyof typeof fallbackImages]
  }
  return fallbackImages.lunch
}
