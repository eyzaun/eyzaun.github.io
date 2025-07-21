import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: './', // Relative base için değiştirildi
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    rollupOptions: {
      output: {
        format: 'umd', // IIFE yerine UMD format (daha stabil)
        name: 'Portfolio',
        inlineDynamicImports: true,
        assetFileNames: 'assets/[name].[ext]',
        entryFileNames: 'app.js', // .txt yerine .js (daha güvenli)
        chunkFileNames: 'assets/[name].js'
      }
    }
  }
})