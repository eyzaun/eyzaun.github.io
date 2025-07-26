import React, { useState, useEffect } from 'react';
import { Code, Database, Globe, Wrench, Brain } from 'lucide-react';
import { skills } from '../data/portfolio';
import { useLanguage } from '../contexts/LanguageContext';
import { SkeletonCard } from './SkeletonLoader';

const Skills: React.FC = () => {
  const { t } = useLanguage();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, []);
  
  // Sabit skill seviyeleri (her skill için 1-5 arası seviye)
  const skillLevels: { [key: string]: number } = {
    // Languages & Frameworks
    "Python": 5,
    "Java": 4,
    "C++": 4,
    "JavaScript": 5,
    "TypeScript": 5,
    "Go": 4,
    "C#": 4,
    
    // Frontend
    "React": 5,
    "Flutter": 4,
    "HTML5": 5,
    "CSS3": 5,
    "Tailwind CSS": 5,
    "Three.js": 3,
    
    // Backend
    "Node.js": 5,
    "Express": 5,
    "ASP.NET Core": 4,
    ".NET Aspire": 3,
    "Gin": 4,
    "Gorilla Mux": 4,
    "GORM": 4,
    "gRPC": 3,
    
    // AI/ML
    "PyTorch": 4,
    "Transformers": 4,
    "LLMs": 4,
    "NLP": 4,
    "TensorFlow": 3,
    
    // Databases
    "MySQL": 4,
    "PostgreSQL": 4,
    "MongoDB": 4,
    "Firebase": 4,
    "Redis": 4,
    
    // Tools & Technologies
    "Git": 5,
    "Docker": 4,
    "CI/CD": 4,
    "Arduino": 4,
    "CANbus": 3,
    "OBD2": 3
  };
  
  const skillCategories = [
    {
      title: t('skills.categories.languagesFrameworks'),
      icon: <Code className="text-green-400" size={24} />,
      skills: skills["Languages & Frameworks"]
    },
    {
      title: t('skills.categories.frontend'),
      icon: <Globe className="text-green-400" size={24} />,
      skills: skills["Frontend"]
    },
    {
      title: t('skills.categories.backend'),
      icon: <Database className="text-green-400" size={24} />,
      skills: skills["Backend"]
    },
    {
      title: t('skills.categories.aiMl'),
      icon: <Brain className="text-green-400" size={24} />,
      skills: skills["AI/ML"]
    },
    {
      title: t('skills.categories.databases'),
      icon: <Database className="text-green-400" size={24} />,
      skills: skills["Databases"]
    },
    {
      title: t('skills.categories.tools'),
      icon: <Wrench className="text-green-400" size={24} />,
      skills: skills["Tools & Technologies"]
    }
  ];

  return (
    <section id="skills" className="py-16 px-6 md:px-12 lg:px-24 xl:px-32">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold text-slate-200 mb-12 relative">
          <span className="text-green-400 font-mono text-xl md:text-2xl mr-2">04.</span>
          {t('skills.title')}
          <span className="block h-px bg-slate-600 mt-4 ml-0 md:ml-32 lg:ml-40"></span>
        </h2>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {isLoading ? (
            // Loading skeletons
            Array.from({ length: 6 }, (_, i) => (
              <SkeletonCard 
                key={i} 
                className="animate-pulse"
                style={{ animationDelay: `${i * 150}ms` }}
              />
            ))
          ) : (
            // Actual skill categories with animation
            skillCategories.map((category, index) => (
              <div 
                key={index} 
                className="group relative bg-slate-800/30 backdrop-blur-sm border border-slate-700 p-6 rounded-lg hover:border-green-400 transition-all duration-500 hover:-translate-y-1 hover:shadow-lg hover:shadow-green-400/10 opacity-0 animate-fade-in-up"
                style={{ animationDelay: `${index * 150}ms` }}
              >
                <div className="flex items-center space-x-3 mb-6">
                  <div className="p-2 bg-slate-900/50 rounded-lg group-hover:bg-green-400/10 transition-colors duration-300">
                    {category.icon}
                  </div>
                  <h3 className="text-xl font-semibold text-slate-200">{category.title}</h3>
                </div>
                
                <div className="space-y-4">
                  {category.skills.map((skill, skillIndex) => (
                    <div key={skillIndex} className="skill-item">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-slate-300 font-medium">{skill}</span>
                        <div className="flex space-x-1">
                          {[...Array(5)].map((_, starIndex) => (
                            <div
                              key={starIndex}
                              className={`w-2 h-2 rounded-full transition-colors duration-300 ${
                                starIndex < (skillLevels[skill] || 4)
                                  ? 'bg-green-400'
                                  : 'bg-slate-600'
                              }`}
                            />
                          ))}
                        </div>
                      </div>
                      
                      {/* Skill Progress Bar */}
                      <div className="w-full bg-slate-700 rounded-full h-1.5 overflow-hidden">
                        <div 
                          className="h-full bg-gradient-to-r from-green-400 to-green-500 rounded-full transition-all duration-1000 ease-out"
                          style={{ 
                            width: `${((skillLevels[skill] || 4) / 5) * 100}%`,
                            transitionDelay: `${(index * 150) + (skillIndex * 100)}ms`
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>

                {/* Hover overlay effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-green-400/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-lg pointer-events-none"></div>
              </div>
            ))
          )}
        </div>
        
        <div className="mt-16 text-center">
          <div className="bg-slate-800/30 backdrop-blur-sm border border-slate-700 p-8 rounded-lg max-w-2xl mx-auto hover:border-green-400 transition-all duration-300">
            <h3 className="text-2xl font-bold text-slate-200 mb-4 relative">
              <span className="inline-block w-12 h-0.5 bg-green-400 mr-4 align-middle"></span>
              {t('skills.continuousLearning.title')}
              <span className="inline-block w-12 h-0.5 bg-green-400 ml-4 align-middle"></span>
            </h3>
            <p className="text-slate-400 leading-relaxed">
              {t('skills.continuousLearning.description')}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Skills;