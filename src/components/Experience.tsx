import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';

const Experience: React.FC = () => {
  const { t } = useLanguage();
  
  const experiences = [
    {
      company: t('experience.binaryBrain.company'),
      position: t('experience.binaryBrain.title'),
      duration: t('experience.binaryBrain.period'),
      description: [
        t('experience.binaryBrain.description1'),
        t('experience.binaryBrain.description2'),
        t('experience.binaryBrain.description3'),
        t('experience.binaryBrain.description4')
      ],
      technologies: ["Python", "PyTorch", "Transformers", "Flutter", "Firebase", "Microsoft Phi-4", "LLM"]
    },
    {
      company: t('experience.tellus.company'),
      position: t('experience.tellus.title'),
      duration: t('experience.tellus.period'),
      description: [
        t('experience.tellus.description1'),
        t('experience.tellus.description2'),
        t('experience.tellus.description3')
      ],
      technologies: ["Arduino", "C++", "CANbus", "OBD2", "PID Control"]
    }
  ];

  return (
    <section id="experience" className="section">
      <div className="container">
        <h2 className="section-title">{t('experience.title')}</h2>
        
        <div className="space-y-8">
          {experiences.map((exp, index) => (
            <div 
              key={index}
              className="group relative bg-light-navy p-6 md:p-8 rounded-lg border border-slate hover:border-green-300 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-navy/20"
            >
              <div className="mb-6">
                <h3 className="text-xl md:text-2xl font-semibold mb-2" style={{ color: 'var(--lightest-slate)' }}>
                  {exp.position}
                  <span className="text-lg md:text-xl ml-2" style={{ color: 'var(--green)' }}>
                    @ {exp.company}
                  </span>
                </h3>
                <p className="text-sm font-mono" style={{ color: 'var(--slate)' }}>
                  {exp.duration}
                </p>
              </div>

              <div className="space-y-3 mb-6">
                {exp.description.map((desc, descIndex) => (
                  <div key={descIndex} className="flex items-start">
                    <span className="mr-3 mt-2 flex-shrink-0" style={{ color: 'var(--green)' }}>▹</span>
                    <p className="leading-relaxed" style={{ color: 'var(--slate)' }}>{desc}</p>
                  </div>
                ))}
              </div>

              {/* Technologies */}
              <div className="flex flex-wrap gap-2">
                {exp.technologies.map((tech, techIndex) => (
                  <span key={techIndex} className="tech-tag">
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Experience;