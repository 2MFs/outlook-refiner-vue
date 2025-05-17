// 可在 <script setup> 中直接使用
export async function callApi(options = {}) {
  const {
    url = '/api/chat',
    method = 'POST',
    headers = { 'Content-Type': 'application/json' },
    body = { message: 'Hello' },
    // 可加入任何額外自定義欄位
    ...customFields
  } = options

  try {
    const response = await fetch(url, {
      method,
      headers,
      body: JSON.stringify(body),
      ...customFields // 例如 provider, timeout, credentials 等自定義欄位
    })

    const data = await response.json()

    // 回傳格式也可自定義（例如 options.customReturn）
    if (options.customReturn && typeof options.customReturn === 'function') {
      return options.customReturn(data)
    }

    // 預設回傳格式
    return data?.choices?.[0]?.message?.content?.trim() || "⚠️ 無回應內容"
  } catch (error) {
    console.error('API 呼叫錯誤:', error)
    return "⚠️ 請求失敗"
  }
}
