// src/utils/alerts.js

import { ref } from 'vue';

export const alertMessage = ref('');
export const alertType = ref('info'); // 'success' | 'error' | 'warning' | 'info'
export const alertVisible = ref(false);
export const alertTimeout = ref(null);

/**
 * 顯示提示訊息
 * @param {string} message 要顯示的訊息
 * @param {'success' | 'error' | 'warning' | 'info'} type 類型
 * @param {number} duration 顯示時長（毫秒）
 */
export function showAlert(message, type = 'info', duration = 3000) {
  alertMessage.value = message;
  alertType.value = type;
  alertVisible.value = true;

  if (alertTimeout.value) {
    clearTimeout(alertTimeout.value);
  }

  alertTimeout.value = setTimeout(() => {
    alertVisible.value = false;
  }, duration);
}

/**
 * 手動關閉提示
 */
export function hideAlert() {
  alertVisible.value = false;
}
