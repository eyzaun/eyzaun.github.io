# Portfolio Website - Dosya Yapısı

## 📁 Proje Kök Dizini
```
portfolyo_site/
├── 📄 README.md
├── 📄 package.json
├── 📄 package-lock.json
├── 📄 vite.config.ts
├── 📄 tailwind.config.js
├── 📄 postcss.config.js
├── 📄 tsconfig.json
├── 📄 tsconfig.app.json
├── 📄 tsconfig.node.json
├── 📄 eslint.config.js
├── 📄 index.html
├── 📄 fix-github-pages.js
└── 📁 node_modules/
```

## 📁 Source Dizini (src/)
```
src/
├── 📄 main.tsx              # React uygulaması giriş noktası
├── 📄 App.tsx               # Ana uygulama komponenti
├── 📄 App.css               # Uygulama CSS dosyası
├── 📄 index.css             # Global CSS ve Tailwind imports
├── 📄 vite-env.d.ts         # Vite tip tanımları
├── 📁 assets/
│   └── 📄 react.svg         # React logosu
├── 📁 components/           # React komponentleri
│   ├── 📄 Header.tsx        # Navigasyon header'ı
│   ├── 📄 Hero.tsx          # Ana banner bölümü
│   ├── 📄 About.tsx         # Hakkımda bölümü
│   ├── 📄 Experience.tsx    # İş deneyimi bölümü
│   ├── 📄 Projects.tsx      # Projeler bölümü
│   ├── 📄 Skills.tsx        # Beceriler bölümü
│   ├── 📄 Contact.tsx       # İletişim bölümü
│   └── 📄 Footer.tsx        # Footer bölümü
└── 📁 data/
    └── 📄 portfolio.ts      # Tüm site verisi (kişisel bilgiler, projeler, vb.)
```

## 📁 Public Dizini (public/)
```
public/
├── 📄 .nojekyll            # GitHub Pages Jekyll devre dışı
└── 📄 vite.svg             # Vite logosu
```

## 📁 Build Dizini (dist/)
```
dist/                       # Build çıktıları (GitHub Pages'e deploy edilen)
├── 📄 index.html           # Ana HTML dosyası
├── 📄 app.txt              # MIME type sorunu için .txt uzantılı JS
├── 📄 .nojekyll            # GitHub Pages Jekyll devre dışı
├── 📄 vite.svg             # Vite logosu
└── 📁 assets/              # CSS ve diğer asset'ler
    └── 📄 index-*.css      # Hash'li CSS dosyası
```

## 📁 Configuration Dosyaları

### 📄 vite.config.ts - Vite Build Konfigürasyonu
```typescript
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
```

### 📄 package.json - NPM Konfigürasyonu
```json
{
  "name": "eyzaun.github.io",
  "scripts": {
    "dev": "vite",
    "build": "tsc -b && vite build && node fix-github-pages.js",
    "predeploy": "npm run build",
    "deploy": "gh-pages -d dist"
  }
}
```

### 📄 fix-github-pages.js - GitHub Pages MIME Type Fix
```javascript
// Otomatik olarak type="module" kaldırır
// .txt dosyasını HTML'e script tag olarak ekler
```

## 📁 Component Yapısı

### Header.tsx
- Navigasyon menüsü
- Logo/isim
- Mobil hamburger menü

### Hero.tsx  
- Ana banner
- İsim ve başlık
- CTA butonları

### About.tsx
- Kişisel bilgiler
- Eğitim geçmişi
- Kısa özgeçmiş

### Experience.tsx
- İş deneyimleri
- Stajlar
- Pozisyonlar ve tarihler

### Projects.tsx
- Portfolio projeleri
- GitHub linkleri
- Live demo linkleri
- Teknoloji stackleri

### Skills.tsx
- Teknik beceriler
- Kategorize edilmiş (Frontend, Backend, vs.)

### Contact.tsx
- İletişim formu (Formspree entegrasyonu)
- Sosyal medya linkleri
- Email ve telefon

### Footer.tsx
- Copyright bilgisi
- Ek linkler

## 📁 Data Yapısı

### portfolio.ts
```typescript
export const personalInfo = {
  name: "Eyüp Zafer Ünal",
  title: "Software Engineering Student",
  // ... diğer kişisel bilgiler
}

export const projects = [
  // Projeler array'i
]

export const skills = {
  // Beceriler kategorize
}

export const experience = [
  // İş deneyimleri
]
```

## 🚀 Deploy Süreci

1. **Development**: `npm run dev`
2. **Build**: `npm run build` 
3. **Deploy**: `npm run deploy`

### Build Süreci:
1. TypeScript compile (`tsc -b`)
2. Vite build (IIFE format, .txt extension)
3. GitHub Pages fix script çalışır
4. `dist/` klasörü GitHub Pages'e deploy edilir

### GitHub Pages Optimizasyonları:
- ✅ IIFE format (ES modules değil)
- ✅ .txt extension (MIME type bypass)
- ✅ Script tag body'de defer ile
- ✅ .nojekyll dosyası
- ✅ Otomatik build-deploy süreci
