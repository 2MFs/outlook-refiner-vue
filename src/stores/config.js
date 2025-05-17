import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useConfigStore = defineStore('config', () => {
  const config = ref({});

  async function loadConfig() {
    try {
      const res = await fetch('/api/config');
      config.value = await res.json();
      console.log(config);
    } catch (err) 
    {
      config.value = ref({});
      console.warn('載入設定失敗', err);
      
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
