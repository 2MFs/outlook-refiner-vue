<template>
  <button @click="copyFromTarget" :disabled="copied" :class="defaultClass">
    <slot>
      {{ copied ? "已複製!" : defaultButtonText }}
    </slot>
  </button>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
const { t } = useI18n();

const props = defineProps({
  target: {
    type: [String, Object], // CSS selector 或 ref
    required: true,
  },
  buttonText: {
    type: String
  },
  defaultClass: {
    type: String,
    default: 'cursor-pointer bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition',
  },
})

const defaultButtonText = computed(() => props.buttonText || t('Copy'));

const copied = ref(false)

const copyFromTarget = async () => {
  let targetEl

  // 支援 CSS selector 或 ref
  if (typeof props.target === 'string') {
    targetEl = document.querySelector(props.target)
  } else if (props.target?.value instanceof HTMLElement) {
    targetEl = props.target.value
  }

  if (!targetEl) {
    console.warn(`${t('Cannot find the element to copy.')}`)
    return
  }

  try {
    let text = ''
    if ('value' in targetEl) {
        if (!targetEl.value){
            text = targetEl.value
        } else {
            console.warn(`${t('Cannot find the element to copy.')}`)
        }
      
    } else {
        if (targetEl.textContent){
            text = targetEl.textContent || ''
        } else {
            console.warn(`${t('Cannot find the element to copy.')}`)
        }
      
    }

    await navigator.clipboard.writeText(text)
    copied.value = true
    setTimeout(() => (copied.value = false), 2000)
  } catch (err) {
    console.error(`${t('Copy failed:')}`, err)
  }
}
</script>
