import { ref, computed } from 'vue';
import { useConfigStore } from 'stores/config';

import i18n from 'i18n'
const { t } = i18n.global;

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
    refine: (text, style, lang) => `${t("openai refine prompt", {style: style, lang: lang})} \n${text}`,
    translate: (text, lang) => `${t("openai translate prompt", {lang: lang})} \n${text}`
  },
  grok: {
    refine: (text, style, lang) => `${t("grok refine prompt",{style: style, lang: lang})} ${text}`,
    translate: (text, lang) => `${t("grok translate prompt", {lang: lang})} ${text}`
  },
  claude: {
    refine: (text, style, lang) => `${t("claude refine prompt",{style: style, lang: lang})} ${text}`,
    translate: (text, lang) => `${t("claude translate prompt", {lang: lang})} ${text}`
  },
  gemini: {
    refine: (text, style, lang) => `${t("gemini refine prompt", {style: style, lang: lang})} ${text}`,
    translate: (text, lang) => `${t("gemini translate prompt", {lang: lang})} ${text}`
  },
  customize: {
    refine: (text, style, lang) => `${t("customize refine prompt", {style: style, lang: lang})} ${text}`,
    translate: (text, lang) => `${t("customize translate prompt", {lang: lang})} ${text}`
  },
  free: {
    refine: (text, style, lang) => `${t("free refine prompt", {style: style, lang: lang})} ${text}`,
    translate: (text, lang) => `${t("free translate prompt", {lang: lang})} ${text}`
  }
};

/**
 * 動態產生 provider 設定
 */
function createProvider(name, config = {}, env = import.meta.env, customUrl = false) {


  return {
    name,
    get url() {
      const configUrl = config?.[name]?.url;
      const envUrl = env[`VITE_${name.toUpperCase()}_API_URL`];
      if (customUrl && configUrl && env[`VITE_${name.toUpperCase()}_API_MODEL`]) {
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
  const env = import.meta.env;

  const get = (name, customUrl = false) => () => createProvider(name, configStore.config, env, customUrl);
  
  return {
    get openai() { return get('openai')(); },
    get grok() { return get('grok')(); },
    get claude() { return get('claude')(); },
    get gemini() { return get('gemini', true)(); },
    get customize() { return get('customize')(); },
    get free() { return get('free')(); },
  };
}
