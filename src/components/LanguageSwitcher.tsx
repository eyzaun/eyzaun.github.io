import React from 'react';
import { Globe } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

const LanguageSwitcher: React.FC = () => {
  const { language, setLanguage } = useLanguage();

  const toggleLanguage = () => {
    setLanguage(language === 'tr' ? 'en' : 'tr');
  };

  return (
    <button
      onClick={toggleLanguage}
      className="flex items-center space-x-2 px-3 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors"
      title={language === 'tr' ? 'Switch to English' : 'Türkçe\'ye geç'}
    >
      <Globe size={16} />
      <span className="text-sm font-medium">
        {language === 'tr' ? 'EN' : 'TR'}
      </span>
    </button>
  );
};

export default LanguageSwitcher;
