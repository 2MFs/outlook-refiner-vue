<script setup>
import { ref, computed } from 'vue'
import { useI18n } from 'vue-i18n'

const isOpen = ref(false)
const { locale } = useI18n()

defineProps({
  bgColor: {
    type: String,
    default: 'bg-white'
  },
  shadowSize: {
    type: String,
    default: 'shadow-sm'
  },
  ringSize: {
    type: String,
    default: 'ring-1'
  },
  ringColor: {
    type: String,
    default: 'ring-gray-300'
  },
  ringInset: {
    type: String,
    default: 'inset-ring'
  },
  ringInsetColor: {
    type: String,
    default: 'inset-ring-gray-300'
  }
})

// 語言列表（含國旗 Emoji）
const languages = {
  en_US: { label: 'English', flag: '🇺🇸' },
  zh_CN: { label: '简体中文', flag: '🇨🇳' },
  zh_TW: { label: '繁體中文', flag: '🇹🇼' }
}

// 設定語言
const switchLang = (lang) => {
  locale.value = lang
  localStorage.setItem('lang', lang)
  isOpen.value = false
}

const currentLabel = computed(() => languages[locale.value]?.label || 'Language')
const currentFlag = computed(() => languages[locale.value]?.flag || '🌐')

</script>

<template>

  <button id="dropdownTopButton" data-dropdown-toggle="dropdownTop" data-dropdown-placement="top" data-dropdown-trigger="click"
    :class="[bgColor, shadowSize, ringSize, ringColor, ringInset, ringInsetColor]"
    class="cursor-pointer me-3 mb-3 md:mb-0 text-gray-900 hover:bg-gray-50 font-mono font-semibold rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center" type="button">
    {{ currentFlag }}
    {{ currentLabel }} 
    <svg class="w-2.5 h-2.5 ms-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 10 6">
      <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5 5 1 1 5"/>
    </svg>
  </button>

  <!-- Dropdown menu -->
  <div id="dropdownTop" class="z-10 hidden bg-white divide-y divide-gray-100 rounded-lg shadow-sm w-44 dark:bg-gray-700 text-left font-mono">
      <ul class="py-2 text-sm text-gray-100 dark:text-gray-200" aria-labelledby="dropdownTopButton">
        <template v-for="(lang, code) in languages" :key="code">
          <li>
            <a href="#" @click="switchLang(code)"
              :class="[code === locale.value ? 'text-white' : 'text-gray-700', 'block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 font-mono']">
              <span class="mr-2 text-xl">{{ lang.flag }}</span>
              {{ lang.label }}
            </a>
          </li>
        </template>
        
      </ul>
  </div>
  
</template>
