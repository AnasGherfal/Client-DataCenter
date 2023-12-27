import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
    build: {
        outDir: "../wwwroot",
    },
    server: {
        proxy: {
            "/v1.0/management": {
                changeOrigin: false,
                secure: false,
                target: "https://localhost:7144",
            },
        },
    },
  plugins: [vue()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  }
})


