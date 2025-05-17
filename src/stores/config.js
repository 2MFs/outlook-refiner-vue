import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useConfigStore = defineStore('config', () => {
  const config = ref({});

  async function loadConfig() {
    try {
      const res = await fetch('/api/config');
      config.value = await res.json();
    } catch (err) {
      //console.warn('載入設定失敗', err);

      config.value = false;
    }
  }

  /*
  function get(keyPath, fallback = null) {
    return keyPath.split('.').reduce((obj, key) => obj?.[key], config.value) ?? fallback;
  }*/

  return {
    config,
    loadConfig,
    //get,
  };
});
