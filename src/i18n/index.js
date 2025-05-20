import { createI18n } from 'vue-i18n'
import en_US from '../locales/en_US.json'
import zh_CN from '../locales/zh_CN.json'
import zh_TW from '../locales/zh_TW.json'

const messages = {
    en_US,
    zh_CN,
    zh_TW
}

// 支援的語言列表
const supportedLangs = ['en_US', 'zh_TW', 'zh_CN']

// Step 1: 嘗試讀取 localStorage
let lang = localStorage.getItem('lang')

// Step 2: 若無設定，根據瀏覽器或 Office 語言偵測
if (!lang) {
  const browserLang = navigator.language || navigator.userLanguage || 'zh-TW' // fallback
  const normalizedLang = browserLang.toLowerCase().replace('-', '_')

  // 自動判斷對應語言
  if (supportedLangs.includes(normalizedLang)) {
    lang = normalizedLang
  } else if (normalizedLang.startsWith('zh')) {
    lang = 'zh_TW'
  } else {
    lang = 'en_US'
  }

  // Office.context.displayLanguage 可用於 Outlook 增益集（如果有載入 Office.js）
  if (typeof Office !== 'undefined' && Office.context && Office.context.displayLanguage) {
    const officeLang = Office.context.displayLanguage.toLowerCase().replace('-', '_')
    if (supportedLangs.includes(officeLang)) {
      lang = officeLang
    }
  }

  localStorage.setItem('lang', lang)
}

const i18n = createI18n({
  legacy: false, // 使用 Composition API
  locale: lang,
  fallbackLocale: 'en_US',
  messages
})

export default i18n