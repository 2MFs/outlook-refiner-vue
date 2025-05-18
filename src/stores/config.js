import { defineStore } from 'pinia';
import { ref, computed } from 'vue';

import i18n from 'i18n'
const { t } = i18n.global;

export const useConfigStore = defineStore('config', () => {
  const config = ref(null); // 用 null 表示尚未載入

  const isLoaded = computed(() => config.value !== null);

  async function loadConfig() {
    try {
      const res = await fetch('/api/config');
      config.value = await res.json();
    } catch (err) {
      console.warn(t('Failed to load settings.'), err);
      config.value = {}; // fallback 為空物件避免錯誤
    }
  }

  return {
    config,
    loadConfig,
    isLoaded,
  };
});