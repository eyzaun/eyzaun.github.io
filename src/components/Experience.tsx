import { Briefcase, Calendar } from 'lucide-react';
import { experiences } from '../data/portfolio';

const Experience = () => {
  return (
    <section id="experience" className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <h2 className="section-title">Deneyim</h2>
        
        <div className="max-w-4xl mx-auto">
          <div className="space-y-8">
            {experiences.map((exp, index) => (
              <div key={index} className="card">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
                  <div className="flex items-center space-x-3 mb-2 md:mb-0">
                    <Briefcase className="text-blue-600" size={20} />
                    <h3 className="text-xl font-semibold text-gray-900">{exp.position}</h3>
                  </div>
                  <div className="flex items-center space-x-2 text-gray-600">
                    <Calendar size={16} />
                    <span className="text-sm">{exp.duration}</span>
                  </div>
                </div>
                
                <h4 className="text-lg font-medium text-blue-600 mb-4">{exp.company}</h4>
                
                <div className="space-y-3 mb-6">
                  {exp.description.map((desc, descIndex) => (
                    <div key={descIndex} className="flex items-start space-x-2">
                      <span className="text-blue-600 mt-1">•</span>
                      <p className="text-gray-700">{desc}</p>
                    </div>
                  ))}
                </div>
                
                <div className="flex flex-wrap gap-2">
                  {exp.technologies.map((tech, techIndex) => (
                    <span
                      key={techIndex}
                      className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Experience;
