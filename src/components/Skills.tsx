import { Code, Database, Globe, Wrench, Brain } from 'lucide-react';
import { skills } from '../data/portfolio';
import { useLanguage } from '../contexts/LanguageContext';

const Skills = () => {
  const { t } = useLanguage();
  
  // Sabit skill seviyeleri (her skill için 1-5 arası seviye)
  const skillLevels: { [key: string]: number } = {
    // Languages & Frameworks
    "Python": 5,
    "Java": 4,
    "C++": 4,
    "JavaScript": 5,
    "TypeScript": 5,
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
      icon: <Code className="text-blue-600" size={24} />,
      skills: skills["Languages & Frameworks"]
    },
    {
      title: t('skills.categories.frontend'),
      icon: <Globe className="text-green-600" size={24} />,
      skills: skills["Frontend"]
    },
    {
      title: t('skills.categories.backend'),
      icon: <Database className="text-purple-600" size={24} />,
      skills: skills["Backend"]
    },
    {
      title: t('skills.categories.aiMl'),
      icon: <Brain className="text-pink-600" size={24} />,
      skills: skills["AI/ML"]
    },
    {
      title: t('skills.categories.databases'),
      icon: <Database className="text-orange-600" size={24} />,
      skills: skills["Databases"]
    },
    {
      title: t('skills.categories.tools'),
      icon: <Wrench className="text-red-600" size={24} />,
      skills: skills["Tools & Technologies"]
    }
  ];

  return (
    <section id="skills" className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <h2 className="section-title">{t('skills.title')}</h2>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {skillCategories.map((category, index) => (
            <div key={index} className="card">
              <div className="flex items-center space-x-3 mb-6">
                {category.icon}
                <h3 className="text-xl font-semibold text-gray-900">{category.title}</h3>
              </div>
              
              <div className="space-y-3">
                {category.skills.map((skill, skillIndex) => (
                  <div key={skillIndex} className="flex items-center justify-between">
                    <span className="text-gray-700 font-medium">{skill}</span>
                    <div className="flex space-x-1">
                      {[...Array(5)].map((_, starIndex) => (
                        <div
                          key={starIndex}
                          className={`w-2 h-2 rounded-full ${
                            starIndex < (skillLevels[skill] || 4) // Sabit skill seviyesi kullan
                              ? 'bg-blue-600'
                              : 'bg-gray-300'
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-16 text-center">
          <div className="bg-white p-8 rounded-lg shadow-lg max-w-2xl mx-auto">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">{t('skills.continuousLearning.title')}</h3>
            <p className="text-gray-700 leading-relaxed">
              {t('skills.continuousLearning.description')}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Skills;
