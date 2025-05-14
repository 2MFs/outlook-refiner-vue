import { createApp } from 'vue'
import './style.css'
import App from './App.vue'

Office.onReady(() => {
    createApp(App).mount('#app')
})