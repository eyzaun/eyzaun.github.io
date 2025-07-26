import { Github, Linkedin, Mail, MapPin } from 'lucide-react';
import { personalInfo } from '../data/portfolio';
import { useLanguage } from '../contexts/LanguageContext';

const Footer = () => {
  const { t } = useLanguage();
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-slate-900 border-t border-slate-800 py-12">
      <div className="max-w-6xl mx-auto px-6 md:px-12 lg:px-24 xl:px-32">
        <div className="grid md:grid-cols-3 gap-8">
          {/* About */}
          <div>
            <h3 className="text-xl font-semibold mb-4 text-slate-200">{personalInfo.name}</h3>
            <p className="text-slate-400 mb-4 leading-relaxed">
              {t('footer.description')}
            </p>
            <div className="flex space-x-4">
              <a
                href={personalInfo.github}
                target="_blank"
                rel="noopener noreferrer"
                className="text-slate-400 hover:text-green-400 transition-colors duration-300 p-2 rounded-lg hover:bg-slate-800"
                aria-label="GitHub"
              >
                <Github size={20} />
              </a>
              <a
                href={personalInfo.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="text-slate-400 hover:text-green-400 transition-colors duration-300 p-2 rounded-lg hover:bg-slate-800"
                aria-label="LinkedIn"
              >
                <Linkedin size={20} />
              </a>
              <a
                href={`mailto:${personalInfo.email}`}
                className="text-slate-400 hover:text-green-400 transition-colors duration-300 p-2 rounded-lg hover:bg-slate-800"
                aria-label="Email"
              >
                <Mail size={20} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-xl font-semibold mb-4 text-slate-200">{t('footer.quickLinks')}</h3>
            <ul className="space-y-2">
              <li>
                <a href="#home" className="text-slate-400 hover:text-green-400 transition-colors duration-300">
                  {t('nav.home')}
                </a>
              </li>
              <li>
                <a href="#about" className="text-slate-400 hover:text-green-400 transition-colors duration-300">
                  {t('nav.about')}
                </a>
              </li>
              <li>
                <a href="#experience" className="text-slate-400 hover:text-green-400 transition-colors duration-300">
                  {t('nav.experience')}
                </a>
              </li>
              <li>
                <a href="#projects" className="text-slate-400 hover:text-green-400 transition-colors duration-300">
                  {t('nav.projects')}
                </a>
              </li>
              <li>
                <a href="#skills" className="text-slate-400 hover:text-green-400 transition-colors duration-300">
                  {t('nav.skills')}
                </a>
              </li>
              <li>
                <a href="#contact" className="text-slate-400 hover:text-green-400 transition-colors duration-300">
                  {t('nav.contact')}
                </a>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-xl font-semibold mb-4 text-slate-200">{t('contact.title')}</h3>
            <div className="space-y-3">
              <p className="text-slate-400 flex items-center">
                <Mail className="inline mr-3 text-green-400" size={16} />
                {personalInfo.email}
              </p>
              <p className="text-slate-400 flex items-center">
                <MapPin className="inline mr-3 text-green-400" size={16} />
                {personalInfo.location}
              </p>
            </div>
          </div>
        </div>

        <div className="border-t border-slate-800 mt-8 pt-8 text-center">
          <p className="text-slate-400 flex items-center justify-center flex-wrap">
            <span>© {currentYear} {personalInfo.name}.</span>
            <span className="ml-1">{t('footer.madeWith')} React & Tailwind CSS</span>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;