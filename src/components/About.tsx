import { BookOpen, Award, Code, User } from 'lucide-react';
import { education, certifications, courses } from '../data/portfolio';

const About = () => {
  return (
    <section id="about" className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <h2 className="section-title">Hakkımda</h2>
        
        <div className="grid md:grid-cols-2 gap-12">
          {/* Personal Info */}
          <div className="space-y-6">
            <div className="flex items-center space-x-3 mb-6">
              <User className="text-blue-600" size={24} />
              <h3 className="text-2xl font-semibold text-gray-900">Kişisel Bilgiler</h3>
            </div>
            
            <p className="text-gray-700 leading-relaxed">
              Hacettepe Üniversitesi Bilgisayar Mühendisliği öğrencisiyim. Yazılım geliştirme, 
              yapay zeka ve makine öğrenmesi alanlarında deneyimim bulunuyor. 
              Özellikle full-stack development ve AI/ML projeleri konularında kendimi geliştiriyorum.
            </p>
            
            <p className="text-gray-700 leading-relaxed">
              İnovatif çözümler üretmek ve en son teknolojilerle çalışmak beni motive ediyor. 
              Takım çalışmasına yatkın, öğrenmeye açık ve problem çözme odaklı yaklaşımım var.
            </p>

            {/* Education */}
            <div className="mt-8">
              <div className="flex items-center space-x-3 mb-4">
                <BookOpen className="text-blue-600" size={20} />
                <h4 className="text-xl font-semibold text-gray-900">Eğitim</h4>
              </div>
              
              <div className="space-y-3">
                {education.map((edu, index) => (
                  <div key={index} className="bg-gray-50 p-4 rounded-lg">
                    <h5 className="font-semibold text-gray-900">{edu.institution}</h5>
                    <p className="text-gray-700">{edu.degree}</p>
                    {edu.year && (
                      <p className="text-sm text-gray-500">{edu.year}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Certifications & Courses */}
          <div className="space-y-8">
            {/* Certifications */}
            <div>
              <div className="flex items-center space-x-3 mb-6">
                <Award className="text-blue-600" size={24} />
                <h3 className="text-2xl font-semibold text-gray-900">Sertifikalar</h3>
              </div>
              
              <div className="space-y-4">
                {certifications.map((cert, index) => (
                  <div key={index} className="card">
                    <h4 className="font-semibold text-gray-900 mb-2">{cert.name}</h4>
                    <p className="text-blue-600 font-medium mb-2">{cert.issuer}</p>
                    <p className="text-gray-700 text-sm">{cert.description}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Relevant Courses */}
            <div>
              <div className="flex items-center space-x-3 mb-6">
                <Code className="text-blue-600" size={24} />
                <h3 className="text-2xl font-semibold text-gray-900">İlgili Dersler</h3>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {courses.map((course, index) => (
                  <div key={index} className="bg-blue-50 px-4 py-2 rounded-lg">
                    <span className="text-gray-800 font-medium">{course}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
