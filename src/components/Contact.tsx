import { Mail, Phone, MapPin, Github, Linkedin } from 'lucide-react';
import { personalInfo } from '../data/portfolio';

const Contact = () => {
  return (
    <section id="contact" className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <h2 className="section-title">İletişim</h2>
        
        <div className="grid md:grid-cols-2 gap-12 max-w-4xl mx-auto">
          {/* Contact Info */}
          <div className="space-y-8">
            <div>
              <h3 className="text-2xl font-semibold text-gray-900 mb-6">Benimle İletişime Geçin</h3>
              <p className="text-gray-700 mb-8">
                Projeleriniz, iş fırsatları veya işbirliği önerileri için benimle iletişime geçebilirsiniz. 
                Size mümkün olan en kısa sürede dönüş yapacağım.
              </p>
            </div>
            
            <div className="space-y-6">
              <div className="flex items-center space-x-4">
                <div className="bg-blue-100 p-3 rounded-lg">
                  <Mail className="text-blue-600" size={20} />
                </div>
                <div>
                  <p className="font-medium text-gray-900">Email</p>
                  <a 
                    href={`mailto:${personalInfo.email}`}
                    className="text-blue-600 hover:text-blue-700"
                  >
                    {personalInfo.email}
                  </a>
                </div>
              </div>
              
              <div className="flex items-center space-x-4">
                <div className="bg-green-100 p-3 rounded-lg">
                  <Phone className="text-green-600" size={20} />
                </div>
                <div>
                  <p className="font-medium text-gray-900">Telefon</p>
                  <a 
                    href={`tel:${personalInfo.phone}`}
                    className="text-green-600 hover:text-green-700"
                  >
                    {personalInfo.phone}
                  </a>
                </div>
              </div>
              
              <div className="flex items-center space-x-4">
                <div className="bg-purple-100 p-3 rounded-lg">
                  <MapPin className="text-purple-600" size={20} />
                </div>
                <div>
                  <p className="font-medium text-gray-900">Konum</p>
                  <p className="text-gray-700">{personalInfo.location}</p>
                </div>
              </div>
            </div>
            
            {/* Social Links */}
            <div className="pt-8 border-t border-gray-200">
              <h4 className="text-lg font-semibold text-gray-900 mb-4">Sosyal Medya</h4>
              <div className="flex space-x-4">
                <a
                  href={personalInfo.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-gray-100 p-3 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  <Github className="text-gray-700" size={20} />
                </a>
                <a
                  href={personalInfo.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-blue-100 p-3 rounded-lg hover:bg-blue-200 transition-colors"
                >
                  <Linkedin className="text-blue-600" size={20} />
                </a>
              </div>
            </div>
          </div>
          
          {/* Contact Info Card */}
          <div className="card">
            <h3 className="text-xl font-semibold text-gray-900 mb-6">İletişim Bilgileri</h3>
            <div className="space-y-4">
              <p className="text-gray-700">
                Projeleriniz, iş fırsatları veya işbirliği önerileri için benimle iletişime geçebilirsiniz.
              </p>
              <div className="flex flex-col space-y-3">
                <a 
                  href={`mailto:${personalInfo.email}`}
                  className="flex items-center space-x-3 text-blue-600 hover:text-blue-700 transition-colors"
                >
                  <Mail size={20} />
                  <span>Email Gönder</span>
                </a>
                <a 
                  href={`tel:${personalInfo.phone}`}
                  className="flex items-center space-x-3 text-green-600 hover:text-green-700 transition-colors"
                >
                  <Phone size={20} />
                  <span>Telefon Et</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
