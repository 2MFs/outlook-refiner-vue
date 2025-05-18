import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import tailwindcss from '@tailwindcss/vite'
import fs from 'fs'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
  server: {
    https: {
      key: fs.readFileSync(path.resolve(__dirname, 'localhost.key')),
      cert: fs.readFileSync(path.resolve(__dirname, 'localhost.crt')),
    },
    port: 5173,
    strictPort: true,
  },
  plugins: [vue(),tailwindcss(),],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
      "components": path.resolve(__dirname, "src/components"),
      "styles": path.resolve(__dirname, "src/styles"),
      "plugins": path.resolve(__dirname, "src/plugins"),
      "views": path.resolve(__dirname, "src/views"),
      "layouts": path.resolve(__dirname, "src/layouts"),
      "utils": path.resolve(__dirname, "src/utils"),
      "apis": path.resolve(__dirname, "src/apis"),
      "dirs": path.resolve(__dirname, "src/directives"),
      "assets": path.resolve(__dirname, "src/assets"),
      "stores": path.resolve(__dirname, "src/stores"),
      "locales": path.resolve(__dirname, "src/locales"),
      "i18n": path.resolve(__dirname, "src/i18n"),
    },
  }
  
})
