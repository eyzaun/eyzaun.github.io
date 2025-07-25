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
    <header className={`navbar ${isScrolled ? 'shadow-lg' : ''}`}>
      <div className="fade-in">
        <a href="#" className="text-xl font-bold font-mono">
          <span style={{ color: 'var(--green)' }}>Ey</span>
          <span style={{ color: 'var(--lightest-slate)' }}>üp </span>
          <span style={{ color: 'var(--green)' }}>Za</span>
          <span style={{ color: 'var(--lightest-slate)' }}>fer </span>
          <span style={{ color: 'var(--green)' }}>Ün</span>
          <span style={{ color: 'var(--lightest-slate)' }}>al</span>
        </a>
      </div>

      {/* Desktop Navigation */}
      <nav className="hidden md:block fade-in-delay-1">
        <ol className="nav-links">
          {navItems.map((item, index) => (
            <li key={item.id} className="nav-item">
              <button
                onClick={() => scrollToSection(item.id)}
                className={`nav-link ${activeSection === item.id ? 'active' : ''}`}
                style={{ transitionDelay: `${index * 100}ms` }}
              >
                {item.label}
              </button>
            </li>
          ))}
          <li className="nav-item ml-4">
            <button
              onClick={() => setLanguage(language === 'tr' ? 'en' : 'tr')}
              className="btn text-sm px-3 py-2 flex items-center gap-2"
              title={t('nav.toggleLanguage')}
            >
              <Globe size={16} />
              {language.toUpperCase()}
            </button>
          </li>
        </ol>
      </nav>

      {/* Mobile Menu Button */}
      <button
        className="md:hidden p-2"
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        style={{ color: 'var(--green)' }}
      >
        {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Mobile Navigation */}
      {isMobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 bg-[var(--light-navy)] border-t border-[var(--lighter-navy)] shadow-lg">
          <nav className="p-4">
            <ol className="space-y-4">
              {navItems.map((item, index) => (
                <li key={item.id}>
                  <button
                    onClick={() => scrollToSection(item.id)}
                    className="nav-link block w-full text-left"
                    style={{ 
                      transitionDelay: `${index * 100}ms`,
                      color: activeSection === item.id ? 'var(--green)' : 'var(--lightest-slate)'
                    }}
                  >
                    {item.label}
                  </button>
                </li>
              ))}
              <li className="pt-4 border-t border-[var(--lighter-navy)]">
                <button
                  onClick={() => setLanguage(language === 'tr' ? 'en' : 'tr')}
                  className="btn text-sm px-3 py-2 flex items-center gap-2"
                  title={t('nav.toggleLanguage')}
                >
                  <Globe size={16} />
                  {language.toUpperCase()}
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
