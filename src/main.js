import { createApp, onMounted } from 'vue'
import { createPinia } from 'pinia';
import { initFlowbite } from 'flowbite'
import './style.css'
import App from './App.vue'
import i18n from './i18n'

// initialize components based on data attribute selectors
onMounted(() => {
    initFlowbite();
})

import languageSelectorComponent from "./components/LanguageSelector.vue";

Office.onReady(() => {
    const app = createApp(App);
    const pinia = createPinia();

    app.component('languageSelectorComponent', languageSelectorComponent)
    
    app.use(pinia);
    app.use(i18n);
    app.mount('#app');
})