import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/',
  build: {
    outDir: 'dist',
    rollupOptions: {
      output: {
        format: 'iife',
        name: 'Portfolio',
        inlineDynamicImports: true,
        assetFileNames: 'assets/[name].[ext]',
        entryFileNames: 'app.txt', // .txt extension to bypass MIME issues
        chunkFileNames: 'assets/[name].txt'
      }
    }
  }
})
