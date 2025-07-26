import React, { useState, useEffect } from 'react';
import { ExternalLink, Github, Folder, Star } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { SkeletonCard } from './SkeletonLoader';

const Projects: React.FC = () => {
  const { t } = useLanguage();
  const [isLoading, setIsLoading] = useState(true);
  
  // Simulate loading delay
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);
    
    return () => clearTimeout(timer);
  }, []);
  
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
    <section id="projects" className="py-16 px-6 md:px-12 lg:px-24 xl:px-32">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold text-slate-200 mb-12 relative">
          <span className="text-green-400 font-mono text-xl md:text-2xl mr-2">03.</span>
          {t('projects.title')}
          <span className="block h-px bg-slate-600 mt-4 ml-0 md:ml-32 lg:ml-40"></span>
        </h2>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {isLoading ? (
            // Loading skeletons
            Array.from({ length: 4 }, (_, i) => (
              <SkeletonCard 
                key={i} 
                className="animate-pulse"
                style={{ animationDelay: `${i * 200}ms` }}
              />
            ))
          ) : (
            // Actual projects with staggered animation
            translatedProjects.map((project, index) => (
              <div 
                key={index} 
                className="group relative bg-slate-800/30 backdrop-blur-sm border border-slate-700 p-6 rounded-lg hover:border-green-400 transition-all duration-500 hover:-translate-y-2 hover:shadow-xl hover:shadow-green-400/10 opacity-0 animate-fade-in-up"
                style={{ animationDelay: `${index * 200}ms` }}
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <Folder className="text-green-400 group-hover:scale-110 transition-transform duration-300" size={24} />
                    <h3 className="text-xl font-semibold text-slate-200 group-hover:text-green-400 transition-colors duration-300">
                      {project.name}
                    </h3>
                  </div>
                  <div className="flex items-center space-x-2">
                    {project.github && (
                      <a
                        href={project.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-slate-400 hover:text-green-400 transition-all duration-300 hover:-translate-y-1 transform hover:scale-110"
                        aria-label="View GitHub repository"
                      >
                        <Github size={20} />
                      </a>
                    )}
                    {project.link && (
                      <a
                        href={project.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-slate-400 hover:text-green-400 transition-all duration-300 hover:-translate-y-1 transform hover:scale-110"
                        aria-label="View live project"
                      >
                        <ExternalLink size={20} />
                      </a>
                    )}
                  </div>
                </div>
                
                <p className="text-slate-400 mb-4 leading-relaxed group-hover:text-slate-300 transition-colors duration-300">
                  {project.description}
                </p>
                
                <div className="space-y-3 mb-6">
                  {project.features.map((feature, featureIndex) => (
                    <div 
                      key={featureIndex} 
                      className="flex items-start space-x-2 group-hover:translate-x-1 transition-transform duration-300"
                      style={{ transitionDelay: `${featureIndex * 50}ms` }}
                    >
                      <Star className="text-green-400 mt-1 flex-shrink-0 group-hover:rotate-12 transition-transform duration-300" size={16} />
                      <span className="text-slate-400 text-sm leading-relaxed group-hover:text-slate-300 transition-colors duration-300">
                        {feature}
                      </span>
                    </div>
                  ))}
                </div>
                
                <div className="flex flex-wrap gap-2">
                  {project.technologies.map((tech, techIndex) => (
                    <span
                      key={techIndex}
                      className="px-3 py-1 bg-green-400/10 border border-green-400/20 text-green-400 rounded-full text-sm font-mono hover:bg-green-400/20 hover:border-green-400/40 hover:scale-105 transition-all duration-300 cursor-default"
                      style={{ transitionDelay: `${techIndex * 100}ms` }}
                    >
                      {tech}
                    </span>
                  ))}
                </div>

                {/* Hover overlay effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-green-400/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-lg pointer-events-none"></div>
              </div>
            ))
          )}
        </div>
        
        <div className="text-center mt-12">
          <a
            href="https://github.com/eyzaun"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center space-x-3 py-4 px-6 bg-green-400/10 border border-green-400 text-green-400 rounded-lg font-medium hover:bg-green-400 hover:text-slate-900 transition-all duration-500 group hover:scale-105 hover:shadow-lg hover:shadow-green-400/25"
          >
            <Github size={20} className="group-hover:scale-110 transition-transform duration-300" />
            <span className="text-lg">{t('projects.moreProjects')}</span>
          </a>
        </div>
      </div>
    </section>
  );
};

export default Projects;