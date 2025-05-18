import { createI18n } from 'vue-i18n'
import en_US from '../locales/en_US.json'
import zh_CN from '../locales/zh_CN.json'
import zh_TW from '../locales/zh_TW.json'

const messages = {
    en_US,
    zh_CN,
    zh_TW
}

// 自動偵測語言，預設 zh
const browserLang = navigator.language.split('-')[0]
const savedLang = localStorage.getItem('lang')
const defaultLang = savedLang || (['en_US', 'zh_CN', 'zh_TW'].includes(browserLang) ? browserLang : 'zh_TW')

const i18n = createI18n({
    legacy: false, // 使用 Composition API
    locale: defaultLang,  // 預設語言
    fallbackLocale: 'en_US', // 後備語言
    messages
})

export default i18n