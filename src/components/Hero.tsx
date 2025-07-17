import { ArrowDown, Github, Linkedin, Mail } from 'lucide-react';
import { personalInfo } from '../data/portfolio';

const Hero = () => {
  return (
    <section id="home" className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-20">
        <div className="text-center">
          {/* Profile Image Placeholder */}
          <div className="w-32 h-32 mx-auto mb-8 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-full flex items-center justify-center">
            <span className="text-white text-4xl font-bold">
              {personalInfo.name.split(' ').map(word => word[0]).join('')}
            </span>
          </div>

          {/* Main Content */}
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-4">
            Merhaba, Ben{' '}
            <span className="text-blue-600">{personalInfo.name}</span>
          </h1>
          
          <p className="text-xl md:text-2xl text-gray-600 mb-6">
            {personalInfo.title}
          </p>
          
          <p className="text-lg text-gray-700 mb-8 max-w-2xl mx-auto">
            {personalInfo.about}
          </p>

          {/* Contact Info */}
          <div className="flex flex-col sm:flex-row items-center justify-center space-y-2 sm:space-y-0 sm:space-x-6 mb-8">
            <div className="flex items-center space-x-2 text-gray-600">
              <Mail size={18} />
              <span>{personalInfo.email}</span>
            </div>
            <div className="flex items-center space-x-2 text-gray-600">
              <span>📍</span>
              <span>{personalInfo.location}</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-4 mb-12">
            <a
              href="#projects"
              className="btn-primary flex items-center space-x-2"
            >
              <span>Projelerimi Gör</span>
              <ArrowDown size={18} />
            </a>
            
            <a
              href="#contact"
              className="btn-secondary flex items-center space-x-2"
            >
              <span>İletişime Geç</span>
              <Mail size={18} />
            </a>
          </div>

          {/* Social Links */}
          <div className="flex items-center justify-center space-x-6">
            <a
              href={personalInfo.github}
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-600 hover:text-blue-600 transition-colors"
            >
              <Github size={24} />
            </a>
            <a
              href={personalInfo.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-600 hover:text-blue-600 transition-colors"
            >
              <Linkedin size={24} />
            </a>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <ArrowDown className="text-gray-400" size={24} />
      </div>
    </section>
  );
};

export default Hero;
