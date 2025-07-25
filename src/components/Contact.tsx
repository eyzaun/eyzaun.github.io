import { Mail, Phone, MapPin, Github, Linkedin, Send } from 'lucide-react';
import { personalInfo } from '../data/portfolio';
import { useLanguage } from '../contexts/LanguageContext';

const Contact = () => {
  const { t } = useLanguage();
  
  return (
    <section id="contact" className="section">
      <div className="container">
        <h2 className="section-title">{t('contact.title')}</h2>
        
        <div className="grid md:grid-cols-2 gap-12 max-w-6xl mx-auto items-start">
          {/* Contact Info */}
          <div className="space-y-8">
            <div>
              <h3 className="text-2xl font-semibold text-lightest-slate mb-6">{t('contact.getInTouch')}</h3>
              <p className="text-slate mb-8 leading-relaxed">
                {t('contact.description')}
              </p>
            </div>
            
            <div className="space-y-6">
              <div className="flex items-center space-x-4 group">
                <div className="bg-light-navy p-3 rounded-lg border border-slate group-hover:border-green-300 transition-colors duration-300">
                  <Mail className="text-green-300" size={20} />
                </div>
                <div>
                  <p className="font-medium text-lightest-slate">{t('contact.email')}</p>
                  <a 
                    href={`mailto:${personalInfo.email}`}
                    className="text-green-300 hover:text-lightest-slate transition-colors duration-300"
                  >
                    {personalInfo.email}
                  </a>
                </div>
              </div>
              
              <div className="flex items-center space-x-4 group">
                <div className="bg-light-navy p-3 rounded-lg border border-slate group-hover:border-green-300 transition-colors duration-300">
                  <Phone className="text-green-300" size={20} />
                </div>
                <div>
                  <p className="font-medium text-lightest-slate">{t('contact.phone')}</p>
                  <a 
                    href={`tel:${personalInfo.phone}`}
                    className="text-green-300 hover:text-lightest-slate transition-colors duration-300"
                  >
                    {personalInfo.phone}
                  </a>
                </div>
              </div>
              
              <div className="flex items-center space-x-4 group">
                <div className="bg-light-navy p-3 rounded-lg border border-slate group-hover:border-green-300 transition-colors duration-300">
                  <MapPin className="text-green-300" size={20} />
                </div>
                <div>
                  <p className="font-medium text-lightest-slate">{t('contact.location')}</p>
                  <p className="text-slate">{personalInfo.location}</p>
                </div>
              </div>
            </div>
            
            {/* Social Links */}
            <div className="pt-8 border-t border-slate">
              <h4 className="text-lg font-semibold text-lightest-slate mb-4">{t('contact.socialMedia')}</h4>
              <div className="flex space-x-4">
                <a
                  href={personalInfo.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-light-navy p-3 rounded-lg border border-slate hover:border-green-300 hover:-translate-y-1 transition-all duration-300"
                >
                  <Github className="text-slate hover:text-green-300 transition-colors duration-300" size={20} />
                </a>
                <a
                  href={personalInfo.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-light-navy p-3 rounded-lg border border-slate hover:border-green-300 hover:-translate-y-1 transition-all duration-300"
                >
                  <Linkedin className="text-slate hover:text-green-300 transition-colors duration-300" size={20} />
                </a>
              </div>
            </div>
          </div>
          
          {/* Contact Form */}
          <div className="bg-light-navy p-8 rounded-lg border border-slate">
            <h3 className="text-xl font-semibold text-lightest-slate mb-6">{t('contact.form.title')}</h3>
            
            <form 
              action="https://formspree.io/f/xqalaadl"
              method="POST"
              className="space-y-6"
            >
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-slate mb-2">
                  {t('contact.form.name')}
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  required
                  autoComplete="name"
                  className="w-full px-4 py-3 bg-light-navy border border-slate rounded-lg text-lightest-slate placeholder-slate focus:outline-none focus:border-green-300 focus:ring-1 focus:ring-green-300 transition-colors duration-300"
                  placeholder={t('contact.form.namePlaceholder')}
                />
              </div>
              
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-slate mb-2">
                  {t('contact.form.email')}
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  required
                  autoComplete="email"
                  className="w-full px-4 py-3 bg-light-navy border border-slate rounded-lg text-lightest-slate placeholder-slate focus:outline-none focus:border-green-300 focus:ring-1 focus:ring-green-300 transition-colors duration-300"
                  placeholder={t('contact.form.emailPlaceholder')}
                />
              </div>
              
              <div>
                <label htmlFor="subject" className="block text-sm font-medium text-slate mb-2">
                  {t('contact.form.subject')}
                </label>
                <input
                  type="text"
                  id="subject"
                  name="subject"
                  required
                  className="w-full px-4 py-3 bg-light-navy border border-slate rounded-lg text-lightest-slate placeholder-slate focus:outline-none focus:border-green-300 focus:ring-1 focus:ring-green-300 transition-colors duration-300"
                  placeholder={t('contact.form.subjectPlaceholder')}
                />
              </div>
              
              <div>
                <label htmlFor="message" className="block text-sm font-medium text-slate mb-2">
                  {t('contact.form.message')}
                </label>
                <textarea
                  id="message"
                  name="message"
                  rows={4}
                  required
                  className="w-full px-4 py-3 bg-light-navy border border-slate rounded-lg text-lightest-slate placeholder-slate focus:outline-none focus:border-green-300 focus:ring-1 focus:ring-green-300 transition-colors duration-300 resize-vertical"
                  placeholder={t('contact.form.messagePlaceholder')}
                ></textarea>
              </div>
              
              <button
                type="submit"
                className="w-full py-4 px-6 bg-green-300/10 border border-green-300 text-green-300 rounded-lg font-medium hover:bg-green-300 hover:text-navy transition-all duration-300 flex items-center justify-center space-x-3 group"
              >
                <Send size={20} className="group-hover:translate-x-1 transition-transform duration-300" />
                <span className="text-lg">{t('contact.form.send')}</span>
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
