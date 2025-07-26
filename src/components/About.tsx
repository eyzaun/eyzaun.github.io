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
    <section id="about" className="section py-16 px-6 md:px-12 lg:px-24 xl:px-32">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold text-slate-200 mb-12 fade-in relative">
          <span className="text-green-400 font-mono text-xl md:text-2xl mr-2">01.</span>
          {t('about.title')}
          <span className="block h-px bg-slate-600 mt-4 ml-0 md:ml-32 lg:ml-40"></span>
        </h2>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-start">
          {/* About Text */}
          <div className="lg:col-span-2 space-y-6 fade-in-delay-1">
            <p className="text-slate-400 text-lg leading-relaxed">
              {t('about.description1')}
            </p>

            <p className="text-slate-400 text-lg leading-relaxed">
              {t('about.description2')}
            </p>

            <p className="text-slate-400 text-lg leading-relaxed">
              {t('about.description3')}
            </p>

            {/* Technologies Grid */}
            <div className="mt-8">
              <h3 className="text-slate-200 text-xl font-semibold mb-4">
                Technologies I work with:
              </h3>
              <div className="grid grid-cols-2 gap-2">
                {technologies.map((tech, index) => (
                  <div 
                    key={tech} 
                    className="flex items-center transition-all duration-300 hover:transform hover:translate-x-1" 
                    style={{ transitionDelay: `${index * 50}ms` }}
                  >
                    <span className="text-green-400 text-sm mr-3 font-mono">▹</span>
                    <span className="font-mono text-sm text-slate-400 hover:text-slate-200 transition-colors duration-300">
                      {tech}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Education */}
          <div className="lg:col-span-1 fade-in-delay-2">
            <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-lg p-6 hover:border-green-400 transition-all duration-300 hover:shadow-lg hover:shadow-green-400/10">
              <h3 className="text-xl font-semibold mb-6 text-slate-200 flex items-center">
                <span className="text-green-400 mr-2">🎓</span>
                {t('about.education.title')}
              </h3>
              
              {translatedEducation.map((edu, index) => (
                <div key={index} className="mb-6 last:mb-0 p-4 bg-slate-900/30 rounded border border-slate-700/50 hover:border-slate-600 transition-colors duration-300">
                  <h4 className="font-semibold text-slate-200 mb-2">
                    {edu.degree}
                  </h4>
                  <p className="text-green-400 text-sm font-medium mb-1">
                    {edu.institution}
                  </p>
                  {edu.year && (
                    <p className="text-slate-400 text-sm">
                      {edu.year}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;