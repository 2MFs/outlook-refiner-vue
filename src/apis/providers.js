import { ref, computed } from 'vue';
import { useConfigStore } from 'stores/config';

function getOverride(key, fallback = '') {
  const value = localStorage.getItem(key);
  return value !== null && value !== '' ? value : fallback;
}

function formatUrl(template, values) {
  return template.replace(/{(.*?)}/g, (_, key) => encodeURIComponent(values[key] || ''));
}

// 各 AI 的 prompt 樣式
const promptTemplates = {
  openai: {
    refine: (text, style) => `請以「${style}」風格潤色以下內容：\n${text}`,
    translate: (text, lang) => `請將下列文字翻譯成${lang}：\n${text}`
  },
  grok: {
    refine: (text, style) => `潤色成${style}風格：${text}`,
    translate: (text, lang) => `翻譯成${lang}：${text}`
  },
  claude: {
    refine: (text, style) => `請使用 ${style} 風格潤色這段話：${text}`,
    translate: (text, lang) => `翻譯以下內容成 ${lang}：${text}`
  },
  gemini: {
    refine: (text, style) => `用 ${style} 風格修飾以下句子：${text}`,
    translate: (text, lang) => `請翻譯為 ${lang}：${text}`
  },
  customize: {
    refine: (text, style) => `用 ${style} 風格修飾以下句子：${text}`,
    translate: (text, lang) => `請翻譯為 ${lang}：${text}`
  },
  free: {
    refine: (text, style) => `用 ${style} 風格修飾以下句子：${text}`,
    translate: (text, lang) => `請翻譯為 ${lang}：${text}`
  }
};

/**
 * 動態產生 provider 設定
 */
function createProvider(name, config = {}, env = import.meta.env, format = false) {


  return {
    name,
    get url() {
      const configUrl = config?.[name]?.url;
      const envUrl = env[`VITE_${name.toUpperCase()}_API_URL`];
      if (format && configUrl && env[`VITE_${name.toUpperCase()}_API_MODEL`]) {
        const model = config?.[name]?.model || env[`VITE_${name.toUpperCase()}_API_MODEL`] || '';
        return getOverride(`${name}_url`, formatUrl(configUrl, { model, key: '' }));
      }
      return getOverride(`${name}_url`, configUrl || envUrl || '');
    },
    get key() {
      return getOverride(`${name}_key`, '');
    },
    get model() {
      const configModel = config?.[name]?.model;
      const envModel = env[`VITE_${name.toUpperCase()}_API_MODEL`];
      return getOverride(`${name}_model`, configModel || envModel || '');
    },
    refinePrompt: promptTemplates[name].refine,
    translatePrompt: promptTemplates[name].translate
  };
}

/**
 * 封裝所有 provider
 */
export function useProviders() {
  const configStore = useConfigStore();
  const config = computed(() => configStore.config);  
  const env = import.meta.env;
  
  return {
    openai: createProvider('openai', config, env),
    grok: createProvider('grok', config, env),
    claude: createProvider('claude', config, env),
    gemini: createProvider('gemini', config, env, true),  // 特別處理 URL 格式
    customize: createProvider('customize', config, env),
    free: createProvider('free', config, env)
  };
}
