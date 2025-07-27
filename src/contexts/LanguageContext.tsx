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
  const [language, setLanguage] = useState<Language>('en');

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
    // Header
    'header.lastUpdated': 'Son güncelleme',
    
    // Navigation
    'nav.home': 'Ana Sayfa',
    'nav.about': 'Hakkımda',
    'nav.experience': 'Deneyim',
    'nav.projects': 'Projeler',
    'nav.skills': 'Yetenekler',
    'nav.contact': 'İletişim',
    'nav.toggleLanguage': 'Dil Değiştir',
    
    // Hero Section
    'hero.greeting': 'Merhaba, Ben Eyüp Zafer ÜNAL',
    'hero.title': 'Yazılım Geliştirici',
    'hero.description': 'Hacettepe Üniversitesi Bilgisayar Mühendisliği mezunu. Yazılım geliştirme, yapay zeka/makine öğrenmesi ve full-stack development alanlarında deneyimim var. İnovatif çözümler üretmek ve en son teknolojilerle çalışmak beni motive ediyor.',
    'hero.location': 'Ankara, Türkiye',
    'hero.viewProjects': 'Projelerimi Gör',
    'hero.downloadCV': 'CV İndir',
    'hero.contact': 'İletişime Geç',
    
    // About Section
    'about.title': 'Hakkımda',
    'about.personalInfo': 'Kişisel Bilgiler',
    'about.education': 'Eğitim',
    'about.education.title': 'Eğitim',
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
    
    // Project Details
    'projects.goDash.name': 'GoDash - System Monitoring Tool',
    'projects.goDash.description': 'Go, Gin framework ve WebSocket kullanarak gerçek zamanlı sistem izleme panosu',
    'projects.goDash.feature1': 'CPU, bellek ve disk kullanımı takibi ile otomatik uyarı sistemi',
    'projects.goDash.feature2': 'GORM ile PostgreSQL depolama kullanan REST API',
    'projects.goDash.feature3': 'Responsive web arayüzü ve Docker konteynerizasyonu',
    'projects.goDash.feature4': 'Email/webhook ile otomatik bildirim sistemi',
    
    'projects.journeyOfCrops.name': 'Journey Of Crops',
    'projects.journeyOfCrops.description': 'Dinamik programlama ve algoritma görselleştirmesi içeren tarımsal optimizasyon oyunu',
    'projects.journeyOfCrops.feature1': 'Dinamik programlama kullanarak kaynak optimizasyonu (Knapsack algoritması)',
    'projects.journeyOfCrops.feature2': 'Three.js ve WebGL2 ile interaktif ray sistemi simülasyonu',
    'projects.journeyOfCrops.feature3': 'Algoritmik çözümlerin animasyonlu görselleştirilmesi',
    'projects.journeyOfCrops.feature4': 'Optimizasyon sonuçlarına dayalı puan hesaplama sistemi',
    
    'projects.linkedHU.name': 'LinkedHU',
    'projects.linkedHU.description': 'Üniversite ağ platformu - Backend geliştirme ve test süreçleri',
    'projects.linkedHU.feature1': 'Agile metodoloji ile kapsamlı test prosedürleri',
    'projects.linkedHU.feature2': 'Kullanıcı kimlik doğrulama ve profil yönetimi',
    'projects.linkedHU.feature3': 'Üniversite ağ özellikleri için RESTful API\'ler',
    'projects.linkedHU.feature4': 'CI/CD entegrasyonu ile kod kalitesi optimizasyonu',
    
    'projects.dokuzhaftadatyt.name': 'Dokuz Haftada TYT',
    'projects.dokuzhaftadatyt.description': 'TYT (Temel Yeterlilik Testi) sınavına hazırlık için 9 haftalık yoğun eğitim programı - sistematik ders planı ve ilerleme takibi',
    'projects.dokuzhaftadatyt.feature1': '9 haftalık yapılandırılmış TYT hazırlık programı ve günlük ders planları',
    'projects.dokuzhaftadatyt.feature2': 'Matematik, Türkçe, Fen ve Sosyal Bilimler için kapsamlı konu anlatımları',
    'projects.dokuzhaftadatyt.feature3': 'Kullanıcı hesap sistemi, kişisel ilerleme takibi ve performans analizi',
    'projects.dokuzhaftadatyt.feature4': 'Firebase authentication, responsive tasarım ve mobil uyumlu arayüz',
    
    'projects.myYDS.name': 'MyYDS - YDS Kelime Platformu',
    'projects.myYDS.description': 'Yabancı Dil Sınavı (YDS) için kapsamlı kelime öğrenme platformu - 9 kategoride organize edilmiş, kişisel kelime kartları ve ilerleme takibi',
    'projects.myYDS.feature1': '9 kategoride düzenlenmiş 4000+ YDS kelimesi ve sistematik öğrenme yöntemi',
    'projects.myYDS.feature2': 'Excel upload ile kişisel kelime kartları ve Google Translate entegrasyonu',
    'projects.myYDS.feature3': 'Test sistemi, değerlendirme ve kişisel ilerleme takibi özellikleri',
    'projects.myYDS.feature4': 'Firebase backend, responsive tasarım ve PWA benzeri kullanıcı deneyimi',
    
    'projects.avukatLLM.name': 'AvukatLLM',
    'projects.avukatLLM.description': 'AI destekli hukuki asistan - Türk vergi hukuku danışmanlığı',
    'projects.avukatLLM.feature1': 'Microsoft Phi-4 modeli ile %85 yanıt doğruluğu',
    'projects.avukatLLM.feature2': 'Model quantization ile %75 bellek azaltımı',
    'projects.avukatLLM.feature3': 'Sürekli model iyileştirme pipeline\'ı',
    'projects.avukatLLM.feature4': 'Türkçe odaklı çok dil desteği',
    
    // Skills Section
    'skills.title': 'Yetenekler',
    'skills.categories.languagesFrameworks': 'Diller & Framework\'ler',
    'skills.categories.frontend': 'Frontend',
    'skills.categories.backend': 'Backend',
    'skills.categories.aiMl': 'AI/ML',
    'skills.categories.databases': 'Veritabanları',
    'skills.categories.tools': 'Araçlar & Teknolojiler',
    'skills.continuousLearning.title': 'Sürekli Öğrenmeye Açık',
    'skills.continuousLearning.description': 'Teknoloji hızla gelişiyor ve ben de bu gelişimi takip etmeye, yeni teknolojileri öğrenmeye ve mevcut bilgimi güncel tutmaya odaklanıyorum. Her proje benim için yeni bir öğrenme fırsatı ve mesleki gelişimime katkı sağlıyor.',
    
    // Contact Section
    'contact.title': 'İletişim',
    'contact.getInTouch': 'Benimle İletişime Geçin',
    'contact.description': 'Projeleriniz, iş fırsatları veya işbirliği önerileri için benimle iletişime geçebilirsiniz. Size mümkün olan en kısa sürede dönüş yapacağım.',
    'contact.email': 'Email',
    'contact.phone': 'Telefon',
    'contact.location': 'Konum',
    'contact.socialMedia': 'Sosyal Medya',
    'contact.sendMessage': 'Mesaj Gönder',
    'contact.formActive': 'Mesajınız güvenli bir şekilde tarafıma iletilecektir.',
    
    // Contact Form
    'contact.form.title': 'Mesaj Gönder',
    'contact.form.name': 'Adınız',
    'contact.form.email': 'Email',
    'contact.form.subject': 'Konu',
    'contact.form.message': 'Mesaj',
    'contact.form.send': 'Gönder',
    'contact.form.sending': 'Gönderiliyor...',
    'contact.form.success': 'Mesajınız başarıyla gönderildi!',
    'contact.form.error': 'Mesaj gönderilirken bir hata oluştu.',
    
    // Form Placeholders
    'contact.form.namePlaceholder': 'Adınızı girin',
    'contact.form.emailPlaceholder': 'Email adresinizi girin',
    'contact.form.subjectPlaceholder': 'Mesaj konusu',
    'contact.form.messagePlaceholder': 'Mesajınızı buraya yazın...',
    
    // Footer
    'footer.description': 'Yazılım geliştirme, AI/ML ve yenilikçi çözümler konusunda tutkulu Bilgisayar Mühendisliği mezunu.',
    'footer.quickLinks': 'Hızlı Linkler',
    'footer.contact': 'İletişim',
    'footer.madeWith': 'Built with',
    
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
    'common.viewMore': 'Daha Fazla',
    'common.viewLess': 'Daha Az',
  },
  en: {
    // Header
    'header.lastUpdated': 'Last updated',
    
    // Navigation
    'nav.home': 'Home',
    'nav.about': 'About',
    'nav.experience': 'Experience',
    'nav.projects': 'Projects',
    'nav.skills': 'Skills',
    'nav.contact': 'Contact',
    'nav.toggleLanguage': 'Toggle Language',
    
    // Hero Section
    'hero.greeting': 'Hello, I\'m Eyüp Zafer ÜNAL',
    'hero.title': 'Software Developer',
    'hero.description': 'Computer Engineering graduate from Hacettepe University with expertise in software development, AI/ML, and full-stack development. Passionate about creating innovative solutions and working with cutting-edge technologies.',
    'hero.location': 'Ankara, Turkey',
    'hero.viewProjects': 'View My Projects',
    'hero.downloadCV': 'Download CV',
    'hero.contact': 'Get in Touch',
    
    // About Section
    'about.title': 'About Me',
    'about.personalInfo': 'Personal Information',
    'about.education': 'Education',
    'about.education.title': 'Education',
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
    
    // Project Details
    'projects.goDash.name': 'GoDash - System Monitoring Tool',
    'projects.goDash.description': 'Built real-time system monitoring dashboard using Go, Gin framework, and WebSocket connections',
    'projects.goDash.feature1': 'Implemented CPU, memory, and disk usage tracking with automated alert system',
    'projects.goDash.feature2': 'Designed REST API with PostgreSQL storage using GORM for historical data analysis',
    'projects.goDash.feature3': 'Created responsive web interface and Docker containerization for cross-platform deployment',
    'projects.goDash.feature4': 'Automated email/webhook notification system',
    
    'projects.journeyOfCrops.name': 'Journey Of Crops',
    'projects.journeyOfCrops.description': 'Agricultural optimization game featuring dynamic programming and algorithm visualization',
    'projects.journeyOfCrops.feature1': 'Implemented resource optimization using dynamic programming (Knapsack algorithm)',
    'projects.journeyOfCrops.feature2': 'Enhanced interactive rail system simulation using Three.js and WebGL2',
    'projects.journeyOfCrops.feature3': 'Created animated visualization of algorithmic solutions',
    'projects.journeyOfCrops.feature4': 'Built a score calculation system based on optimization results',
    
    'projects.linkedHU.name': 'LinkedHU',
    'projects.linkedHU.description': 'University networking platform - Backend development and testing processes',
    'projects.linkedHU.feature1': 'Built backend functionality with comprehensive testing procedures using agile methodology',
    'projects.linkedHU.feature2': 'Implemented user authentication and profile management systems',
    'projects.linkedHU.feature3': 'Created RESTful APIs for university networking features',
    'projects.linkedHU.feature4': 'Ensured code quality and performance optimization with CI/CD integration',
    
    'projects.dokuzhaftadatyt.name': 'Dokuz Haftada TYT (9 Weeks to TYT)',
    'projects.dokuzhaftadatyt.description': '9-week intensive preparation program for TYT (Basic Proficiency Test) - structured lesson plans and progress tracking for university entrance exam',
    'projects.dokuzhaftadatyt.feature1': '9-week structured TYT preparation program with daily lesson plans and study schedules',
    'projects.dokuzhaftadatyt.feature2': 'Comprehensive content coverage for Math, Turkish, Science and Social Studies subjects',
    'projects.dokuzhaftadatyt.feature3': 'User account system, personal progress tracking and performance analytics',
    'projects.dokuzhaftadatyt.feature4': 'Firebase authentication, responsive design and mobile-optimized interface',
    
    'projects.myYDS.name': 'MyYDS - YDS Vocabulary Platform',
    'projects.myYDS.description': 'Comprehensive vocabulary learning platform for YDS (Foreign Language Exam) - organized in 9 categories with personal flashcards and progress tracking',
    'projects.myYDS.feature1': '4000+ YDS vocabulary organized in 9 categories with systematic learning methodology',
    'projects.myYDS.feature2': 'Personal flashcard creation via Excel upload and Google Translate integration',
    'projects.myYDS.feature3': 'Testing system, assessment tools and personalized progress tracking features',
    'projects.myYDS.feature4': 'Firebase backend, responsive design and PWA-like user experience',
    
    'projects.avukatLLM.name': 'AvukatLLM',
    'projects.avukatLLM.description': 'AI-powered legal assistant specializing in Turkish tax law consultations',
    'projects.avukatLLM.feature1': '85% response accuracy in Turkish tax law consultations',
    'projects.avukatLLM.feature2': 'Model quantization for 75% memory reduction',
    'projects.avukatLLM.feature3': 'Continuous model improvement pipeline',
    'projects.avukatLLM.feature4': 'Multi-language support with Turkish focus',
    
    // Skills Section
    'skills.title': 'Skills',
    'skills.categories.languagesFrameworks': 'Languages & Frameworks',
    'skills.categories.frontend': 'Frontend',
    'skills.categories.backend': 'Backend',
    'skills.categories.aiMl': 'AI/ML',
    'skills.categories.databases': 'Databases',
    'skills.categories.tools': 'Tools & Technologies',
    'skills.continuousLearning.title': 'Continuous Learning',
    'skills.continuousLearning.description': 'Technology evolves rapidly, and I focus on following this development, learning new technologies, and keeping my current knowledge up to date. Every project is a new learning opportunity for me and contributes to my professional development.',
    
    // Contact Section
    'contact.title': 'Contact',
    'contact.getInTouch': 'Get in Touch with Me',
    'contact.description': 'You can contact me for your projects, job opportunities, or collaboration proposals. I will get back to you as soon as possible.',
    'contact.email': 'Email',
    'contact.phone': 'Phone',
    'contact.location': 'Location',
    'contact.socialMedia': 'Social Media',
    'contact.sendMessage': 'Send Message',
    'contact.formActive': 'Your message will be securely delivered to me.',
    
    // Contact Form
    'contact.form.title': 'Send Message',
    'contact.form.name': 'Your Name',
    'contact.form.email': 'Email',
    'contact.form.subject': 'Subject',
    'contact.form.message': 'Message',
    'contact.form.send': 'Send',
    'contact.form.sending': 'Sending...',
    'contact.form.success': 'Your message has been sent successfully!',
    'contact.form.error': 'An error occurred while sending the message.',
    
    // Form Placeholders
    'contact.form.namePlaceholder': 'Enter your name',
    'contact.form.emailPlaceholder': 'Enter your email address',
    'contact.form.subjectPlaceholder': 'Message subject',
    'contact.form.messagePlaceholder': 'Write your message here...',
    
    // Footer
    'footer.description': 'Computer Engineering graduate passionate about software development, AI/ML, and creating innovative solutions.',
    'footer.quickLinks': 'Quick Links',
    'footer.contact': 'Contact',
    'footer.madeWith': 'Built with',
    
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