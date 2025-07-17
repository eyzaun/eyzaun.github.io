import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/',
  build: {
    target: 'es2015',
    rollupOptions: {
      output: {
        manualChunks: undefined,
        format: 'es'
      }
    }
  }
})
