import { callApi } from 'utils/api.js'

/**
 * 通用封裝：取出提供者資訊並驗證
 */
function getProviderPayload(providers, providerName) {
  const provider = providers[providerName];
  if (!provider) throw new Error(`❌ 找不到提供者: ${providerName}`);
  if (!provider.url || !provider.model)
    throw new Error(`❌ ${providerName} API 設定不完整`);

  return {
    provider,
    useProvider: {
      name: provider.name,
      url: provider.url,
      model: provider.model,
      key: provider.key
    }
  };
}

/**
 * 潤色文字
 */
export async function refineText(providers, providerName, text, style = "正式") {
  const { provider, useProvider } = getProviderPayload(providers, providerName);
  const prompt = provider.refinePrompt(text, style);
  return await useApi(useProvider, prompt);
}

/**
 * 翻譯文字
 */
export async function translateText(providers, providerName, text, targetLang = "英文") {
  const { provider, useProvider } = getProviderPayload(providers, providerName);
  const prompt = provider.translatePrompt(text, targetLang);
  return await useApi(useProvider, prompt);
}

/**
 * 呼叫 API
 */
async function useApi(useProvider, prompt) {
  return await callApi({
    body: {
      message: prompt,
      provider: useProvider,
    },
    customReturn: (res) => res.output || '⚠️ 無回應內容'
  });
}