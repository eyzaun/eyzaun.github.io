import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/eyzaun.github.io/', // GitHub Actions için repo ismi
  build: {
    outDir: 'dist',
    sourcemap: false,
    target: 'esnext',
    minify: 'terser'
  }
})