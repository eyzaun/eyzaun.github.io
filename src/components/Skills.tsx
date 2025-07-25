import React from 'react';
import { Code, Database, Globe, Wrench, Brain } from 'lucide-react';
import { skills } from '../data/portfolio';
import { useLanguage } from '../contexts/LanguageContext';

const Skills: React.FC = () => {
  const { t } = useLanguage();
  
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
      icon: <Code className="text-green-300" size={24} />,
      skills: skills["Languages & Frameworks"]
    },
    {
      title: t('skills.categories.frontend'),
      icon: <Globe className="text-green-300" size={24} />,
      skills: skills["Frontend"]
    },
    {
      title: t('skills.categories.backend'),
      icon: <Database className="text-green-300" size={24} />,
      skills: skills["Backend"]
    },
    {
      title: t('skills.categories.aiMl'),
      icon: <Brain className="text-green-300" size={24} />,
      skills: skills["AI/ML"]
    },
    {
      title: t('skills.categories.databases'),
      icon: <Database className="text-green-300" size={24} />,
      skills: skills["Databases"]
    },
    {
      title: t('skills.categories.tools'),
      icon: <Wrench className="text-green-300" size={24} />,
      skills: skills["Tools & Technologies"]
    }
  ];

  return (
    <section id="skills" className="section">
      <div className="container">
        <h2 className="section-title">{t('skills.title')}</h2>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {skillCategories.map((category, index) => (
            <div 
              key={index} 
              className="group relative bg-light-navy p-6 rounded-lg border border-slate hover:border-green-300 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-navy/20"
            >
              <div className="flex items-center space-x-3 mb-6">
                <div className="p-2 bg-navy rounded-lg group-hover:bg-green-300/10 transition-colors duration-300">
                  {category.icon}
                </div>
                <h3 className="text-xl font-semibold text-lightest-slate">{category.title}</h3>
              </div>
              
              <div className="space-y-4">
                {category.skills.map((skill, skillIndex) => (
                  <div key={skillIndex} className="skill-item">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-slate font-medium">{skill}</span>
                      <div className="flex space-x-1">
                        {[...Array(5)].map((_, starIndex) => (
                          <div
                            key={starIndex}
                            className={`w-2 h-2 rounded-full transition-colors duration-300 ${
                              starIndex < (skillLevels[skill] || 4)
                                ? 'bg-green-300'
                                : 'bg-slate-600'
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                    <div className="skill-bar">
                      <div 
                        className="skill-progress"
                        style={{ width: `${((skillLevels[skill] || 4) / 5) * 100}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-16 text-center">
          <div className="bg-light-navy/50 p-8 rounded-lg border border-slate max-w-2xl mx-auto backdrop-blur-sm">
            <h3 className="text-2xl font-bold text-lightest-slate mb-4 relative">
              <span className="inline-block w-12 h-0.5 bg-green-300 mr-4 align-middle"></span>
              {t('skills.continuousLearning.title')}
              <span className="inline-block w-12 h-0.5 bg-green-300 ml-4 align-middle"></span>
            </h3>
            <p className="text-slate leading-relaxed">
              {t('skills.continuousLearning.description')}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Skills;
