<!-- AlertDisplay.vue -->
<template>
  <div
    v-if="alertVisible"
    :class="[
      'fixed top-4 left-1/2 transform -translate-x-1/2 px-4 py-2 rounded shadow-md z-50 transition-opacity',
      alertClass
    ]"
  >
    {{ alertMessage }}
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { alertMessage, alertType, alertVisible } from 'utils/alerts';

const alertClass = computed(() => {
  switch (alertType.value) {
    case 'success':
      return 'bg-green-100 text-green-800';
    case 'error':
      return 'bg-red-100 text-red-800';
    case 'warning':
      return 'bg-yellow-100 text-yellow-800';
    default:
      return 'bg-blue-100 text-blue-800';
  }
});
</script>

<style scoped>
/* 可加上動畫效果 */
</style>
