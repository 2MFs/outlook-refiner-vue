import { callApi } from 'utils/api.js'
/**
 * export async功能
 */

export async function refineText(providers, providerName, text, style = "正式") {
  const provider = providers[providerName];
  if (!provider) throw new Error(`❌ 找不到提供者: ${providerName}`);
  if (!provider.url || !provider.model)
    throw new Error(`❌ ${providerName} API 設定不完整`);

  const prompt = provider.refinePrompt(text, style);
  const useProvider = {name: provider.name, url: provider.url, model: provider.model, key: provider.key};
  
  return await useApi(useProvider, prompt);
}

export async function translateText(providers, providerName, text, targetLang = "英文") {
  const provider = providers[providerName];
  if (!provider) throw new Error(`❌ 找不到提供者: ${providerName}`);
  if (!provider.url || !provider.model)
    throw new Error(`❌ ${providerName} API 設定不完整`);

  const prompt = provider.translatePrompt(text, targetLang);
  const useProvider = {name: provider.name, url: provider.url, model: provider.model, key: provider.key};

  return await useApi(useProvider, prompt);
}

/**
 * 功能區塊
 */
//
async function useApi(provider, prompt) {
 
  return await callApi({
    body: JSON.stringify({ 
        message: prompt,
        provider: provider,
      }),
    
    customReturn: (res) => res.output || '⚠️ 無回應內容'
  })

  /*
  async () => {
    await fetch('/api/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      provider: provider,
      body: JSON.stringify({ message: prompt })
    })

    const data = await response.json();
    return data?.choices?.[0]?.message?.content?.trim() || "⚠️ 無回應內容";
  }
  */
}
