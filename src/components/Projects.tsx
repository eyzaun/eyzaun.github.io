import { ExternalLink, Github, Folder, Star } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

const Projects = () => {
  const { t } = useLanguage();
  
  const translatedProjects = [
    {
      name: t('projects.journeyOfCrops.name'),
      description: t('projects.journeyOfCrops.description'),
      technologies: ["Three.js", "WebGL2", "JavaScript", "Dynamic Programming"],
      features: [
        "Resource optimization using dynamic programming (Knapsack algorithms)",
        "Interactive rail system simulation using Three.js and WebGL2",
        "Animated visualization of algorithmic solutions",
        "Score calculation system based on optimization results"
      ],
      github: undefined,
      link: undefined
    },
    {
      name: t('projects.linkedHU.name'),
      description: t('projects.linkedHU.description'),
      technologies: ["Node.js", "Express", "MongoDB", "React", "JWT"],
      features: [
        "Backend functionality with comprehensive testing procedures using agile methodology",
        "User authentication and profile management systems",
        "RESTful APIs for university networking features",
        "Code quality and performance optimization with CI/CD integration"
      ],
      github: "https://github.com/eyzaun/linkedhu",
      link: undefined
    },
    {
      name: t('projects.avukatLLM.name'),
      description: t('projects.avukatLLM.description'),
      technologies: ["Python", "PyTorch", "Transformers", "Microsoft Phi-4", "NLP"],
      features: [
        "85% response accuracy in Turkish tax law consultations",
        "Model quantization for 75% memory reduction",
        "Continuous model improvement pipeline",
        "Multi-language support with Turkish focus"
      ],
      github: undefined,
      link: undefined
    },
    {
      name: t('projects.goDash.name'),
      description: t('projects.goDash.description'),
      technologies: ["Go", "Gin Framework", "WebSocket", "PostgreSQL", "GORM", "Docker"],
      features: [
        "Built real-time system monitoring dashboard using Go, Gin framework, and WebSocket connections",
        "Implemented CPU, memory, and disk usage tracking with automated alert system via email/webhook",
        "Designed REST API with PostgreSQL storage using GORM for historical data analysis",
        "Created responsive web interface and Docker containerization for cross-platform deployment"
      ],
      github: "https://github.com/eyzaun/godash",
      link: undefined
    }
  ];
  
  return (
    <section id="projects" className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <h2 className="section-title">{t('projects.title')}</h2>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {translatedProjects.map((project, index) => (
            <div key={index} className="card group hover:scale-105 transition-transform duration-300">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <Folder className="text-blue-600" size={24} />
                  <h3 className="text-xl font-semibold text-gray-900">{project.name}</h3>
                </div>
                <div className="flex items-center space-x-2">
                  {project.github && (
                    <a
                      href={project.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-600 hover:text-blue-600 transition-colors"
                    >
                      <Github size={20} />
                    </a>
                  )}
                  {project.link && (
                    <a
                      href={project.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-600 hover:text-blue-600 transition-colors"
                    >
                      <ExternalLink size={20} />
                    </a>
                  )}
                </div>
              </div>
              
              <p className="text-gray-700 mb-4">{project.description}</p>
              
              <div className="space-y-3 mb-6">
                {project.features.map((feature, featureIndex) => (
                  <div key={featureIndex} className="flex items-start space-x-2">
                    <Star className="text-yellow-500 mt-1" size={16} />
                    <span className="text-gray-700 text-sm">{feature}</span>
                  </div>
                ))}
              </div>
              
              <div className="flex flex-wrap gap-2">
                {project.technologies.map((tech, techIndex) => (
                  <span
                    key={techIndex}
                    className="px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-sm font-medium"
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
            className="btn-primary inline-flex items-center space-x-2"
          >
            <Github size={20} />
            <span>{t('projects.moreProjects')}</span>
          </a>
        </div>
      </div>
    </section>
  );
};

export default Projects;
