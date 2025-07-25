import React, { useState } from 'react';
import { useLanguage } from '../contexts/LanguageContext';

const Experience: React.FC = () => {
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState(0);
  
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
      <h2 className="section-title fade-in">
        {t('experience.title')}
      </h2>
      
      <div className="max-w-5xl mx-auto">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Tab Navigation */}
          <div className="lg:w-1/4">
            <div className="flex lg:flex-col overflow-x-auto lg:overflow-x-visible">
              {experiences.map((exp, index) => (
                <button
                  key={index}
                  onClick={() => setActiveTab(index)}
                  className={`px-4 py-3 text-left whitespace-nowrap lg:whitespace-normal border-l-2 transition-all duration-300 ${
                    activeTab === index
                      ? 'border-green-400 bg-green-400/10 text-green-400'
                      : 'border-gray-600 text-slate-400 hover:bg-slate-800/50 hover:text-green-400'
                  }`}
                  style={{
                    borderLeftColor: activeTab === index ? 'var(--green)' : 'var(--lighter-navy)',
                    backgroundColor: activeTab === index ? 'var(--green-tint)' : 'transparent',
                    color: activeTab === index ? 'var(--green)' : 'var(--slate)'
                  }}
                >
                  <div className="font-mono text-sm">{exp.company}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Tab Content */}
          <div className="lg:w-3/4">
            <div className="fade-in-delay-1">
              <div className="mb-4">
                <h3 className="text-xl font-semibold" style={{ color: 'var(--lightest-slate)' }}>
                  {experiences[activeTab].position}
                  <span className="text-lg ml-2" style={{ color: 'var(--green)' }}>
                    @ {experiences[activeTab].company}
                  </span>
                </h3>
                <p className="text-sm font-mono mt-1" style={{ color: 'var(--slate)' }}>
                  {experiences[activeTab].duration}
                </p>
              </div>

              <div className="space-y-3 mb-6">
                {experiences[activeTab].description.map((desc, index) => (
                  <div key={index} className="flex items-start">
                    <span className="mr-3 mt-2" style={{ color: 'var(--green)' }}>▹</span>
                    <p style={{ color: 'var(--slate)' }}>{desc}</p>
                  </div>
                ))}
              </div>

              {/* Technologies */}
              <div className="flex flex-wrap gap-2">
                {experiences[activeTab].technologies.map((tech, index) => (
                  <span key={index} className="tech-tag">
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Experience;