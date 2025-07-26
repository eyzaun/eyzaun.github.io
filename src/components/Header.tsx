import React, { useState, useEffect } from 'react';
import { Menu, X, Globe } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

const Header: React.FC = () => {
  const { language, setLanguage, t } = useLanguage();
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState('');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 100);
      
      // Active section detection
      const sections = ['about', 'experience', 'projects', 'skills', 'contact'];
      const current = sections.find(section => {
        const element = document.getElementById(section);
        if (element) {
          const rect = element.getBoundingClientRect();
          return rect.top <= 150 && rect.bottom >= 150;
        }
        return false;
      });
      setActiveSection(current || '');
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      const offsetTop = element.offsetTop - 100;
      window.scrollTo({
        top: offsetTop,
        behavior: 'smooth'
      });
    }
    setIsMobileMenuOpen(false);
  };

  const navItems = [
    { id: 'about', label: t('nav.about') },
    { id: 'experience', label: t('nav.experience') },
    { id: 'projects', label: t('nav.projects') },
    { id: 'skills', label: t('nav.skills') },
    { id: 'contact', label: t('nav.contact') }
  ];

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled 
          ? 'bg-slate-900/95 backdrop-blur-md shadow-lg border-b border-slate-700/50' 
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          
          {/* Logo */}
          <div className="animate-fade-in">
            <a 
              href="#" 
              className="text-xl md:text-2xl font-bold font-mono hover:scale-105 transition-transform duration-300"
              onClick={(e) => {
                e.preventDefault();
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
            >
              <span className="text-green-400">Ey</span>
              <span className="text-slate-200">üp </span>
              <span className="text-green-400">Za</span>
              <span className="text-slate-200">fer </span>
              <span className="text-green-400">Ün</span>
              <span className="text-slate-200">al</span>
            </a>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:block">
            <ol className="flex items-center space-x-8">
              {navItems.map((item, index) => (
                <li key={item.id}>
                  <button
                    onClick={() => scrollToSection(item.id)}
                    className={`relative px-3 py-2 text-sm lg:text-base font-mono transition-all duration-300 hover:text-green-400 group ${
                      activeSection === item.id ? 'text-green-400' : 'text-slate-300'
                    }`}
                    style={{ 
                      animationDelay: `${index * 100}ms`,
                      animation: 'fadeInDown 0.6s ease-out forwards'
                    }}
                  >
                    <span className="text-green-400 text-xs mr-2">0{index + 1}.</span>
                    {item.label}
                    
                    {/* Hover underline */}
                    <span className={`absolute bottom-0 left-0 w-full h-0.5 bg-green-400 transform origin-left transition-transform duration-300 ${
                      activeSection === item.id ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'
                    }`}></span>
                  </button>
                </li>
              ))}
              
              {/* Language Toggle */}
              <li className="ml-6">
                <button
                  onClick={() => setLanguage(language === 'tr' ? 'en' : 'tr')}
                  className="flex items-center gap-2 px-4 py-2 text-sm border border-green-400 text-green-400 rounded hover:bg-green-400/10 transition-all duration-300 hover:scale-105"
                  title={t('nav.toggleLanguage')}
                >
                  <Globe size={16} />
                  <span className="font-mono">{language.toUpperCase()}</span>
                </button>
              </li>
            </ol>
          </nav>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 text-green-400 hover:bg-green-400/10 rounded transition-colors duration-300"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle mobile menu"
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-slate-900/98 backdrop-blur-lg border-t border-slate-700/50">
          <nav className="px-4 py-6">
            <ol className="space-y-4">
              {navItems.map((item, index) => (
                <li key={item.id}>
                  <button
                    onClick={() => scrollToSection(item.id)}
                    className={`block w-full text-left px-4 py-3 rounded-lg font-mono transition-all duration-300 hover:bg-green-400/10 hover:text-green-400 hover:translate-x-2 ${
                      activeSection === item.id ? 'text-green-400 bg-green-400/5' : 'text-slate-300'
                    }`}
                    style={{ 
                      animationDelay: `${index * 100}ms`,
                      animation: 'slideInLeft 0.4s ease-out forwards'
                    }}
                  >
                    <span className="text-green-400 text-sm mr-3">0{index + 1}.</span>
                    {item.label}
                  </button>
                </li>
              ))}
              
              {/* Mobile Language Toggle */}
              <li className="pt-4 border-t border-slate-700/50">
                <button
                  onClick={() => setLanguage(language === 'tr' ? 'en' : 'tr')}
                  className="flex items-center gap-3 px-4 py-3 text-sm border border-green-400 text-green-400 rounded-lg hover:bg-green-400/10 transition-all duration-300 font-mono"
                  title={t('nav.toggleLanguage')}
                >
                  <Globe size={16} />
                  <span>{language.toUpperCase()}</span>
                </button>
              </li>
            </ol>
          </nav>
        </div>
      )}


    </header>
  );
};

export default Header;