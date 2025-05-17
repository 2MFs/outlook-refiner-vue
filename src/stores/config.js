import { defineStore } from 'pinia';
import { ref, computed } from 'vue';

export const useConfigStore = defineStore('config', () => {
  const config = ref(null); // 用 null 表示尚未載入

  const isLoaded = computed(() => config.value !== null);

  async function loadConfig() {
    try {
      const res = await fetch('/api/config');
      config.value = await res.json();
    } catch (err) {
      console.warn('載入設定失敗', err);
      config.value = {}; // fallback 為空物件避免錯誤
    }
  }

  return {
    config,
    loadConfig,
    isLoaded,
  };
});