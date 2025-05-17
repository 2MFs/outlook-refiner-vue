import { useConfigStore } from 'stores/config';

function getOverride(key, fallback) {
    const value = localStorage.getItem(key);
    
    return value !== null && value !== '' ? value : fallback;
}

function formatUrl(template, values) {
    return template.replace(/{(.*?)}/g, (_, key) => encodeURIComponent(values[key] || ''));
}

export function useProviders() {
    const configStore = useConfigStore();

    return {
        openai: {
            name: 'openai',
            get url() {                
                const envSetting = import.meta.env.VITE_OPENAI_API_URL;
                const configSetting = configStore.config?.openai?.url;
                return getOverride("openai_url", configSetting || envSetting || '');
            },
            get key() {
                return getOverride("openai_key", '');
            },
            get model() {
                const envSetting = import.meta.env.VITE_OPENAI_API_MODEL;
                const configSetting = configStore.config?.openai?.model;
                return getOverride("openai_model", configSetting || envSetting || '');
            },
            refinePrompt: (text, style) =>
                `請以「${style}」風格潤色以下內容：\n${text}`,
            translatePrompt: (text, lang) =>
                `請將下列文字翻譯成${lang}：\n${text}`,
        },
        grok: {
            name: 'grok',
            get url() {
                const envSetting = import.meta.env.VITE_GROK_API_URL;
                const configSetting = configStore.config?.grok?.url;
                return getOverride("grok_url", configSetting || envSetting || '');
            },
            get key() {
                return getOverride("grok_key", '');
            },
            get model() {
                const envSetting = import.meta.env.VITE_GROK_API_MODEL;
                const configSetting = configStore.config?.grok?.model;
                return getOverride("grok_model", configSetting || envSetting || '');
            },
            refinePrompt: (text, style) =>
                `潤色成${style}風格：${text}`,
            translatePrompt: (text, lang) =>
                `翻譯成${lang}：${text}`,
        },
        claude: {
            name: 'claude',
            get url() {
                const envSetting = import.meta.env.VITE_CLAUDE_API_URL;
                const configSetting = configStore.config?.claude?.url;
                return getOverride("claude_url", configSetting || envSetting || '');
            },
            get key() {
                return getOverride("claude_key", '');
            },
            get model() {
                const envSetting = import.meta.env.VITE_CLAUDE_API_MODEL;
                const configSetting = configStore.config?.claude?.model;
                return getOverride("claude_model", configSetting || envSetting || '');
            },
            refinePrompt: (text, style) =>
                `請使用 ${style} 風格潤色這段話：${text}`,
            translatePrompt: (text, lang) =>
                `翻譯以下內容成 ${lang}：${text}`,
        },
        gemini: {
            name: 'gemini',
            get url() {

                const envSetting = import.meta.env.VITE_GEMINI_API_MODEL;
                const configSetting = configStore.config?.gemini?.url;

                const modelEnvSetting= import.meta.env.VITE_GEMINI_API_MODEL;
                const modelConfigSetting = configStore.config?.gemini?.url;

                const geminiUrl = configSetting || envSetting || '';
                const geminiModel = modelConfigSetting || modelEnvSetting || '';

                const apiUrl = formatUrl(geminiUrl, {
                    model: geminiModel,
                    key: '',
                });

                return getOverride("gemini_url", apiUrl);
            },
            get key() {
                return getOverride("gemini_key", '');
            },
            get model() {
                const envSetting = import.meta.env.VITE_GEMINI_API_MODEL;
                const configSetting = configStore.config?.gemini?.model;
                return getOverride("gemini_model", configSetting || envSetting || '');
            },
            refinePrompt: (text, style) =>
                `用 ${style} 風格修飾以下句子：${text}`,
            translatePrompt: (text, lang) =>
                `請翻譯為 ${lang}：${text}`,
        },
        customize: {
            name: 'customize',
            get url() {
                const envSetting = import.meta.env.VITE_CUSTOMIZE_API_URL;
                const configSetting = configStore.config?.customize?.url;
                return getOverride("customize_url", configSetting || envSetting || '');
            },
            get key() {
                return getOverride("customize_key", '');
            },
            get model() {
                const envSetting = import.meta.env.VITE_CUSTOMIZE_API_MODEL;
                const configSetting = configStore.config?.customize?.model;
                return getOverride("customize_model", configSetting || envSetting || '');
            },
            refinePrompt: (text, style) =>
                `用 ${style} 風格修飾以下句子：${text}`,
            translatePrompt: (text, lang) =>
                `請翻譯為 ${lang}：${text}`,
        },
        free: {
            name: 'free',
            get url() {                
                const envSetting = import.meta.env.VITE_FREE_API_URL;
                const configSetting = configStore.config?.free?.url;                
                return getOverride("free_url", configSetting || envSetting || '');
            },
            get key() {
                return getOverride("free_key", '');
            },
            get model() {
                const envSetting = import.meta.env.VITE_FREE_API_MODEL;
                const configSetting = configStore.config?.free?.model;
                return getOverride("free_model", configSetting || envSetting || '');
            },
            refinePrompt: (text, style) =>
                `用 ${style} 風格修飾以下句子：${text}`,
            translatePrompt: (text, lang) =>
                `請翻譯為 ${lang}：${text}`,
        },
        // 可加入更多 provider
    };
}
