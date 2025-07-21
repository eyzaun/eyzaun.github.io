import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/', // Repository isminin aynısı olduğu için / kullanabiliriz
  build: {
    outDir: 'dist',
    sourcemap: false
  }
})