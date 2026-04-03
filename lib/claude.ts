import Anthropic from '@anthropic-ai/sdk'

const anthropic = new Anthropic({
  apiKey: process.env.CLAUDE_API_KEY,
})

export async function recognizeIngredientsFromImage(imageBase64: string): Promise<Array<{ name: string; quantity: number; unit: string }>> {
  const response = await anthropic.messages.create({
    model: 'claude-opus-4-6',
    max_tokens: 1024,
    messages: [{
      role: 'user',
      content: [
        {
          type: 'image',
          source: {
            type: 'base64',
            media_type: 'image/jpeg',
            data: imageBase64,
          },
        },
        {
          type: 'text',
          text: '请识别这张图片中的食材，并以JSON数组格式返回，例如：[{"name":"鸡蛋","quantity":3,"unit":"个"},{"name":"番茄","quantity":2,"unit":"个"}]。只返回JSON，不要其他文字。'
        }
      ],
    }],
  })

  const text = response.content[0].type === 'text' ? response.content[0].text : ''
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
