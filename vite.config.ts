import { fileURLToPath, URL } from 'node:url'
import { resolve } from 'path'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./botti', import.meta.url))
    }
  },
  build: {
    outDir: resolve(__dirname, "./website/dist/"),
    rollupOptions: {
      input: {
        main: resolve(__dirname, './website/public/index.html'),
      }
    }
  }
})
