import { Mail, Phone, MapPin, Github, Linkedin, Send } from 'lucide-react';
import { personalInfo } from '../data/portfolio';
import { useLanguage } from '../contexts/LanguageContext';

// Reusable components to reduce repetition
const ContactItem = ({ icon: Icon, label, value, href, isClickable = false }: {
  icon: any;
  label: string;
  value: string;
  href?: string;
  isClickable?: boolean;
}) => (
  <div className="flex items-center space-x-4 group">
    <div className="bg-slate-800/50 p-3 rounded-lg border border-slate-700 group-hover:border-green-400 transition-colors duration-300">
      <Icon className="text-green-400" size={20} />
    </div>
    <div>
      <p className="font-medium text-slate-200">{label}</p>
      {isClickable && href ? (
        <a 
          href={href} 
          className="text-green-400 hover:text-slate-200 transition-colors duration-300"
          target={href.startsWith('http') ? '_blank' : undefined}
          rel={href.startsWith('http') ? 'noopener noreferrer' : undefined}
        >
          {value}
        </a>
      ) : (
        <p className="text-slate-400">{value}</p>
      )}
    </div>
  </div>
);

const SocialLink = ({ href, icon: Icon }: { href: string; icon: any }) => (
  <a
    href={href}
    target="_blank"
    rel="noopener noreferrer"
    className="bg-slate-800/50 p-3 rounded-lg border border-slate-700 hover:border-green-400 hover:-translate-y-1 transition-all duration-300 group"
  >
    <Icon className="text-slate-400 group-hover:text-green-400 transition-colors duration-300" size={20} />
  </a>
);

const FormField = ({ 
  id, 
  name, 
  type = "text", 
  label, 
  placeholder, 
  required = false, 
  rows, 
  autoComplete 
}: {
  id: string;
  name: string;
  type?: string;
  label: string;
  placeholder: string;
  required?: boolean;
  rows?: number;
  autoComplete?: string;
}) => {
  const baseClasses = "w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-slate-200 placeholder-slate-400 focus:outline-none focus:border-green-400 focus:ring-1 focus:ring-green-400 transition-colors duration-300";
  
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-slate-300 mb-2">
        {label}
      </label>
      {type === 'textarea' ? (
        <textarea
          id={id}
          name={name}
          rows={rows}
          required={required}
          className={`${baseClasses} resize-vertical`}
          placeholder={placeholder}
        />
      ) : (
        <input
          type={type}
          id={id}
          name={name}
          required={required}
          autoComplete={autoComplete}
          className={baseClasses}
          placeholder={placeholder}
        />
      )}
    </div>
  );
};

const Contact = () => {
  const { t } = useLanguage();
  
  return (
    <section id="contact" className="py-16 px-6 md:px-12 lg:px-32 xl:px-40">
      {/* Contact section with extra side padding to avoid fixed elements */}
      <div className="max-w-4xl mx-auto lg:max-w-5xl">
        <h2 className="text-3xl md:text-4xl font-bold text-slate-200 mb-12 relative">
          <span className="text-green-400 font-mono text-xl md:text-2xl mr-2">05.</span>
          {t('contact.title')}
          <span className="block h-px bg-slate-600 mt-4 ml-0 md:ml-32 lg:ml-40"></span>
        </h2>
        
        <div className="grid lg:grid-cols-2 gap-12 max-w-5xl mx-auto items-start">
          {/* Contact Info */}
          <div className="space-y-8">
            <div>
              <h3 className="text-2xl font-semibold text-slate-200 mb-6">{t('contact.getInTouch')}</h3>
              <p className="text-slate-400 mb-8 leading-relaxed">
                {t('contact.description')}
              </p>
            </div>
            
            <div className="space-y-6">
              <ContactItem
                icon={Mail}
                label={t('contact.email')}
                value={personalInfo.email}
                href={`mailto:${personalInfo.email}`}
                isClickable={true}
              />
              
              <ContactItem
                icon={Phone}
                label={t('contact.phone')}
                value={personalInfo.phone}
                href={`tel:${personalInfo.phone}`}
                isClickable={true}
              />
              
              <ContactItem
                icon={MapPin}
                label={t('contact.location')}
                value={personalInfo.location}
                href="https://maps.app.goo.gl/bibxM2oeW1u7ypGY9"
                isClickable={true}
              />
            </div>
            
            {/* Social Links */}
            <div className="pt-8 border-t border-slate-700">
              <h4 className="text-lg font-semibold text-slate-200 mb-4">{t('contact.socialMedia')}</h4>
              <div className="flex space-x-4">
                <SocialLink href={personalInfo.github} icon={Github} />
                <SocialLink href={personalInfo.linkedin} icon={Linkedin} />
              </div>
            </div>
          </div>
          
          {/* Contact Form */}
          <div className="bg-slate-800/30 backdrop-blur-sm border border-slate-700 p-8 rounded-lg hover:border-green-400 transition-all duration-300">
            <h3 className="text-xl font-semibold text-slate-200 mb-6">{t('contact.form.title')}</h3>
            
            <form action="https://formspree.io/f/xqalaadl" method="POST" className="space-y-6">
              <FormField
                id="name"
                name="name"
                label={t('contact.form.name')}
                placeholder={t('contact.form.namePlaceholder')}
                required={true}
                autoComplete="name"
              />
              
              <FormField
                id="email"
                name="email"
                type="email"
                label={t('contact.form.email')}
                placeholder={t('contact.form.emailPlaceholder')}
                required={true}
                autoComplete="email"
              />
              
              <FormField
                id="subject"
                name="subject"
                label={t('contact.form.subject')}
                placeholder={t('contact.form.subjectPlaceholder')}
                required={true}
              />
              
              <FormField
                id="message"
                name="message"
                type="textarea"
                label={t('contact.form.message')}
                placeholder={t('contact.form.messagePlaceholder')}
                required={true}
                rows={4}
              />
              
              <button
                type="submit"
                className="w-full py-4 px-6 bg-green-400/10 border border-green-400 text-green-400 rounded-lg font-medium hover:bg-green-400 hover:text-slate-900 transition-all duration-300 flex items-center justify-center space-x-3 group"
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