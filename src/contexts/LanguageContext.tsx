import React, { createContext, useContext, useState, ReactNode } from 'react';

export type Language = 'tr' | 'en';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

interface LanguageProviderProps {
  children: ReactNode;
}

export const LanguageProvider: React.FC<LanguageProviderProps> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('tr');

  const t = (key: string): string => {
    return (translations[language] as any)[key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

// Çeviri verileri
const translations = {
  tr: {
    // Navigation
    'nav.home': 'Ana Sayfa',
    'nav.about': 'Hakkımda',
    'nav.experience': 'Deneyim',
    'nav.projects': 'Projeler',
    'nav.skills': 'Yetenekler',
    'nav.contact': 'İletişim',
    
    // Hero Section
    'hero.greeting': 'Merhaba, Ben Eyüp Zafer ÜNAL',
    'hero.viewProjects': 'Projelerimi Gör',
    'hero.contact': 'İletişime Geç',
    
    // About Section
    'about.title': 'Hakkımda',
    'about.education': 'Eğitim',
    
    // Experience Section
    'experience.title': 'Deneyim',
    
    // Projects Section
    'projects.title': 'Projeler',
    'projects.moreProjects': 'Daha Fazla Proje',
    
    // Skills Section
    'skills.title': 'Yetenekler',
    'skills.programming': 'Programlama Dilleri',
    'skills.frameworks': 'Framework & Kütüphaneler',
    'skills.tools': 'Araçlar & Teknolojiler',
    'skills.databases': 'Veritabanları',
    
    // Contact Section
    'contact.title': 'İletişim',
    'contact.subtitle': 'Benimle iletişime geçin',
    'contact.description': 'Projeleriniz hakkında konuşmak veya işbirliği yapmak için benimle iletişime geçebilirsiniz.',
    'contact.name': 'Adınız',
    'contact.email': 'E-posta',
    'contact.message': 'Mesajınız',
    'contact.send': 'Mesaj Gönder',
    'contact.sending': 'Gönderiliyor...',
    'contact.success': 'Mesajınız başarıyla gönderildi!',
    'contact.error': 'Mesaj gönderilirken bir hata oluştu.',
    
    // Footer
    'footer.quickLinks': 'Hızlı Linkler',
    'footer.contact': 'İletişim',
    'footer.madeWith': 'Made with',
    'footer.lastUpdate': 'Son güncelleme',
    
    // Common
    'common.loading': 'Yükleniyor...',
    'common.error': 'Hata',
  },
  en: {
    // Navigation
    'nav.home': 'Home',
    'nav.about': 'About',
    'nav.experience': 'Experience',
    'nav.projects': 'Projects',
    'nav.skills': 'Skills',
    'nav.contact': 'Contact',
    
    // Hero Section
    'hero.greeting': 'Hello, I\'m Eyüp Zafer ÜNAL',
    'hero.viewProjects': 'View My Projects',
    'hero.contact': 'Get in Touch',
    
    // About Section
    'about.title': 'About Me',
    'about.education': 'Education',
    
    // Experience Section
    'experience.title': 'Experience',
    
    // Projects Section
    'projects.title': 'Projects',
    'projects.moreProjects': 'More Projects',
    
    // Skills Section
    'skills.title': 'Skills',
    'skills.programming': 'Programming Languages',
    'skills.frameworks': 'Frameworks & Libraries',
    'skills.tools': 'Tools & Technologies',
    'skills.databases': 'Databases',
    
    // Contact Section
    'contact.title': 'Contact',
    'contact.subtitle': 'Get in touch with me',
    'contact.description': 'Feel free to reach out to discuss your projects or collaborate.',
    'contact.name': 'Your Name',
    'contact.email': 'Email',
    'contact.message': 'Your Message',
    'contact.send': 'Send Message',
    'contact.sending': 'Sending...',
    'contact.success': 'Your message has been sent successfully!',
    'contact.error': 'An error occurred while sending the message.',
    
    // Footer
    'footer.quickLinks': 'Quick Links',
    'footer.contact': 'Contact',
    'footer.madeWith': 'Made with',
    'footer.lastUpdate': 'Last updated',
    
    // Common
    'common.loading': 'Loading...',
    'common.error': 'Error',
  }
};
