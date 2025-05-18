import { callApi } from 'utils/api.js'
import i18n from 'i18n'
const { t } = i18n.global;

/**
 * 通用封裝：取出提供者資訊並驗證
 */
function getProviderPayload(providers, providerName) {
  const provider = providers[providerName];
  if (!provider) throw new Error(`❌ ${t("Provider not found:")} ${providerName}`);
  if (!provider.url || !provider.model)
    throw new Error(`❌ ${providerName} ${t("The API configuration is incomplete.")}`);

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
export async function refineText(providers, providerName, text, style = t("formal"), targetLang = t("english")) {
  const { provider, useProvider } = getProviderPayload(providers, providerName);
  const prompt = provider.refinePrompt(text, style, targetLang);
  return await useApi(useProvider, prompt);
}

/**
 * 翻譯文字
 */
export async function translateText(providers, providerName, text, targetLang = t("english")) {
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
    }
  });
}