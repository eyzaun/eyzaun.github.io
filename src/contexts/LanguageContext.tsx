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
    'projects.journeyOfCrops.name': 'Journey Of Crops',
    'projects.journeyOfCrops.description': 'Tarımsal optimizasyon oyunu, kaynak yönetimi ve algoritmaları içeren interaktif bir deneyim.',
    'projects.journeyOfCrops.feature1': 'Dinamik programlama kullanarak kaynak optimizasyonu (Knapsack algoritmaları)',
    'projects.journeyOfCrops.feature2': 'Three.js ve WebGL2 kullanarak interaktif ray sistemi simülasyonu',
    'projects.journeyOfCrops.feature3': 'Algoritmik çözümlerin animasyonlu görselleştirilmesi',
    'projects.journeyOfCrops.feature4': 'Optimizasyon sonuçlarına dayalı puan hesaplama sistemi',
    'projects.linkedHU.name': 'LinkedHU',
    'projects.linkedHU.description': 'Öğrenci ve öğretim üyelerini birbirine bağlayan üniversite ağ platformu.',
    'projects.linkedHU.feature1': 'Çevik metodoloji kullanarak kapsamlı test prosedürleri ile backend işlevselliği',
    'projects.linkedHU.feature2': 'Kullanıcı kimlik doğrulama ve profil yönetim sistemleri',
    'projects.linkedHU.feature3': 'Üniversite ağ özellikleri için RESTful API\'ler',
    'projects.linkedHU.feature4': 'CI/CD entegrasyonu ile kod kalitesi ve performans optimizasyonu',
    'projects.avukatLLM.name': 'AvukatLLM',
    'projects.avukatLLM.description': 'Türk vergi hukuku danışmanlığında uzmanlaşmış AI destekli hukuki asistan.',
    'projects.avukatLLM.feature1': 'Türk vergi hukuku danışmanlığında %85 yanıt doğruluğu',
    'projects.avukatLLM.feature2': '%75 bellek azaltımı için model quantization',
    'projects.avukatLLM.feature3': 'Sürekli model iyileştirme pipeline\'ı',
    'projects.avukatLLM.feature4': 'Türkçe odaklı çoklu dil desteği',
    'projects.goDash.name': 'GoDash',
    'projects.goDash.description': 'Sistem İzleme Aracı - Otomatik uyarılarla gerçek zamanlı sistem izleme panosu.',
    'projects.goDash.feature1': 'Go, Gin framework ve WebSocket bağlantıları kullanarak gerçek zamanlı sistem izleme panosu geliştirme',
    'projects.goDash.feature2': 'Email/webhook ile otomatik uyarı sistemi ile CPU, bellek ve disk kullanımı takibi',
    'projects.goDash.feature3': 'Geçmiş veri analizi için GORM kullanarak PostgreSQL depolamalı REST API tasarımı',
    'projects.goDash.feature4': 'Cross-platform deployment için responsive web arayüzü ve Docker konteynerizasyonu',
    
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
    'contact.getInTouch': 'Benimle İletişime Geçin',
    'contact.description': 'Projeleriniz, iş fırsatları veya işbirliği önerileri için benimle iletişime geçebilirsiniz. Size mümkün olan en kısa sürede dönüş yapacağım.',
    'contact.email': 'Email',
    'contact.phone': 'Telefon',
    'contact.location': 'Konum',
    'contact.socialMedia': 'Sosyal Medya',
    'contact.form.title': 'Mesaj Gönder',
    'contact.form.name': 'Adınız',
    'contact.form.email': 'Email',
    'contact.form.subject': 'Konu',
    'contact.form.message': 'Mesaj',
    'contact.form.send': 'Mesaj Gönder',
    'contact.form.namePlaceholder': 'Adınızı girin',
    'contact.form.emailPlaceholder': 'Email adresinizi girin',
    'contact.form.subjectPlaceholder': 'Mesaj konusu',
    'contact.form.messagePlaceholder': 'Mesajınızı buraya yazın...',
    'contact.form.formActive': 'Form aktif! Mesajınız doğrudan email adresime iletilecektir.',
    
    // Skills Categories
    'skills.categories.languagesFrameworks': 'Diller & Framework\'ler',
    'skills.categories.frontend': 'Frontend',
    'skills.categories.backend': 'Backend',
    'skills.categories.aiMl': 'AI/ML',
    'skills.categories.databases': 'Veritabanları',
    'skills.categories.tools': 'Araçlar & Teknolojiler',
    'skills.continuousLearning.title': 'Sürekli Öğrenmeye Açık',
    'skills.continuousLearning.description': 'Teknoloji hızla gelişiyor ve ben de bu gelişimi takip etmeye, yeni teknolojileri öğrenmeye ve mevcut bilgimi güncel tutmaya odaklanıyorum. Her proje benim için yeni bir öğrenme fırsatı.',
    
    // Footer
    'footer.description': 'Yazılım geliştirme, AI/ML ve yenilikçi çözümler konusunda tutkulu Bilgisayar Mühendisliği mezunu.',
    'footer.quickLinks': 'Hızlı Linkler',
    'footer.madeWith': 'ile yapıldı',
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
    'experience.binaryBrain.description1': 'Microsoft\'un Phi-4 modeli kullanarak AvukatLLM adlı AI destekli hukuki asistan geliştirme projesini yönettim, Türk vergi hukuku danışmanlığında %85 yanıt doğruluğu elde ettim',
    'experience.binaryBrain.description2': 'Model quantization teknikleri uygulayarak bellek gereksinimlerini %75 azalttım ve performansı korudum',
    'experience.binaryBrain.description3': 'Flutter ve Firebase backend kullanarak cross-platform mobil ve web uygulamalar tasarladım ve geliştirdim',
    'experience.binaryBrain.description4': 'Sürekli model iyileştirmeleri için PyTorch ve Transformers kullanarak etkili model eğitim pipeline\'ı oluşturdum',
    'experience.tellus.title': 'Yazılım Geliştirici Stajyeri',
    'experience.tellus.company': 'TellUS',
    'experience.tellus.period': 'Haziran 2024 - Ağustos 2024',
    'experience.tellus.description1': 'Gerçek zamanlı araç veri iletişimi için OBD2 ve CANbus protokollerini uyguladım',
    'experience.tellus.description2': 'PID kontrol algoritmaları ile Arduino tabanlı sistem mimarisi geliştirdim',
    'experience.tellus.description3': '%95 sistem güvenilirliği elde eden kapsamlı test prosedürleri oluşturdum',
    
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
    'projects.journeyOfCrops.name': 'Journey Of Crops',
    'projects.journeyOfCrops.description': 'An interactive agricultural optimization game featuring resource management and algorithms.',
    'projects.journeyOfCrops.feature1': 'Resource optimization using dynamic programming (Knapsack algorithms)',
    'projects.journeyOfCrops.feature2': 'Interactive rail system simulation using Three.js and WebGL2',
    'projects.journeyOfCrops.feature3': 'Animated visualization of algorithmic solutions',
    'projects.journeyOfCrops.feature4': 'Score calculation system based on optimization results',
    'projects.linkedHU.name': 'LinkedHU',
    'projects.linkedHU.description': 'A university networking platform connecting students and faculty members.',
    'projects.linkedHU.feature1': 'Backend functionality with comprehensive testing procedures using agile methodology',
    'projects.linkedHU.feature2': 'User authentication and profile management systems',
    'projects.linkedHU.feature3': 'RESTful APIs for university networking features',
    'projects.linkedHU.feature4': 'Code quality and performance optimization with CI/CD integration',
    'projects.avukatLLM.name': 'AvukatLLM',
    'projects.avukatLLM.description': 'AI-powered legal assistant specializing in Turkish tax law consultations.',
    'projects.avukatLLM.feature1': '85% response accuracy in Turkish tax law consultations',
    'projects.avukatLLM.feature2': 'Model quantization for 75% memory reduction',
    'projects.avukatLLM.feature3': 'Continuous model improvement pipeline',
    'projects.avukatLLM.feature4': 'Multi-language support with Turkish focus',
    'projects.goDash.name': 'GoDash',
    'projects.goDash.description': 'System Monitoring Tool - Real-time system monitoring dashboard with automated alerts.',
    'projects.goDash.feature1': 'Built real-time system monitoring dashboard using Go, Gin framework, and WebSocket connections',
    'projects.goDash.feature2': 'Implemented CPU, memory, and disk usage tracking with automated alert system via email/webhook',
    'projects.goDash.feature3': 'Designed REST API with PostgreSQL storage using GORM for historical data analysis',
    'projects.goDash.feature4': 'Created responsive web interface and Docker containerization for cross-platform deployment',
    
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
    'contact.getInTouch': 'Get in Touch with Me',
    'contact.description': 'You can contact me for your projects, job opportunities, or collaboration proposals. I will get back to you as soon as possible.',
    'contact.email': 'Email',
    'contact.phone': 'Phone',
    'contact.location': 'Location',
    'contact.socialMedia': 'Social Media',
    'contact.form.title': 'Send Message',
    'contact.form.name': 'Your Name',
    'contact.form.email': 'Email',
    'contact.form.subject': 'Subject',
    'contact.form.message': 'Message',
    'contact.form.send': 'Send Message',
    'contact.form.namePlaceholder': 'Enter your name',
    'contact.form.emailPlaceholder': 'Enter your email address',
    'contact.form.subjectPlaceholder': 'Message subject',
    'contact.form.messagePlaceholder': 'Write your message here...',
    'contact.form.formActive': 'Form is active! Your message will be sent directly to my email address.',
    
    // Skills Categories
    'skills.categories.languagesFrameworks': 'Languages & Frameworks',
    'skills.categories.frontend': 'Frontend',
    'skills.categories.backend': 'Backend',
    'skills.categories.aiMl': 'AI/ML',
    'skills.categories.databases': 'Databases',
    'skills.categories.tools': 'Tools & Technologies',
    'skills.continuousLearning.title': 'Continuous Learning',
    'skills.continuousLearning.description': 'Technology evolves rapidly, and I focus on following this development, learning new technologies, and keeping my current knowledge up to date. Every project is a new learning opportunity for me.',
    
    // Footer
    'footer.description': 'Computer Engineering graduate passionate about software development, AI/ML, and creating innovative solutions.',
    'footer.quickLinks': 'Quick Links',
    'footer.madeWith': 'Made with',
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
    'experience.binaryBrain.description1': 'Led the development of AvukatLLM, an AI-powered legal assistant using Microsoft\'s Phi-4 model, achieving 85% response accuracy in Turkish tax law consultations',
    'experience.binaryBrain.description2': 'Implemented model quantization techniques reducing memory requirements by 75% while maintaining performance',
    'experience.binaryBrain.description3': 'Architected and enhanced cross-platform mobile and web applications using Flutter with Firebase backend',
    'experience.binaryBrain.description4': 'Created efficient model training pipeline using PyTorch and Transformers for continuous model improvements',
    'experience.tellus.title': 'Software Engineering Intern',
    'experience.tellus.company': 'TellUS',
    'experience.tellus.period': 'June 2024 - August 2024',
    'experience.tellus.description1': 'Implemented OBD2 and CANbus protocols for real-time vehicle data communication',
    'experience.tellus.description2': 'Engineered Arduino-based system architecture with PID control algorithms',
    'experience.tellus.description3': 'Created comprehensive testing procedures achieving 95% system reliability',
    
    // Common
    'common.loading': 'Loading...',
    'common.error': 'Error',
    'common.viewMore': 'View More',
    'common.viewLess': 'View Less',
  }
};