import React from 'react';
import { ArrowDown, Download } from 'lucide-react';
import { personalInfo } from '../data/portfolio';
import { useLanguage } from '../contexts/LanguageContext';

const Hero: React.FC = () => {
  const { t } = useLanguage();

  const scrollToProjects = () => {
    const element = document.getElementById('projects');
    if (element) {
      const offsetTop = element.offsetTop - 100;
      window.scrollTo({
        top: offsetTop,
        behavior: 'smooth'
      });
    }
  };

  return (
    <section className="min-h-screen flex flex-col justify-center items-start px-4 sm:px-6 md:px-12 lg:px-24 xl:px-32 relative bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,rgba(100,255,218,0.15)_1px,transparent_0)] [background-size:50px_50px] opacity-20"></div>
      
      <div className="max-w-6xl relative z-10">
        {/* Greeting */}
        <p className="text-green-400 font-mono text-base sm:text-lg md:text-xl mb-4 sm:mb-6 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
          {t('hero.greeting')}
        </p>

        {/* Main Title */}
        <h1 
          className="font-bold leading-[0.9] mb-4 sm:mb-6 text-slate-200 animate-fade-in-up"
          style={{ 
            fontSize: 'clamp(2.5rem, 8vw, 5rem)',
            animationDelay: '0.2s'
          }}
        >
          {personalInfo.name}
        </h1>

        {/* Subtitle */}
        <h2 
          className="font-bold leading-[0.9] mb-6 sm:mb-8 text-slate-400 animate-fade-in-up"
          style={{ 
            fontSize: 'clamp(2rem, 6vw, 4rem)',
            animationDelay: '0.3s'
          }}
        >
          {t('hero.title')}
        </h2>

        {/* Description */}
        <p 
          className="max-w-2xl text-lg sm:text-xl leading-relaxed mb-8 sm:mb-12 text-slate-400 animate-fade-in-up"
          style={{ animationDelay: '0.4s' }}
        >
          {t('hero.description')}
        </p>

        {/* CTA Buttons */}
        <div 
          className="flex flex-col sm:flex-row gap-4 sm:gap-6 animate-fade-in-up"
          style={{ animationDelay: '0.5s' }}
        >
          <button
            onClick={scrollToProjects}
            className="group inline-flex items-center justify-center gap-3 px-6 sm:px-8 py-3 sm:py-4 bg-transparent border border-green-400 text-green-400 rounded-lg font-medium text-base sm:text-lg hover:bg-green-400/10 hover:-translate-y-1 hover:shadow-lg hover:shadow-green-400/25 transition-all duration-300"
          >
            {t('hero.viewProjects')}
            <ArrowDown size={18} className="group-hover:translate-y-1 transition-transform duration-300" />
          </button>
          
          <a
            href="/Eyup_Zafer_UNAL_CV.pdf"
            download="Eyup_Zafer_UNAL_CV.pdf"
            className="group inline-flex items-center justify-center gap-3 px-6 sm:px-8 py-3 sm:py-4 bg-green-400/10 border border-green-400 text-green-400 rounded-lg font-medium text-base sm:text-lg hover:bg-green-400 hover:text-slate-900 hover:-translate-y-1 hover:shadow-lg hover:shadow-green-400/25 transition-all duration-300"
          >
            <Download size={18} className="group-hover:scale-110 transition-transform duration-300" />
            {t('hero.downloadCV')}
          </a>
        </div>
      </div>

      {/* Social Links - Fixed Position (Better positioning) */}
      <div className="fixed left-6 lg:left-8 bottom-0 hidden lg:flex flex-col items-center space-y-6 z-20">
        <a
          href={personalInfo.github}
          target="_blank"
          rel="noopener noreferrer"
          className="text-slate-400 hover:text-green-400 hover:-translate-y-1 transition-all duration-300 p-2"
          aria-label="GitHub"
        >
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 0C5.374 0 0 5.373 0 12 0 17.302 3.438 21.8 8.207 23.387c.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z"/>
          </svg>
        </a>
        
        <a
          href={personalInfo.linkedin}
          target="_blank"
          rel="noopener noreferrer"
          className="text-slate-400 hover:text-green-400 hover:-translate-y-1 transition-all duration-300 p-2"
          aria-label="LinkedIn"
        >
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
          </svg>
        </a>
        
        {/* Vertical Line */}
        <div className="w-px h-24 bg-slate-500"></div>
      </div>

      {/* Email - Fixed Position (Better positioning) */}
      <div className="fixed right-6 lg:right-8 bottom-0 hidden lg:flex flex-col items-center z-20">
        <a
          href={`mailto:${personalInfo.email}`}
          className="text-slate-400 hover:text-green-400 hover:-translate-y-1 transition-all duration-300 text-sm font-mono tracking-widest mb-6 [writing-mode:vertical-rl] [text-orientation:mixed]"
          aria-label="Email"
        >
          {personalInfo.email}
        </a>
        
        {/* Vertical Line */}
        <div className="w-px h-24 bg-slate-500"></div>
      </div>

      {/* Scroll Down Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 lg:hidden">
        <button
          onClick={scrollToProjects}
          className="animate-bounce text-green-400 hover:text-green-300 transition-colors duration-300"
          aria-label="Scroll down"
        >
          <ArrowDown size={24} />
        </button>
      </div>


    </section>
  );
};

export default Hero;