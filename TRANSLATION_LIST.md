# Portfolio Website - Tüm Metinler (Türkçe/İngilizce Çeviri Listesi)

## 📝 ÇEVİRİ YAPILACAK METİNLER

### 🔥 HEADER COMPONENT
**Mevcut Durum:**
- Logo kısmındaki isim: "Eyüp Zafer Ünal" (değişmeyecek)
- Build time: "Son güncelleme: 21.07.2025, 16:55:30"

**Çeviri Gerekli:**
- "Son güncelleme" → "Last updated"

### 🏠 HERO SECTION
**Çeviri Sistemi Çalışıyor:**
✅ "Merhaba, Ben Eyüp Zafer ÜNAL" → "Hello, I'm Eyüp Zafer ÜNAL"
✅ "Projelerimi Gör" → "View My Projects" 
✅ "İletişime Geç" → "Get in Touch"

**Çeviri Gerekli (personalInfo datasından):**
- Title: "Software Engineer" (zaten İngilizce)
- About: "Computer Engineering graduate from Hacettepe University with expertise in software development, AI/ML, and full-stack development. Passionate about creating innovative solutions and working with cutting-edge technologies."
- Location: "Ankara, Turkey" (zaten İngilizce)

### 👤 ABOUT SECTION
**Çeviri Sistemi Çalışıyor:**
✅ "Hakkımda" → "About Me"

**Çeviri Gerekli:**
- "Kişisel Bilgiler" → "Personal Information"
- İçerik metinleri:
  - "Hacettepe Üniversitesi Bilgisayar Mühendisliği öğrencisiyim. Yazılım geliştirme, yapay zeka ve makine öğrenmesi alanlarında deneyimim bulunuyor. Özellikle full-stack development ve AI/ML projeleri konularında kendimi geliştiriyorum."
  - "İnovatif çözümler üretmek ve en son teknolojilerle çalışmak beni motive ediyor. Takım çalışmasına yatkın, öğrenmeye açık ve problem çözme odaklı yaklaşımım var."
- "Eğitim" → "Education" 
- "Sertifikalar" → "Certifications"
- "İlgili Dersler" → "Relevant Courses"

### 💼 EXPERIENCE SECTION
**Çeviri Gerekli:**
- "Deneyim" → "Experience"
- Tüm experience verileri zaten İngilizce (portfolio.ts'de)

### 🚀 PROJECTS SECTION
**Çeviri Sistemi Çalışıyor:**
✅ "Projeler" → "Projects"
✅ "Daha Fazla Proje" → "More Projects"

**Çeviri Gerekli:**
- Tüm proje açıklamaları zaten İngilizce (portfolio.ts'de)

### 🛠️ SKILLS SECTION
**Çeviri Gerekli:**
- "Yetenekler" → "Skills"
- Kategori isimleri:
  - "Languages & Frameworks" (zaten İngilizce)
  - "Frontend" (zaten İngilizce)
  - "Backend" (zaten İngilizce)
  - "AI/ML" (zaten İngilizce)
  - "Databases" (zaten İngilizce)
  - "Tools & Technologies" (zaten İngilizce)
- Açıklama metni:
  - "Sürekli Öğrenmeye Açık" → "Continuous Learning"
  - "Teknoloji hızla gelişiyor ve ben de bu gelişimi takip etmeye, yeni teknolojileri öğrenmeye ve mevcut bilgimi güncel tutmaya odaklanıyorum. Her proje benim için yeni bir öğrenme fırsatı." 

### 📞 CONTACT SECTION
**Çeviri Sistemi Çalışıyor:**
✅ "İletişim" → "Contact"

**Çeviri Gerekli:**
- "Benimle İletişime Geçin" → "Get in Touch with Me"
- "Projeleriniz, iş fırsatları veya işbirliği önerileri için benimle iletişime geçebilirsiniz. Size mümkün olan en kısa sürede dönüş yapacağım."
- "Email" (zaten İngilizce)
- "Telefon" → "Phone"
- "Konum" → "Location"
- "Sosyal Medya" → "Social Media"
- "Mesaj Gönder" → "Send Message"
- Form alanları:
  - "Adınız" → "Your Name"
  - "Email" (zaten İngilizce)
  - "Konu" → "Subject"
  - "Mesaj" → "Message"
  - "Mesajınızı buraya yazın..." → "Write your message here..."
  - "Adınızı girin" → "Enter your name"
  - "Email adresinizi girin" → "Enter your email address"
  - "Mesaj konusu" → "Message subject"
- "Form aktif! Mesajınız doğrudan email adresime iletilecektir." → "Form is active! Your message will be sent directly to my email address."

### 🦶 FOOTER SECTION
**Çeviri Gerekli:**
- "Hızlı Linkler" → "Quick Links"
- Navigation link'leri (Header ile aynı)
- "İletişim" → "Contact"
- "Made with" (zaten İngilizce)
- "using React & Tailwind CSS" (zaten İngilizce)

### 📊 DATA (portfolio.ts) - İNGİLİZCE ÇEVİRİLER GEREKLİ

#### Education (Türkçe versiyonlar gerekli):
- "Computer Engineering - Graduate" → "Bilgisayar Mühendisliği - Mezun"
- "Science High School" → "Fen Lisesi"
- "Science and Art Center" → "Bilim ve Sanat Merkezi"

#### Certifications (Türkçe versiyonlar gerekli):
- "Skills in developing ASP.NET Core web applications and consuming APIs, Implementation of HTTP clients and API integration"
- "Utilizing .NET Aspire stack for distributed applications, Microservice architecture and cloud-native application development"

#### Courses (Türkçe versiyonlar gerekli):
- "Software Architecture" → "Yazılım Mimarisi"
- "Embedded Systems" → "Gömülü Sistemler"
- "Database Management Systems" → "Veritabanı Yönetim Sistemleri"
- "Computer Graphics" → "Bilgisayar Grafikleri"
- "Game Technologies" → "Oyun Teknolojileri"
- "Algorithm Design" → "Algoritma Tasarımı"
- "Data Structures" → "Veri Yapıları"

---

## 🎯 ÖNCELIK SIRASI

### Yüksek Öncelik (Görünür Metinler):
1. About section'daki Türkçe paragraflar
2. Skills section'daki açıklama
3. Contact section'daki form ve açıklamalar
4. Footer'daki navigation linkler

### Orta Öncelik:
1. Header'daki "Son güncelleme"
2. About section'daki alt başlıklar

### Düşük Öncelik:
1. Portfolio.ts'deki data çevirileri (çok görünür değil)

---

## 📋 MEVCUT ÇEVİRİ SİSTEMİ DURUMU

**Çalışan bölümler:**
- Navigation menü
- Hero section butonları
- Section başlıkları (About, Projects, Contact)

**Çalışmayan/eksik bölümler:**
- About section içerik metinleri
- Skills section açıklama
- Contact section form ve açıklamalar
- Footer navigation
- Header build time
- Portfolio verilerinin Türkçe versiyonları

**Dosya konumu:** `src/contexts/LanguageContext.tsx`
