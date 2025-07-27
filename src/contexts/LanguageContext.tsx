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

// Çeviri verileri - Tamamen düzeltilmiş
const translations = {
  tr: {
    // Header & Navigation
    'header.lastUpdated': 'Son güncelleme',
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
    'hero.description': 'Hacettepe Üniversitesi Bilgisayar Mühendisliği mezunu. Yazılım geliştirme, yapay zeka ve makine öğrenmesi alanlarında deneyimli. Modern teknolojiler ve yenilikçi çözümler konusunda tutkulu.',
    'hero.location': 'Ankara, Türkiye',
    'hero.viewProjects': 'Projelerimi Gör',
    'hero.downloadCV': 'CV İndir',
    'hero.contact': 'İletişime Geç',
    
    // About Section - TAMAMEN YENİDEN YAZILDI
    'about.title': 'Hakkımda',
    'about.personalInfo': 'Kişisel Bilgiler',
    'about.education': 'Eğitim',
    'about.education.title': 'Eğitim Geçmişi',
    'about.certifications': 'Sertifikalar',
    'about.relevantCourses': 'İlgili Dersler',
    'about.description1': 'Hacettepe Üniversitesi Bilgisayar Mühendisliği bölümünden mezun olan tutkulu bir yazılım geliştirici. Yazılım geliştirme, yapay zeka ve makine öğrenmesi alanlarında derinlemesine bilgi ve deneyime sahip. Full-stack development ve AI/ML projelerinde uzmanlaşarak modern teknolojilerle inovatif çözümler üretme konusunda odaklanıyorum.',
    'about.description2': 'Binary Brain Technology ve TellUS firmalarında yazılım geliştirici stajyeri olarak çalışarak sektörel deneyim kazandım. Bu süreçte Microsoft Phi-4 modeli kullanarak AvukatLLM adlı AI destekli hukuki asistan geliştirdim, OBD2 ve CANbus protokolleri ile araç sistemleri üzerinde çalıştım ve çeşitli web/mobil uygulamalar geliştirdim. Aynı zamanda YDS ve TYT hazırlık platformları gibi EdTech projeleri üreterek eğitim teknolojileri alanında da deneyim elde ettim.',
    'about.description3': 'Problem çözme odaklı yaklaşımım, sürekli öğrenme isteğim ve takım çalışmasına yatkınlığım ile projelerimde fark yaratmaya odaklanıyorum. Teknolojinin hızla gelişen dünyasında kendimi güncel tutarak, yenilikçi çözümler üretmek ve anlamlı projeler geliştirmek beni motive ediyor.',
    
    // Experience Section
    'experience.title': 'Profesyonel Deneyim',
    'experience.binaryBrain.title': 'Yazılım Geliştirici Stajyeri',
    'experience.binaryBrain.company': 'Binary Brain Technology Inc.',
    'experience.binaryBrain.period': 'Ocak 2025 - Şubat 2025',
    'experience.binaryBrain.description1': 'Microsoft Phi-4 modeli kullanarak AvukatLLM adlı AI destekli hukuki asistan projesini baştan sona geliştirdim. Türk vergi hukuku danışmanlığında %85 yanıt doğruluğu elde ederek projenin başarıyla tamamlanmasını sağladım.',
    'experience.binaryBrain.description2': 'Model quantization teknikleri uygulayarak bellek gereksinimlerini %75 oranında azaltırken performansı korumayı başardım. PyTorch ve Transformers kütüphanelerini kullanarak verimli model eğitim süreçleri tasarladım.',
    'experience.binaryBrain.description3': 'Flutter ve Firebase backend teknolojilerini kullanarak cross-platform mobil ve web uygulamalar tasarlayıp geliştirdim. Modern UI/UX prensiplerini uygulayarak kullanıcı deneyimini optimize ettim.',
    'experience.binaryBrain.description4': 'Sürekli model iyileştirmeleri için otomatik eğitim pipeline\'ları oluşturdum ve proje sürecinde agile metodolojiler uygulayarak ekip verimliliğine katkı sağladım.',
    'experience.tellus.title': 'Yazılım Geliştirici Stajyeri',
    'experience.tellus.company': 'TellUS Teknoloji',
    'experience.tellus.period': 'Haziran 2024 - Ağustos 2024',
    'experience.tellus.description1': 'Gerçek zamanlı araç veri iletişimi için OBD2 ve CANbus protokollerini implement ettim. Araç sistemleri ile düşük seviyeli iletişim kurarak veri toplama ve analiz süreçlerini optimize ettim.',
    'experience.tellus.description2': 'Arduino tabanlı gömülü sistemler geliştirdim ve PID kontrol algoritmaları ile sistem performansını iyileştirdim. Hardware-software entegrasyonu konusunda pratik deneyim kazandım.',
    'experience.tellus.description3': 'Kapsamlı test prosedürleri ve kalite kontrol süreçleri oluşturarak %95 sistem güvenilirliği elde ettim. Debugging ve troubleshooting konularında uzmanlaştım.',
    
    // Projects Section
    'projects.title': 'Projelerim',
    'projects.moreProjects': 'Daha Fazla Proje',
    
    // MyYDS Project
    'projects.myYDS.name': 'MyYDS - YDS Kelime Öğrenme Platformu',
    'projects.myYDS.description': 'Yabancı Dil Sınavı (YDS) hazırlığı için geliştirilmiş kapsamlı kelime öğrenme platformu. 9 kategoride organize edilmiş kelimeler, kişisel kelime kartları ve detaylı ilerleme takibi sistemi.',
    'projects.myYDS.feature1': '9 farklı kategoride düzenlenmiş 4000+ YDS kelimesi ve sistematik öğrenme metodolojisi',
    'projects.myYDS.feature2': 'Excel dosyası yükleme özelliği ile kişisel kelime kartları oluşturma ve Google Translate entegrasyonu',
    'projects.myYDS.feature3': 'Interaktif test sistemi, performans değerlendirme araçları ve kişiselleştirilmiş ilerleme takibi',
    'projects.myYDS.feature4': 'Firebase backend altyapısı, responsive tasarım ve Progressive Web App (PWA) özellikleri',
    
    // Dokuz Haftada TYT Project
    'projects.dokuzhaftadatyt.name': 'Dokuz Haftada TYT - Üniversite Hazırlık Platformu',
    'projects.dokuzhaftadatyt.description': 'TYT (Temel Yeterlilik Testi) sınavına hazırlık için tasarlanmış 9 haftalık yoğun eğitim programı. Sistematik ders planları ve kişiselleştirilmiş öğrenme deneyimi.',
    'projects.dokuzhaftadatyt.feature1': '9 haftalık yapılandırılmış TYT hazırlık programı, günlük ders planları ve çalışma takvimi',
    'projects.dokuzhaftadatyt.feature2': 'Matematik, Türkçe, Fen Bilimleri ve Sosyal Bilimler alanlarında kapsamlı konu anlatımları',
    'projects.dokuzhaftadatyt.feature3': 'Kullanıcı hesap yönetimi, kişisel ilerleme takibi ve detaylı performans analiz raporları',
    'projects.dokuzhaftadatyt.feature4': 'Firebase authentication sistemi, responsive web tasarımı ve mobil cihaz optimizasyonu',
    
    // Journey of Crops Project
    'projects.journeyOfCrops.name': 'Journey Of Crops - Algoritma Simülasyon Oyunu',
    'projects.journeyOfCrops.description': 'Dinamik programlama algoritmaları ve görselleştirme teknikleri içeren eğitici tarımsal optimizasyon oyunu. Three.js teknolojisi ile geliştirilmiş interaktif deneyim.',
    'projects.journeyOfCrops.feature1': 'Knapsack algoritması kullanarak dinamik programlama ile kaynak optimizasyonu çözümleri',
    'projects.journeyOfCrops.feature2': 'Three.js ve WebGL2 teknolojileri ile geliştirilmiş interaktif 3D ray sistemi simülasyonu',
    'projects.journeyOfCrops.feature3': 'Algoritma çözümlerinin adım adım animasyonlu görselleştirilmesi ve eğitici içerik sunumu',
    'projects.journeyOfCrops.feature4': 'Optimizasyon sonuçlarına dayalı dinamik puan hesaplama sistemi ve performans değerlendirmesi',
    
    // LinkedHU Project
    'projects.linkedHU.name': 'LinkedHU - Üniversite Sosyal Ağ Platformu',
    'projects.linkedHU.description': 'Üniversite öğrencileri ve akademisyenler için geliştirilmiş profesyonel networking platformu. Backend geliştirme ve kapsamlı test süreçleri.',
    'projects.linkedHU.feature1': 'Agile metodoloji kullanarak backend functionality ve kapsamlı test prosedürleri geliştirme',
    'projects.linkedHU.feature2': 'JWT tabanlı güvenli kullanıcı kimlik doğrulama ve profil yönetim sistemleri',
    'projects.linkedHU.feature3': 'Üniversite networking özellikleri için RESTful API tasarımı ve geliştirmesi',
    'projects.linkedHU.feature4': 'CI/CD entegrasyonu ile kod kalitesi kontrolü ve performans optimizasyonu',
    
    // AvukatLLM Project
    'projects.avukatLLM.name': 'AvukatLLM - AI Hukuki Asistan',
    'projects.avukatLLM.description': 'Microsoft Phi-4 modeli kullanılarak geliştirilmiş AI destekli hukuki danışmanlık sistemi. Türk vergi hukuku alanında uzmanlaşmış yapay zeka asistanı.',
    'projects.avukatLLM.feature1': 'Microsoft Phi-4 language model ile Türk vergi hukuku danışmanlığında %85 yanıt doğruluğu',
    'projects.avukatLLM.feature2': 'Model quantization teknikleri ile %75 bellek gereksinimi azaltımı ve performans optimizasyonu',
    'projects.avukatLLM.feature3': 'PyTorch ve Transformers kullanarak sürekli model iyileştirme ve eğitim pipeline\'ı',
    'projects.avukatLLM.feature4': 'Türkçe dil desteği odaklı çok dilli yapay zeka sistemi geliştirmesi',
    
    // GoDash Project
    'projects.goDash.name': 'GoDash - Sistem İzleme Aracı',
    'projects.goDash.description': 'Go programlama dili ve modern web teknolojileri kullanılarak geliştirilmiş gerçek zamanlı sistem izleme ve yönetim platformu.',
    'projects.goDash.feature1': 'CPU, bellek ve disk kullanımı için gerçek zamanlı izleme ve otomatik uyarı sistemleri',
    'projects.goDash.feature2': 'GORM ile PostgreSQL veritabanı entegrasyonu ve geçmiş veri analizi için REST API tasarımı',
    'projects.goDash.feature3': 'Responsive web arayüzü geliştirmesi ve cross-platform deployment için Docker konteynerizasyonu',
    'projects.goDash.feature4': 'Email ve webhook tabanlı otomatik bildirim sistemi ile sistem yönetimi otomasyonu',
    
    // Skills Section
    'skills.title': 'Teknik Yetenekler',
    'skills.categories.languagesFrameworks': 'Programlama Dilleri & Framework\'ler',
    'skills.categories.frontend': 'Frontend Teknolojileri',
    'skills.categories.backend': 'Backend Teknolojileri',
    'skills.categories.aiMl': 'Yapay Zeka & Makine Öğrenmesi',
    'skills.categories.databases': 'Veritabanı Teknolojileri',
    'skills.categories.tools': 'Araçlar & DevOps',
    'skills.continuousLearning.title': 'Sürekli Öğrenme ve Gelişim',
    'skills.continuousLearning.description': 'Teknoloji dünyasının hızla gelişen doğasına ayak uydurmak için sürekli öğrenmeye odaklanıyorum. Yeni teknolojileri keşfetmek, mevcut bilgilerimi güncellemek ve her projede kendimi geliştirmek benim için öncelik. Bu yaklaşım sayesinde hem kişisel hem de mesleki gelişimimi sürdürüyorum.',
    
    // Contact Section
    'contact.title': 'İletişim',
    'contact.getInTouch': 'Benimle İletişime Geçin',
    'contact.description': 'Projeleriniz, iş fırsatları veya işbirliği önerileri hakkında konuşmak için benimle iletişime geçebilirsiniz. Size en kısa sürede dönüş yapacağım.',
    'contact.email': 'E-posta',
    'contact.phone': 'Telefon',
    'contact.location': 'Konum',
    'contact.socialMedia': 'Sosyal Medya',
    'contact.sendMessage': 'Mesaj Gönder',
    'contact.formActive': 'Mesajınız güvenli bir şekilde tarafıma iletilecektir.',
    
    // Contact Form
    'contact.form.title': 'Mesaj Gönder',
    'contact.form.name': 'Adınız Soyadınız',
    'contact.form.email': 'E-posta Adresiniz',
    'contact.form.subject': 'Konu',
    'contact.form.message': 'Mesajınız',
    'contact.form.send': 'Mesajı Gönder',
    'contact.form.sending': 'Gönderiliyor...',
    'contact.form.success': 'Mesajınız başarıyla gönderildi! En kısa sürede size dönüş yapacağım.',
    'contact.form.error': 'Mesaj gönderilirken bir hata oluştu. Lütfen tekrar deneyin.',
    
    // Form Placeholders
    'contact.form.namePlaceholder': 'Adınızı ve soyadınızı girin',
    'contact.form.emailPlaceholder': 'ornek@email.com',
    'contact.form.subjectPlaceholder': 'Mesajınızın konusunu belirtin',
    'contact.form.messagePlaceholder': 'Mesajınızı detaylı bir şekilde buraya yazın...',
    
    // Footer
    'footer.description': 'Yazılım geliştirme, yapay zeka ve eğitim teknolojileri alanında uzman, yenilikçi çözümler üreten Bilgisayar Mühendisi.',
    'footer.quickLinks': 'Hızlı Erişim',
    'footer.contact': 'İletişim Bilgileri',
    'footer.madeWith': 'ile geliştirildi',
    
    // Education Data
    'education.computerEngineering': 'Bilgisayar Mühendisliği',
    'education.hacettepeUniversity': 'Hacettepe Üniversitesi',
    'education.scienceHighSchool': 'Fen Lisesi',
    'education.ankaraFenLisesi': 'Ankara Fen Lisesi',
    'education.scienceArtCenter': 'Bilim ve Sanat Merkezi',
    'education.ankaraBilsem': 'Ankara Bilim ve Sanat Merkezi',
    
    // Certifications Data
    'certifications.aspNetCore': 'ASP.NET Core Web Uygulaması Geliştirme ve API Kullanımı',
    'certifications.aspNetCoreDesc': 'ASP.NET Core framework\'ü kullanarak web uygulamaları geliştirme, HTTP istemcileri oluşturma ve API entegrasyonu konularında uzmanlaşma',
    'certifications.netAspire': '.NET Aspire ile Dağıtık Uygulama Geliştirme',
    'certifications.netAspireDesc': '.NET Aspire teknoloji yığını kullanarak dağıtık uygulamalar geliştirme, mikroservis mimarisi ve bulut-natif uygulama geliştirme konularında yetkinlik',
    
    // Courses Data
    'courses.softwareArchitecture': 'Yazılım Mimarisi',
    'courses.embeddedSystems': 'Gömülü Sistemler',
    'courses.databaseManagement': 'Veritabanı Yönetim Sistemleri',
    'courses.computerGraphics': 'Bilgisayar Grafikleri',
    'courses.gameTechnologies': 'Oyun Teknolojileri',
    'courses.algorithmDesign': 'Algoritma Tasarımı',
    'courses.dataStructures': 'Veri Yapıları',
    
    // Common
    'common.loading': 'Yükleniyor...',
    'common.error': 'Hata oluştu',
    'common.viewMore': 'Daha Fazla Göster',
    'common.viewLess': 'Daha Az Göster',
    'common.readMore': 'Devamını Oku',
    'common.showMore': 'Daha Fazla',
    'common.showLess': 'Daha Az',
  },
  en: {
    // Header & Navigation
    'header.lastUpdated': 'Last updated',
    'nav.home': 'Home',
    'nav.about': 'About',
    'nav.experience': 'Experience',
    'nav.projects': 'Projects',
    'nav.skills': 'Skills',
    'nav.contact': 'Contact',
    'nav.toggleLanguage': 'Switch Language',
    
    // Hero Section
    'hero.greeting': 'Hello, I\'m Eyüp Zafer ÜNAL',
    'hero.title': 'Software Developer',
    'hero.description': 'Computer Engineering graduate from Hacettepe University with extensive experience in software development, artificial intelligence, and machine learning. Passionate about modern technologies and innovative solutions.',
    'hero.location': 'Ankara, Turkey',
    'hero.viewProjects': 'View My Projects',
    'hero.downloadCV': 'Download CV',
    'hero.contact': 'Get in Touch',
    
    // About Section - COMPLETELY REWRITTEN
    'about.title': 'About Me',
    'about.personalInfo': 'Personal Information',
    'about.education': 'Education',
    'about.education.title': 'Educational Background',
    'about.certifications': 'Certifications',
    'about.relevantCourses': 'Relevant Courses',
    'about.description1': 'I am a passionate software developer and Computer Engineering graduate from Hacettepe University. With deep knowledge and experience in software development, artificial intelligence, and machine learning, I specialize in full-stack development and AI/ML projects, focusing on creating innovative solutions with modern technologies.',
    'about.description2': 'I gained valuable industry experience as a software engineering intern at Binary Brain Technology and TellUS. During these roles, I developed AvukatLLM, an AI-powered legal assistant using Microsoft\'s Phi-4 model, worked on vehicle systems using OBD2 and CANbus protocols, and built various web and mobile applications. I also created EdTech platforms like YDS and TYT preparation systems, gaining expertise in educational technology.',
    'about.description3': 'My problem-solving approach, continuous learning mindset, and collaborative nature drive me to make a difference in every project. In the rapidly evolving world of technology, I stay current with the latest developments, motivated by creating innovative solutions and building meaningful projects that have real-world impact.',
    
    // Experience Section
    'experience.title': 'Professional Experience',
    'experience.binaryBrain.title': 'Software Engineering Intern',
    'experience.binaryBrain.company': 'Binary Brain Technology Inc.',
    'experience.binaryBrain.period': 'January 2025 - February 2025',
    'experience.binaryBrain.description1': 'Led the complete development of AvukatLLM, an AI-powered legal assistant using Microsoft\'s Phi-4 model, achieving 85% response accuracy in Turkish tax law consultations and ensuring successful project completion.',
    'experience.binaryBrain.description2': 'Implemented model quantization techniques to reduce memory requirements by 75% while maintaining performance, designing efficient model training processes using PyTorch and Transformers libraries.',
    'experience.binaryBrain.description3': 'Designed and developed cross-platform mobile and web applications using Flutter and Firebase backend technologies, optimizing user experience through modern UI/UX principles.',
    'experience.binaryBrain.description4': 'Created automated training pipelines for continuous model improvements and contributed to team efficiency by implementing agile methodologies throughout the project lifecycle.',
    'experience.tellus.title': 'Software Engineering Intern',
    'experience.tellus.company': 'TellUS Technology',
    'experience.tellus.period': 'June 2024 - August 2024',
    'experience.tellus.description1': 'Implemented OBD2 and CANbus protocols for real-time vehicle data communication, establishing low-level communication with vehicle systems and optimizing data collection and analysis processes.',
    'experience.tellus.description2': 'Developed Arduino-based embedded systems and improved system performance using PID control algorithms, gaining practical experience in hardware-software integration.',
    'experience.tellus.description3': 'Created comprehensive testing procedures and quality control processes achieving 95% system reliability, specializing in debugging and troubleshooting methodologies.',
    
    // Projects Section
    'projects.title': 'My Projects',
    'projects.moreProjects': 'More Projects',
    
    // MyYDS Project
    'projects.myYDS.name': 'MyYDS - YDS Vocabulary Learning Platform',
    'projects.myYDS.description': 'Comprehensive vocabulary learning platform developed for YDS (Foreign Language Exam) preparation. Features organized vocabulary in 9 categories, personal flashcards, and detailed progress tracking system.',
    'projects.myYDS.feature1': '4000+ YDS vocabulary words organized in 9 categories with systematic learning methodology',
    'projects.myYDS.feature2': 'Personal flashcard creation through Excel file upload and Google Translate integration',
    'projects.myYDS.feature3': 'Interactive testing system, performance evaluation tools, and personalized progress tracking',
    'projects.myYDS.feature4': 'Firebase backend infrastructure, responsive design, and Progressive Web App (PWA) features',
    
    // Dokuz Haftada TYT Project
    'projects.dokuzhaftadatyt.name': 'Dokuz Haftada TYT (9 Weeks to TYT)',
    'projects.dokuzhaftadatyt.description': '9-week intensive preparation program designed for TYT (Basic Proficiency Test) exam. Features systematic lesson plans and personalized learning experience for university entrance preparation.',
    'projects.dokuzhaftadatyt.feature1': '9-week structured TYT preparation program with daily lesson plans and study schedule',
    'projects.dokuzhaftadatyt.feature2': 'Comprehensive content coverage for Mathematics, Turkish, Science, and Social Studies subjects',
    'projects.dokuzhaftadatyt.feature3': 'User account management, personal progress tracking, and detailed performance analysis reports',
    'projects.dokuzhaftadatyt.feature4': 'Firebase authentication system, responsive web design, and mobile device optimization',
    
    // Journey of Crops Project
    'projects.journeyOfCrops.name': 'Journey Of Crops - Algorithm Simulation Game',
    'projects.journeyOfCrops.description': 'Educational agricultural optimization game featuring dynamic programming algorithms and visualization techniques. Interactive experience developed with Three.js technology.',
    'projects.journeyOfCrops.feature1': 'Resource optimization solutions using dynamic programming with Knapsack algorithm implementation',
    'projects.journeyOfCrops.feature2': 'Interactive 3D rail system simulation developed with Three.js and WebGL2 technologies',
    'projects.journeyOfCrops.feature3': 'Step-by-step animated visualization of algorithm solutions with educational content presentation',
    'projects.journeyOfCrops.feature4': 'Dynamic scoring system based on optimization results and comprehensive performance evaluation',
    
    // LinkedHU Project
    'projects.linkedHU.name': 'LinkedHU - University Social Network Platform',
    'projects.linkedHU.description': 'Professional networking platform developed for university students and academics. Focused on backend development and comprehensive testing processes.',
    'projects.linkedHU.feature1': 'Backend functionality development with comprehensive testing procedures using agile methodology',
    'projects.linkedHU.feature2': 'JWT-based secure user authentication and profile management systems implementation',
    'projects.linkedHU.feature3': 'RESTful API design and development for university networking features and functionality',
    'projects.linkedHU.feature4': 'Code quality control and performance optimization through CI/CD integration',
    
    // AvukatLLM Project
    'projects.avukatLLM.name': 'AvukatLLM - AI Legal Assistant',
    'projects.avukatLLM.description': 'AI-powered legal consultation system developed using Microsoft Phi-4 model. Specialized artificial intelligence assistant for Turkish tax law expertise.',
    'projects.avukatLLM.feature1': '85% response accuracy in Turkish tax law consultations using Microsoft Phi-4 language model',
    'projects.avukatLLM.feature2': '75% memory requirement reduction and performance optimization through model quantization techniques',
    'projects.avukatLLM.feature3': 'Continuous model improvement and training pipeline using PyTorch and Transformers',
    'projects.avukatLLM.feature4': 'Multi-language artificial intelligence system development with Turkish language support focus',
    
    // GoDash Project
    'projects.goDash.name': 'GoDash - System Monitoring Tool',
    'projects.goDash.description': 'Real-time system monitoring and management platform developed using Go programming language and modern web technologies.',
    'projects.goDash.feature1': 'Real-time monitoring for CPU, memory, and disk usage with automated alert systems',
    'projects.goDash.feature2': 'REST API design with PostgreSQL database integration using GORM for historical data analysis',
    'projects.goDash.feature3': 'Responsive web interface development and Docker containerization for cross-platform deployment',
    'projects.goDash.feature4': 'Email and webhook-based automated notification system with system management automation',
    
    // Skills Section
    'skills.title': 'Technical Skills',
    'skills.categories.languagesFrameworks': 'Programming Languages & Frameworks',
    'skills.categories.frontend': 'Frontend Technologies',
    'skills.categories.backend': 'Backend Technologies',
    'skills.categories.aiMl': 'Artificial Intelligence & Machine Learning',
    'skills.categories.databases': 'Database Technologies',
    'skills.categories.tools': 'Tools & DevOps',
    'skills.continuousLearning.title': 'Continuous Learning & Development',
    'skills.continuousLearning.description': 'I focus on continuous learning to keep pace with the rapidly evolving nature of the technology world. Discovering new technologies, updating my current knowledge, and improving myself with each project is a priority for me. This approach allows me to maintain both personal and professional growth.',
    
    // Contact Section
    'contact.title': 'Contact',
    'contact.getInTouch': 'Get in Touch with Me',
    'contact.description': 'Feel free to reach out to discuss your projects, job opportunities, or collaboration proposals. I will get back to you as soon as possible.',
    'contact.email': 'Email',
    'contact.phone': 'Phone',
    'contact.location': 'Location',
    'contact.socialMedia': 'Social Media',
    'contact.sendMessage': 'Send Message',
    'contact.formActive': 'Your message will be securely delivered to me.',
    
    // Contact Form
    'contact.form.title': 'Send Message',
    'contact.form.name': 'Your Full Name',
    'contact.form.email': 'Your Email Address',
    'contact.form.subject': 'Subject',
    'contact.form.message': 'Your Message',
    'contact.form.send': 'Send Message',
    'contact.form.sending': 'Sending...',
    'contact.form.success': 'Your message has been sent successfully! I will get back to you soon.',
    'contact.form.error': 'An error occurred while sending your message. Please try again.',
    
    // Form Placeholders
    'contact.form.namePlaceholder': 'Enter your full name',
    'contact.form.emailPlaceholder': 'example@email.com',
    'contact.form.subjectPlaceholder': 'Specify the subject of your message',
    'contact.form.messagePlaceholder': 'Write your detailed message here...',
    
    // Footer
    'footer.description': 'Computer Engineering specialist in software development, artificial intelligence, and educational technologies, creating innovative solutions.',
    'footer.quickLinks': 'Quick Links',
    'footer.contact': 'Contact Information',
    'footer.madeWith': 'Built with',
    
    // Education Data
    'education.computerEngineering': 'Computer Engineering',
    'education.hacettepeUniversity': 'Hacettepe University',
    'education.scienceHighSchool': 'Science High School',
    'education.ankaraFenLisesi': 'Ankara Science High School',
    'education.scienceArtCenter': 'Science and Art Center',
    'education.ankaraBilsem': 'Ankara Science and Art Center',
    
    // Certifications Data
    'certifications.aspNetCore': 'ASP.NET Core Web Application Development and API Consumption',
    'certifications.aspNetCoreDesc': 'Expertise in developing web applications using ASP.NET Core framework, creating HTTP clients, and API integration',
    'certifications.netAspire': '.NET Aspire for Distributed Application Development',
    'certifications.netAspireDesc': 'Proficiency in developing distributed applications using .NET Aspire technology stack, microservice architecture, and cloud-native application development',
    
    // Courses Data
    'courses.softwareArchitecture': 'Software Architecture',
    'courses.embeddedSystems': 'Embedded Systems',
    'courses.databaseManagement': 'Database Management Systems',
    'courses.computerGraphics': 'Computer Graphics',
    'courses.gameTechnologies': 'Game Technologies',
    'courses.algorithmDesign': 'Algorithm Design',
    'courses.dataStructures': 'Data Structures',
    
    // Common
    'common.loading': 'Loading...',
    'common.error': 'An error occurred',
    'common.viewMore': 'View More',
    'common.viewLess': 'View Less',
    'common.readMore': 'Read More',
    'common.showMore': 'Show More',
    'common.showLess': 'Show Less',
  }
};