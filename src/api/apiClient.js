export async function refineTextByAI(text, options) {
    const prompt = `請將以下文字潤色為 ${options.style} 風格，翻譯為 ${options.language}：\n\n${text}`
  
    switch (options.model) {
      case 'OpenAI':
        return await callOpenAI(prompt)
      case 'Copilot':
        return await callCopilot(prompt)
      case 'Gemini':
        return await callGemini(prompt)
      case 'Grok':
        return await callGrok(prompt)
      default:
        return text
    }
  }
  
  async function callOpenAI(prompt) {
    const res = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': 'Bearer YOUR_OPENAI_KEY',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4',
        messages: [{ role: 'user', content: prompt }],
      })
    })
    const data = await res.json()
    return data.choices[0].message.content
  }
  
  // 其他 AI API 的函式架構類似，建議設置 Proxy server 保護金鑰
  