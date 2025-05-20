import { createApp, onMounted } from 'vue'
import { createPinia } from 'pinia';
import './style.css'
import App from './App.vue'
import i18n from './i18n'
import FlowbitePlugin from './plugins/flowbite';

import languageSelectorComponent from "./components/LanguageSelector.vue";
import ClipboardButton from './components/ClipboardButton.vue';
import CopyButton from './components/CopyButton.vue';
import AlertDisplay from './components/AlertDisplay.vue';
import Spinner from './components/Spinner.vue';
import Declaration from './components/Declaration.vue';

Office.onReady(() => {
    const app = createApp(App);
    const pinia = createPinia();

    app.component('languageSelectorComponent', languageSelectorComponent)
    app.component('ClipboardButton', ClipboardButton)
    app.component('CopyButton', CopyButton)    
    app.component('AlertDisplay', AlertDisplay)
    app.component('Spinner', Spinner)
    app.component('Declaration', Declaration)

    app.use(FlowbitePlugin);
    
    app.use(pinia);
    app.use(i18n);
    app.mount('#app');
})