import React from 'react';
import { ExternalLink, Github, Folder, Star } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

const Projects: React.FC = () => {
  const { t } = useLanguage();
  
  const translatedProjects = [
    {
      name: t('projects.journeyOfCrops.name'),
      description: t('projects.journeyOfCrops.description'),
      technologies: ["Three.js", "WebGL2", "JavaScript", "Dynamic Programming"],
      features: [
        t('projects.journeyOfCrops.feature1'),
        t('projects.journeyOfCrops.feature2'),
        t('projects.journeyOfCrops.feature3'),
        t('projects.journeyOfCrops.feature4')
      ],
      github: undefined,
      link: undefined,
      featured: true
    },
    {
      name: t('projects.linkedHU.name'),
      description: t('projects.linkedHU.description'),
      technologies: ["Node.js", "Express", "MongoDB", "React", "JWT"],
      features: [
        t('projects.linkedHU.feature1'),
        t('projects.linkedHU.feature2'),
        t('projects.linkedHU.feature3'),
        t('projects.linkedHU.feature4')
      ],
      github: "https://github.com/eyzaun/linkedhu",
      link: undefined,
      featured: true
    },
    {
      name: t('projects.avukatLLM.name'),
      description: t('projects.avukatLLM.description'),
      technologies: ["Python", "PyTorch", "Transformers", "Microsoft Phi-4", "NLP"],
      features: [
        t('projects.avukatLLM.feature1'),
        t('projects.avukatLLM.feature2'),
        t('projects.avukatLLM.feature3'),
        t('projects.avukatLLM.feature4')
      ],
      github: undefined,
      link: undefined,
      featured: true
    },
    {
      name: t('projects.goDash.name'),
      description: t('projects.goDash.description'),
      technologies: ["Go", "Gin Framework", "WebSocket", "PostgreSQL", "GORM", "Docker"],
      features: [
        t('projects.goDash.feature1'),
        t('projects.goDash.feature2'),
        t('projects.goDash.feature3'),
        t('projects.goDash.feature4')
      ],
      github: "https://github.com/eyzaun/godash",
      link: undefined
    }
  ];
  
  return (
    <section id="projects" className="section">
      <div className="container">
        <div className="section-title-wrapper">
          <span className="section-number">03.</span>
          <h2 className="section-title">{t('projects.title')}</h2>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {translatedProjects.map((project, index) => (
            <div 
              key={index} 
              className="group relative bg-light-navy p-6 rounded-lg border border-slate hover:border-green-300 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-navy/20"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <Folder className="text-green-300" size={24} />
                  <h3 className="text-xl font-semibold text-lightest-slate group-hover:text-green-300 transition-colors duration-300">{project.name}</h3>
                </div>
                <div className="flex items-center space-x-2">
                  {project.github && (
                    <a
                      href={project.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-slate hover:text-green-300 transition-colors duration-300 hover:-translate-y-1 transform"
                    >
                      <Github size={20} />
                    </a>
                  )}
                  {project.link && (
                    <a
                      href={project.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-slate hover:text-green-300 transition-colors duration-300 hover:-translate-y-1 transform"
                    >
                      <ExternalLink size={20} />
                    </a>
                  )}
                </div>
              </div>
              
              <p className="text-slate mb-4 leading-relaxed">{project.description}</p>
              
              <div className="space-y-3 mb-6">
                {project.features.map((feature, featureIndex) => (
                  <div key={featureIndex} className="flex items-start space-x-2">
                    <Star className="text-green-300 mt-1 flex-shrink-0" size={16} />
                    <span className="text-slate text-sm leading-relaxed">{feature}</span>
                  </div>
                ))}
              </div>
              
              <div className="flex flex-wrap gap-2">
                {project.technologies.map((tech, techIndex) => (
                  <span
                    key={techIndex}
                    className="px-3 py-1 bg-navy border border-slate text-slate rounded-full text-sm font-medium hover:border-green-300 hover:text-green-300 transition-colors duration-300"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
        
        <div className="text-center mt-12">
          <a
            href="https://github.com/eyzaun"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary inline-flex items-center space-x-2 group"
          >
            <Github size={20} className="group-hover:scale-110 transition-transform duration-300" />
            <span>{t('projects.moreProjects')}</span>
          </a>
        </div>
      </div>
    </section>
  );
};

export default Projects;
