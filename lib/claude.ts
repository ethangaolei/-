const ZHIHU_API_URL = 'https://open.bigmodel.cn/api/paas/v4/chat/completions'

export async function recognizeIngredientsFromImage(imageBase64: string): Promise<Array<{ name: string; quantity: number; unit: string }>> {
  const response = await fetch(`${ZHIHU_API_URL}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${process.env.ZHIPU_API_KEY}`,
    },
    body: JSON.stringify({
      model: 'glm-4v',
      max_tokens: 1024,
      messages: [
        {
          role: 'user',
          content: [
            {
              type: 'text',
              text: '请识别这张图片中的食材，并以JSON数组格式返回，例如：[{"name":"鸡蛋","quantity":3,"unit":"个"},{"name":"番茄","quantity":2,"unit":"个"}]。只返回JSON，不要其他文字。'
            },
            {
              type: 'image_url',
              image_url: {
                url: `data:image/jpeg;base64,${imageBase64}`,
              },
            }
          ],
        }
      ],
    }),
  })

  if (!response.ok) {
    throw new Error(`Zhipu API error: ${response.status}`)
  }

  const data = await response.json()
  const text = data.choices?.[0]?.message?.content || ''
  const match = text.match(/\[[\s\S]*\]/)
  if (match) {
    try {
      return JSON.parse(match[0])
    } catch {
      return []
    }
  }
  return []
}
