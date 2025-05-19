<template>
  <button
    :class="buttonClass"
    @click="handleCopy"
    :data-tooltip-target="tooltipId"
  >
    <span v-show="!copied" id="default-message">
      <slot name="default">
        <!-- 預設圖示與文字 -->
        <span class="inline-flex items-center">
            <svg class="w-3 h-3 me-1.5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 18 20">
                <path d="M16 1h-3.278A1.992 1.992 0 0 0 11 0H7a1.993 1.993 0 0 0-1.722 1H2a2 2 0 0 0-2 2v15a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V3a2 2 0 0 0-2-2Zm-3 14H5a1 1 0 0 1 0-2h8a1 1 0 0 1 0 2Zm0-4H5a1 1 0 0 1 0-2h8a1 1 0 1 1 0 2Zm0-5H5a1 1 0 0 1 0-2h2V2h4v2h2a1 1 0 1 1 0 2Z"/>
            </svg>
          <span class="text-xs font-semibold">{{ defaultText }}</span>
        </span>
      </slot>
    </span>
    <span v-show="copied" id="success-message">
      <slot name="success">
        <span class="inline-flex items-center">
          <svg class="w-3 h-3 text-blue-700 dark:text-blue-500 me-1.5" fill="none" viewBox="0 0 16 12">
            <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M1 5.917 5.724 10.5 15 1.5"/>
          </svg>
          <span class="text-xs font-semibold text-blue-700 dark:text-blue-500">{{ successText }}</span>
        </span>
      </slot>
    </span>
  </button>
</template>

<script setup>
import { ref } from 'vue'

const props = defineProps({
  targetId: { type: String, required: true },
  defaultText: { type: String, default: 'Copy' },
  successText: { type: String, default: 'Copied' },
  contentType: { type: String, default: 'text' }, // text or innerHTML
  useHtmlEntities: { type: Boolean, default: false },
  buttonClass: { type: String, default: 'cursor-pointer text-gray-900 dark:text-gray-400 hover:bg-gray-100 dark:bg-gray-800 rounded-lg py-2 px-2.5 inline-flex items-center justify-center bg-white border-gray-200 border h-8' },
  tooltipId: { type: String, default: '' }
})

const copied = ref(false)

const handleCopy = () => {
  const targetEl = document.getElementById(props.targetId)
  if (!targetEl) return

  let textToCopy = ''
  if (props.contentType === 'innerHTML') {
    textToCopy = props.useHtmlEntities
      ? encodeHtmlEntities(targetEl.innerHTML)
      : targetEl.innerHTML
  } else {
    textToCopy = targetEl.innerText || targetEl.value
  }

  navigator.clipboard.writeText(textToCopy).then(() => {
    copied.value = true
    setTimeout(() => copied.value = false, 2000)
  })
}

const encodeHtmlEntities = (str) => {
  const div = document.createElement('div')
  div.innerText = str
  return div.innerHTML
}
</script>
