import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import mkcert from 'vite-plugin-mkcert'
import fs from 'fs'

// https://vite.dev/config/
export default defineConfig({
  server: {
    https: {
      key: fs.readFileSync('./localhost-key.pem'),
      cert: fs.readFileSync('./localhost.pem'),
    },
    host: 'localhost',
    port: 5173
  },
  plugins: [vue(),mkcert()],
})
