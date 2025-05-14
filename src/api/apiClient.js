function getOverride(key, fallback) {
  return localStorage.getItem(key) || fallback;
}

const providers = {
  openai: {
    get url() {
      return getOverride("openai_url", import.meta.env.VITE_OPENAI_API_URL);
    },
    get key() {
      return getOverride("openai_key", import.meta.env.VITE_OPENAI_API_KEY);
    },
    refinePrompt: (text, style) =>
      `請以「${style}」風格潤色以下內容：\n${text}`,
    translatePrompt: (text, lang) =>
      `請將下列文字翻譯成${lang}：\n${text}`,
  },
  grok: {
    get url() {
      return getOverride("grok_url", import.meta.env.VITE_GROK_API_URL);
    },
    get key() {
      return getOverride("grok_key", import.meta.env.VITE_GROK_API_KEY);
    },    
    refinePrompt: (text, style) =>
      `潤色成${style}風格：${text}`,
    translatePrompt: (text, lang) =>
      `翻譯成${lang}：${text}`,
  },
  copilot: {
    get url() {
      return getOverride("copilot_url", import.meta.env.VITE_COPILOT_API_URL);
    },
    get key() {
      return getOverride("copilot_key", import.meta.env.VITE_COPILOT_API_KEY);
    }, 
    refinePrompt: (text, style) =>
      `請使用 ${style} 風格潤色這段話：${text}`,
    translatePrompt: (text, lang) =>
      `翻譯以下內容成 ${lang}：${text}`,
  },
  gemini: {
    get url() {
      return getOverride("gemini_url", import.meta.env.VITE_GEMINI_API_URL);
    },
    get key() {
      return getOverride("gemini_key", import.meta.env.VITE_GEMINI_API_KEY);
    }, 
    refinePrompt: (text, style) =>
      `用 ${style} 風格修飾以下句子：${text}`,
    translatePrompt: (text, lang) =>
      `請翻譯為 ${lang}：${text}`,
  },
};

export async function refineText(providerName, text, style = "正式") {
  const provider = providers[providerName];
  if (!provider) throw new Error(`❌ 找不到提供者: ${providerName}`);
  if (!provider.url || !provider.key)
    throw new Error(`❌ ${providerName} API 設定不完整`);

  const prompt = provider.refinePrompt(text, style);
  return await callApi(provider, prompt);
}

export async function translateText(providerName, text, targetLang = "英文") {
  const provider = providers[providerName];
  if (!provider) throw new Error(`❌ 找不到提供者: ${providerName}`);
  if (!provider.url || !provider.key)
    throw new Error(`❌ ${providerName} API 設定不完整`);

  const prompt = provider.translatePrompt(text, targetLang);
  return await callApi(provider, prompt);
}

async function callApi(provider, prompt) {
  const response = await fetch(provider.url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${provider.key}`,
    },
    body: JSON.stringify({
      model: "gpt-4",
      messages: [{ role: "user", content: prompt }],
    }),
  });

  const data = await response.json();
  return data?.choices?.[0]?.message?.content?.trim() || "⚠️ 無回應內容";
}
