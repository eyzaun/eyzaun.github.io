# Portfolio Website - Eyüp Zafer Ünal

Modern ve responsive bir portfolyo sitesi. React, TypeScript ve Tailwind CSS kullanılarak geliştirilmiştir.

## 🚀 Özellikler

- **Modern Tasarım**: Responsive ve kullanıcı dostu arayüz
- **Tek Sayfa Uygulama**: Smooth scroll navigasyon
- **TypeScript**: Tip güvenliği ve gelişmiş geliştirme deneyimi
- **Tailwind CSS**: Utility-first CSS framework
- **GitHub Pages**: Otomatik deployment
- **Performanslı**: Vite build sistemi

## 🛠️ Teknolojiler

- React 19
- TypeScript
- Tailwind CSS
- Vite
- Lucide React (Icons)
- GitHub Pages

## 📋 Bölümler

- **Ana Sayfa**: Kişisel tanıtım ve genel bilgiler
- **Hakkımda**: Detaylı bilgiler, eğitim ve sertifikalar
- **Deneyim**: İş deneyimleri ve stajlar
- **Projeler**: Gerçekleştirilen projeler ve detayları
- **Yetenekler**: Teknik beceriler ve kategoriler
- **İletişim**: Contact form ve iletişim bilgileri

## 🚀 Kurulum

```bash
# Bağımlılıkları yükle
npm install

# Geliştirme sunucusunu başlat
npm run dev

# Production build
npm run build

# GitHub Pages'e deploy et
npm run deploy
```

## 📁 Proje Yapısı

```
src/
├── components/          # React bileşenleri
│   ├── Header.tsx      # Navigasyon
│   ├── Hero.tsx        # Ana sayfa
│   ├── About.tsx       # Hakkımda
│   ├── Experience.tsx  # Deneyim
│   ├── Projects.tsx    # Projeler
│   ├── Skills.tsx      # Yetenekler
│   ├── Contact.tsx     # İletişim
│   └── Footer.tsx      # Footer
├── data/               # Statik veriler
│   └── portfolio.ts    # Portfolyo verileri
├── App.tsx             # Ana bileşen
└── main.tsx            # Entry point
```

## 🌐 Deployment

Site GitHub Pages üzerinde otomatik olarak deploy edilir:
- `main` branch'e push yapıldığında otomatik deploy
- Site URL: `https://eyzaun.github.io/`

## 📧 İletişim

- **Email**: eyzaun@gmail.com
- **GitHub**: [@eyzaun](https://github.com/eyzaun)
- **LinkedIn**: [LinkedIn Profil](https://linkedin.com/in/eyupzaferunal)

---

2025 © Eyüp Zafer Ünal. Tüm hakları saklıdır.
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default tseslint.config([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```
