import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';

const About: React.FC = () => {
  const { t } = useLanguage();

  const technologies = [
    'JavaScript (ES6+)',
    'TypeScript', 
    'React',
    'Node.js',
    'Python',
    'Django',
    'PostgreSQL',
    'Git & GitHub',
    'Docker',
    'AWS',
    'MongoDB',
    'Go'
  ];

  // Çeviri anahtarlarını kullanan eğitim verileri
  const translatedEducation = [
    {
      institution: t('education.hacettepeUniversity'),
      degree: t('education.computerEngineering'),
      year: "2021-2025"
    },
    {
      institution: "Eskişehir Fatih Fen Lisesi",
      degree: t('education.scienceHighSchool'),
      year: undefined
    },
    {
      institution: "Emine-Emir Şahbaz BİLSEM",
      degree: t('education.scienceArtCenter'),
      year: undefined
    }
  ];

  return (
    <section id="about" className="section">
      <h2 className="section-title fade-in">
        {t('about.title')}
      </h2>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-start">
        {/* About Text */}
        <div className="lg:col-span-2 space-y-4 fade-in-delay-1">
          <p style={{ color: 'var(--slate)' }}>
            {t('about.intro')}
          </p>

          <p style={{ color: 'var(--slate)' }}>
            {t('about.journey')}
          </p>

          <p style={{ color: 'var(--slate)' }}>
            {t('about.focus')}
          </p>

          <p style={{ color: 'var(--slate)' }}>
            {t('about.technologies')}
          </p>

          {/* Technologies Grid */}
          <div className="grid grid-cols-2 gap-2 mt-6">
            {technologies.map((tech, index) => (
              <div key={tech} className="flex items-center" style={{ transitionDelay: `${index * 50}ms` }}>
                <span className="text-sm mr-2" style={{ color: 'var(--green)' }}>▹</span>
                <span className="font-mono text-sm" style={{ color: 'var(--slate)' }}>{tech}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Education */}
        <div className="lg:col-span-1 fade-in-delay-2">
          <div className="card glow">
            <h3 className="text-xl font-semibold mb-4" style={{ color: 'var(--lightest-slate)' }}>
              {t('about.education.title')}
            </h3>
            
            {translatedEducation.map((edu, index) => (
              <div key={index} className="mb-6 last:mb-0">
                <h4 className="font-semibold" style={{ color: 'var(--lightest-slate)' }}>
                  {edu.degree}
                </h4>
                <p className="text-sm" style={{ color: 'var(--green)' }}>
                  {edu.institution}
                </p>
                {edu.year && (
                  <p className="text-sm" style={{ color: 'var(--slate)' }}>
                    {edu.year}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
