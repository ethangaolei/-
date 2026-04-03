const ZHIHU_API_URL = 'https://open.bigmodel.cn/api/paas/v4/chat/completions'

interface Recipe {
  id: string
  title: string
  image: string
  readyInMinutes: number
  servings: number
  cuisines: string[]
  analyzedInstructions: string[]
  extendedIngredients: string[]
  nutrition: {
    calories: number
    protein: string
    carbs: string
    fat: string
  }
}

export async function generateRecipesByIngredients(
  ingredients: Array<{ name: string; quantity: number; unit: string }>,
  cuisine: string,
  favorites: Recipe[] = []
): Promise<Recipe> {
  const ingredientList = ingredients.map(i => `${i.name}${i.quantity}${i.unit}`).join('、')

  const mealTypeContext: Record<string, string> = {
    '早餐': '必须是简单快速的中式早餐，10-20分钟完成，如番茄炒蛋、鸡蛋饼、蛋炒饭',
    '午餐': '必须是丰富实在的下饭菜，20-30分钟，如宫保鸡丁、鱼香肉丝、回锅肉',
    '晚餐': '必须是温和养胃的家常菜，炖煮蒸为主，如红烧肉、清蒸鱼、豆腐煲'
  }
  const mealContext = mealTypeContext[cuisine] || '推荐经典家常菜'

  const favoritesContext = favorites.length > 0
    ? `\n用户收藏过的菜谱（优先推荐类似风格）：${favorites.map(f => f.title).join('、')}`
    : ''

  const prompt = `你是专业中餐厨师。用户食材：${ingredientList}。${mealContext}${favoritesContext}。

从以下选择（可用食材创新，风格必须符合上述要求）：
- 早餐类：番茄炒蛋、苦瓜炒蛋、韭菜鸡蛋、葱花蛋饼、蛋炒饭
- 下饭类：宫保鸡丁、鱼香肉丝、回锅肉、青椒肉丝、蒜苗肉丝
- 家常类：红烧肉、清蒸鲈鱼、麻婆豆腐、番茄牛腩、土豆烧牛肉

要点：
1. 菜名简洁，如"番茄炒蛋"
2. 步骤4-5步
3. 必须符合对应餐饮类型
4. 如果有收藏记录，优先推荐类似风格的菜谱

返回JSON：
{
  "title": "菜名",
  "readyInMinutes": 数字,
  "servings": 2,
  "cuisines": ["${cuisine}"],
  "analyzedInstructions": ["步骤1", "步骤2", "步骤3"],
  "extendedIngredients": ["主料", "调料"],
  "nutrition": {"calories": 数字, "protein": "数字g", "carbs": "数字g", "fat": "数字g"}
}

只返回JSON。`

  const response = await fetch(`${ZHIHU_API_URL}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${process.env.ZHIPU_API_KEY}`,
    },
    body: JSON.stringify({
      model: 'glm-4',
      max_tokens: 2048,
      messages: [
        {
          role: 'user',
          content: prompt
        }
      ],
    }),
  })

  if (!response.ok) {
    throw new Error(`Zhipu API error: ${response.status}`)
  }

  const data = await response.json()
  const text = data.choices?.[0]?.message?.content || ''

  const match = text.match(/\{[\s\S]*\}/)
  if (match) {
    try {
      const recipe = JSON.parse(match[0])
      return {
        id: `zhipu-${Date.now()}`,
        image: '',
        servings: recipe.servings || 2,
        ...recipe
      }
    } catch {
      throw new Error('Failed to parse recipe')
    }
  }
  throw new Error('No recipe found in response')
}
