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
    'hero.title': 'Yazılım Geliştirici',
    'hero.description': 'Hacettepe Üniversitesi Bilgisayar Mühendisliği mezunu. Yazılım geliştirme, yapay zeka/makine öğrenmesi ve full-stack development alanlarında deneyimim var. İnovatif çözümler üretmek ve en son teknolojilerle çalışmak beni motive ediyor.',
    'hero.location': 'Ankara, Türkiye',
    'hero.viewProjects': 'Projelerimi Gör',
    'hero.contact': 'İletişime Geç',
    
    // About Section
    'about.title': 'Hakkımda',
    'about.personalInfo': 'Kişisel Bilgiler',
    'about.education': 'Eğitim',
    'about.certifications': 'Sertifikalar',
    'about.relevantCourses': 'İlgili Dersler',
    'about.description1': 'Hacettepe Üniversitesi Bilgisayar Mühendisliği mezunuyum. Yazılım geliştirme, yapay zeka ve makine öğrenmesi alanlarında kapsamlı deneyime sahibim. Özellikle full-stack development ve AI/ML projeleri konularında uzmanlaşmaya devam ediyorum.',
    'about.description2': 'Binary Brain Technology ve TellUS firmalarında yazılım geliştirici stajyeri olarak çalıştım. Bu deneyimlerimde AvukatLLM adlı AI destekli hukuki asistan geliştirdim, OBD2 ve CANbus protokolleri ile araç sistemleri üzerinde çalıştım ve çeşitli web/mobil uygulamalar geliştirdim.',
    'about.description3': 'İnovatif çözümler üretmek ve en son teknolojilerle çalışmak beni motive ediyor. Takım çalışmasına yatkın, öğrenmeye açık ve problem çözme odaklı yaklaşımım var. Sürekli gelişim halindeki teknoloji dünyasını yakından takip ederek kendimi güncel tutmaya odaklanıyorum.',
    
    // Experience Section
    'experience.title': 'Deneyim',
    
    // Projects Section
    'projects.title': 'Projeler',
    'projects.moreProjects': 'Daha Fazla Proje',
    
    // Skills Section
    'skills.title': 'Yetenekler',
    'skills.continuousLearning': 'Sürekli Öğrenmeye Açık',
    'skills.description': 'Teknoloji hızla gelişiyor ve ben de bu gelişimi takip etmeye, yeni teknolojileri öğrenmeye ve mevcut bilgimi güncel tutmaya odaklanıyorum. Her proje benim için yeni bir öğrenme fırsatı ve mesleki gelişimime katkı sağlıyor.',
    'skills.programming': 'Programlama Dilleri',
    'skills.frameworks': 'Framework & Kütüphaneler',
    'skills.tools': 'Araçlar & Teknolojiler',
    'skills.databases': 'Veritabanları',
    'skills.languagesFrameworks': 'Diller & Framework\'ler',
    'skills.frontend': 'Frontend',
    'skills.backend': 'Backend',
    'skills.aiMl': 'AI/ML',
    'skills.toolsTech': 'Araçlar & Teknolojiler',
    
    // Contact Section
    'contact.title': 'İletişim',
    'contact.subtitle': 'Benimle İletişime Geçin',
    'contact.description': 'Projeleriniz, iş fırsatları veya işbirliği önerileri için benimle iletişime geçebilirsiniz. Size mümkün olan en kısa sürede dönüş yapacağım.',
    'contact.name': 'Adınız',
    'contact.email': 'Email',
    'contact.subject': 'Konu',
    'contact.message': 'Mesaj',
    'contact.send': 'Mesaj Gönder',
    'contact.sending': 'Gönderiliyor...',
    'contact.success': 'Mesajınız başarıyla gönderildi!',
    'contact.error': 'Mesaj gönderilirken bir hata oluştu.',
    'contact.phone': 'Telefon',
    'contact.location': 'Konum',
    'contact.socialMedia': 'Sosyal Medya',
    'contact.formActive': 'Form aktif! Mesajınız doğrudan email adresime iletilecektir.',
    'contact.placeholders.name': 'Adınızı girin',
    'contact.placeholders.email': 'Email adresinizi girin',
    'contact.placeholders.subject': 'Mesaj konusu',
    'contact.placeholders.message': 'Mesajınızı buraya yazın...',
    
    // Footer
    'footer.quickLinks': 'Hızlı Linkler',
    'footer.contact': 'İletişim',
    'footer.madeWith': '❤️ ile yapıldı',
    'footer.lastUpdate': 'Son güncelleme',
    
    // Education Data
    'education.computerEngineering': 'Bilgisayar Mühendisliği - Mezun',
    'education.hacettepeUniversity': 'Hacettepe Üniversitesi',
    'education.scienceHighSchool': 'Fen Lisesi',
    'education.ankaraFenLisesi': 'Ankara Fen Lisesi',
    'education.scienceArtCenter': 'Bilim ve Sanat Merkezi',
    'education.ankaraBilsem': 'Ankara BİLSEM',
    
    // Certifications Data
    'certifications.aspNetCore': 'ASP.NET Core web uygulaması geliştirme ve API tüketimi',
    'certifications.aspNetCoreDesc': 'ASP.NET Core web uygulamaları geliştirme ve API\'leri kullanma becerileri, HTTP istemcileri uygulama ve API entegrasyonu',
    'certifications.netAspire': '.NET Aspire ile dağıtık uygulama geliştirme',
    'certifications.netAspireDesc': '.NET Aspire stack\'i kullanarak dağıtık uygulamalar geliştirme, mikroservis mimarisi ve bulut-natif uygulama geliştirme',
    
    // Courses Data
    'courses.softwareArchitecture': 'Yazılım Mimarisi',
    'courses.embeddedSystems': 'Gömülü Sistemler',
    'courses.databaseManagement': 'Veritabanı Yönetim Sistemleri',
    'courses.computerGraphics': 'Bilgisayar Grafikleri',
    'courses.gameTechnologies': 'Oyun Teknolojileri',
    'courses.algorithmDesign': 'Algoritma Tasarımı',
    'courses.dataStructures': 'Veri Yapıları',
    
    // Experience Data
    'experience.binaryBrain.title': 'Yazılım Geliştirici Stajyeri',
    'experience.binaryBrain.company': 'Binary Brain Technology Inc.',
    'experience.binaryBrain.period': 'Ocak 2025 - Şubat 2025',
    'experience.binaryBrain.description': 'Microsoft\'un Phi-4 modeli kullanarak AvukatLLM adlı AI destekli hukuki asistan geliştirme projesini yönettim. Türk vergi hukuku danışmanlığında %85 yanıt doğruluğu elde ettim. Model quantization teknikleri ile bellek gereksinimlerini %75 azalttım. Flutter ve Firebase kullanarak cross-platform mobil ve web uygulamalar geliştirdim.',
    'experience.tellus.title': 'Yazılım Geliştirici Stajyeri',
    'experience.tellus.company': 'TellUS',
    'experience.tellus.period': 'Haziran 2024 - Ağustos 2024',
    'experience.tellus.description': 'Gerçek zamanlı araç veri iletişimi için OBD2 ve CANbus protokollerini uyguladım. PID kontrol algoritmaları ile Arduino tabanlı sistem mimarisi geliştirdim. %95 sistem güvenilirliği elde eden kapsamlı test prosedürleri oluşturdum.',
    
    // Common
    'common.loading': 'Yükleniyor...',
    'common.error': 'Hata',
    'common.viewMore': 'Daha Fazla Gör',
    'common.viewLess': 'Daha Az Gör',
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
    'hero.title': 'Software Developer',
    'hero.description': 'Computer Engineering graduate from Hacettepe University with expertise in software development, AI/ML, and full-stack development. Passionate about creating innovative solutions and working with cutting-edge technologies.',
    'hero.location': 'Ankara, Turkey',
    'hero.viewProjects': 'View My Projects',
    'hero.contact': 'Get in Touch',
    
    // About Section
    'about.title': 'About Me',
    'about.personalInfo': 'Personal Information',
    'about.education': 'Education',
    'about.certifications': 'Certifications',
    'about.relevantCourses': 'Relevant Courses',
    'about.description1': 'I\'m a Computer Engineering graduate from Hacettepe University with comprehensive experience in software development, artificial intelligence, and machine learning. I continue to specialize in full-stack development and AI/ML projects.',
    'about.description2': 'I worked as a software engineering intern at Binary Brain Technology and TellUS. During these experiences, I developed AvukatLLM, an AI-powered legal assistant, worked on vehicle systems using OBD2 and CANbus protocols, and developed various web/mobile applications.',
    'about.description3': 'Creating innovative solutions and working with cutting-edge technologies motivates me. I have a collaborative approach, am open to learning, and focus on problem-solving. I stay current by closely following the continuously evolving technology world.',
    
    // Experience Section
    'experience.title': 'Experience',
    
    // Projects Section
    'projects.title': 'Projects',
    'projects.moreProjects': 'More Projects',
    
    // Skills Section
    'skills.title': 'Skills',
    'skills.continuousLearning': 'Continuous Learning',
    'skills.description': 'Technology evolves rapidly, and I focus on following this development, learning new technologies, and keeping my current knowledge up to date. Every project is a new learning opportunity for me and contributes to my professional development.',
    'skills.programming': 'Programming Languages',
    'skills.frameworks': 'Frameworks & Libraries',
    'skills.tools': 'Tools & Technologies',
    'skills.databases': 'Databases',
    'skills.languagesFrameworks': 'Languages & Frameworks',
    'skills.frontend': 'Frontend',
    'skills.backend': 'Backend',
    'skills.aiMl': 'AI/ML',
    'skills.toolsTech': 'Tools & Technologies',
    
    // Contact Section
    'contact.title': 'Contact',
    'contact.subtitle': 'Get in Touch with Me',
    'contact.description': 'You can contact me for your projects, job opportunities, or collaboration proposals. I will get back to you as soon as possible.',
    'contact.name': 'Your Name',
    'contact.email': 'Email',
    'contact.subject': 'Subject',
    'contact.message': 'Message',
    'contact.send': 'Send Message',
    'contact.sending': 'Sending...',
    'contact.success': 'Your message has been sent successfully!',
    'contact.error': 'An error occurred while sending the message.',
    'contact.phone': 'Phone',
    'contact.location': 'Location',
    'contact.socialMedia': 'Social Media',
    'contact.formActive': 'Form is active! Your message will be sent directly to my email address.',
    'contact.placeholders.name': 'Enter your name',
    'contact.placeholders.email': 'Enter your email address',
    'contact.placeholders.subject': 'Message subject',
    'contact.placeholders.message': 'Write your message here...',
    
    // Footer
    'footer.quickLinks': 'Quick Links',
    'footer.contact': 'Contact',
    'footer.madeWith': 'Made with ❤️',
    'footer.lastUpdate': 'Last updated',
    
    // Education Data
    'education.computerEngineering': 'Computer Engineering - Graduate',
    'education.hacettepeUniversity': 'Hacettepe University',
    'education.scienceHighSchool': 'Science High School',
    'education.ankaraFenLisesi': 'Ankara Science High School',
    'education.scienceArtCenter': 'Science and Art Center',
    'education.ankaraBilsem': 'Ankara Science and Art Center',
    
    // Certifications Data
    'certifications.aspNetCore': 'Develop an ASP.NET Core web app that consumes an API',
    'certifications.aspNetCoreDesc': 'Skills in developing ASP.NET Core web applications and consuming APIs, Implementation of HTTP clients and API integration',
    'certifications.netAspire': '.NET Aspire for distributed application development',
    'certifications.netAspireDesc': 'Utilizing .NET Aspire stack for distributed applications, Microservice architecture and cloud-native application development',
    
    // Courses Data
    'courses.softwareArchitecture': 'Software Architecture',
    'courses.embeddedSystems': 'Embedded Systems',
    'courses.databaseManagement': 'Database Management Systems',
    'courses.computerGraphics': 'Computer Graphics',
    'courses.gameTechnologies': 'Game Technologies',
    'courses.algorithmDesign': 'Algorithm Design',
    'courses.dataStructures': 'Data Structures',
    
    // Experience Data
    'experience.binaryBrain.title': 'Software Engineering Intern',
    'experience.binaryBrain.company': 'Binary Brain Technology Inc.',
    'experience.binaryBrain.period': 'January 2025 - February 2025',
    'experience.binaryBrain.description': 'Led the development of AvukatLLM, an AI-powered legal assistant using Microsoft\'s Phi-4 model, achieving 85% response accuracy in Turkish tax law consultations. Implemented model quantization techniques reducing memory requirements by 75% while maintaining performance. Architected and enhanced cross-platform mobile and web applications using Flutter with Firebase backend.',
    'experience.tellus.title': 'Software Engineering Intern',
    'experience.tellus.company': 'TellUS',
    'experience.tellus.period': 'June 2024 - August 2024',
    'experience.tellus.description': 'Implemented OBD2 and CANbus protocols for real-time vehicle data communication. Engineered Arduino-based system architecture with PID control algorithms. Created comprehensive testing procedures achieving 95% system reliability.',
    
    // Common
    'common.loading': 'Loading...',
    'common.error': 'Error',
    'common.viewMore': 'View More',
    'common.viewLess': 'View Less',
  }
};