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
    <section id="experience" className="py-16 px-6 md:px-12 lg:px-24 xl:px-32">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold text-slate-200 mb-12 relative">
          <span className="text-green-400 font-mono text-xl md:text-2xl mr-2">02.</span>
          {t('experience.title')}
          <span className="block h-px bg-slate-600 mt-4 ml-0 md:ml-32 lg:ml-40"></span>
        </h2>
        
        <div className="space-y-8">
          {experiences.map((exp, index) => (
            <div 
              key={index}
              className="group relative bg-slate-800/30 backdrop-blur-sm border border-slate-700 p-6 md:p-8 rounded-lg hover:border-green-400 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-green-400/10"
            >
              <div className="mb-6">
                <h3 className="text-xl md:text-2xl font-semibold mb-2 text-slate-200">
                  {exp.position}
                  <span className="text-lg md:text-xl ml-2 text-green-400">
                    @ {exp.company}
                  </span>
                </h3>
                <p className="text-sm font-mono text-slate-400">
                  {exp.duration}
                </p>
              </div>

              <div className="space-y-3 mb-6">
                {exp.description.map((desc, descIndex) => (
                  <div key={descIndex} className="flex items-start group-hover:translate-x-1 transition-transform duration-300">
                    <span className="mr-3 mt-2 flex-shrink-0 text-green-400 font-mono">▹</span>
                    <p className="leading-relaxed text-slate-400 group-hover:text-slate-300 transition-colors duration-300">
                      {desc}
                    </p>
                  </div>
                ))}
              </div>

              {/* Technologies */}
              <div className="flex flex-wrap gap-2">
                {exp.technologies.map((tech, techIndex) => (
                  <span
                    key={techIndex}
                    className="px-3 py-1 bg-green-400/10 border border-green-400/20 text-green-400 rounded-full text-sm font-mono hover:bg-green-400/20 hover:border-green-400/40 transition-all duration-300 cursor-default"
                  >
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