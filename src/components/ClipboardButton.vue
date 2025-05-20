<script setup>
import { ref } from 'vue'
import { ClipboardCheck, ClipboardList } from 'lucide-vue-next'

const props = defineProps({
  targetId: { type: String, required: true },
  defaultText: { type: String, default: 'Copy' },
  successText: { type: String, default: 'Copied' },
  contentType: { type: String, default: 'text' }, // 'text' or 'innerHTML'
  useHtmlEntities: { type: Boolean, default: false },
  buttonClass: { type: String, default: 'cursor-pointer text-gray-900 dark:text-gray-400 hover:bg-gray-100 dark:bg-gray-800 rounded-lg py-2 px-2.5 inline-flex items-center justify-center bg-white border-gray-200 border h-8' },
  tooltipId: { type: String, default: 'copy-tooltip' },
  ariaLabel: { type: String, default: 'Copy to clipboard' }
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

  if (navigator.clipboard && window.isSecureContext) {
    navigator.clipboard.writeText(textToCopy).then(() => {
      showCopied()
    }).catch(() => {
      fallbackCopy(textToCopy)
    })
  } else {
    fallbackCopy(textToCopy)
  }
}

const fallbackCopy = (text) => {
  const textarea = document.createElement('textarea')
  textarea.value = text
  textarea.style.position = 'fixed'
  textarea.style.opacity = '0'
  document.body.appendChild(textarea)
  textarea.focus()
  textarea.select()

  try {
    const successful = document.execCommand('copy')
    if (successful) {
      showCopied()
    }
  } catch (err) {
    console.error('Fallback copy failed', err)
  }

  document.body.removeChild(textarea)
}

const showCopied = () => {
  copied.value = true
  setTimeout(() => copied.value = false, 2000)
}

const encodeHtmlEntities = (str) => {
  const div = document.createElement('div')
  div.innerText = str
  return div.innerHTML
}
</script>

<template>
  <button
    :class="buttonClass"
    :aria-label="ariaLabel"
    :data-tooltip-target="tooltipId"
    data-tooltip-placement="top"
    @click="handleCopy"
    type="button"
  >
    <span class="inline-flex items-center">
      <component :is="copied ? ClipboardCheck : ClipboardList" class="w-3 h-3 me-1.5" />
      <span class="text-xs font-semibold">{{ copied ? successText : defaultText }}</span>
    </span>
  </button>

  <!-- Tooltip element -->
  <div
    :id="tooltipId"
    role="tooltip"
    class="absolute z-10 invisible inline-block px-3 py-2 text-sm font-medium text-white transition-opacity bg-gray-900 rounded-lg shadow-sm opacity-0 tooltip"
  >
    {{ copied ? successText : defaultText }}
    <div class="tooltip-arrow" data-popper-arrow></div>
  </div>
</template>
