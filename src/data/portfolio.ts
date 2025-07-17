export interface Experience {
  company: string;
  position: string;
  duration: string;
  description: string[];
  technologies: string[];
}

export interface Project {
  name: string;
  description: string;
  technologies: string[];
  link?: string;
  github?: string;
  features: string[];
}

export interface Education {
  institution: string;
  degree: string;
  year?: string;
}

export interface Certification {
  name: string;
  issuer: string;
  description: string;
}

export const personalInfo = {
  name: "Eyüp Zafer Ünal",
  title: "Software Engineering Student",
  email: "eyzaun@gmail.com",
  phone: "+905426999881",
  location: "Ankara, Turkey",
  about: "Computer Engineering student at Hacettepe University with expertise in software development, AI/ML, and full-stack development. Passionate about creating innovative solutions and working with cutting-edge technologies.",
  github: "https://github.com/eyupzaferunal",
  linkedin: "https://linkedin.com/in/eyupzaferunal"
};

export const experiences: Experience[] = [
  {
    company: "Binary Brain Technology Inc.",
    position: "Software Engineering Intern",
    duration: "01/2025 - 02/2025",
    description: [
      "Led the development of AvukatLLM, an AI-powered legal assistant using Microsoft's Phi-4 model, achieving 85% response accuracy in Turkish tax law consultations",
      "Implemented model quantization techniques reducing memory requirements by 75% while maintaining performance",
      "Architected and enhanced cross-platform mobile and web applications using Flutter with Firebase backend",
      "Created efficient model training pipeline using PyTorch and Transformers for continuous model improvements"
    ],
    technologies: ["Python", "PyTorch", "Transformers", "Flutter", "Firebase", "Microsoft Phi-4", "LLM"]
  },
  {
    company: "TellUS",
    position: "Software Engineering Intern",
    duration: "06/2024 - 08/2024",
    description: [
      "Implemented OBD2 and CANbus protocols for real-time vehicle data communication",
      "Engineered Arduino-based system architecture with PID control algorithms",
      "Created comprehensive testing procedures achieving 95% system reliability"
    ],
    technologies: ["Arduino", "C++", "CANbus", "OBD2", "PID Control"]
  }
];

export const projects: Project[] = [
  {
    name: "Journey Of Crops",
    description: "An interactive agricultural optimization game featuring resource management and algorithmic solutions.",
    technologies: ["Three.js", "WebGL2", "JavaScript", "Dynamic Programming"],
    features: [
      "Resource optimization using dynamic programming (Knapsack algorithm)",
      "Interactive rail system simulation using Three.js and WebGL2",
      "Animated visualization of algorithmic solutions",
      "Score calculation system based on optimization results"
    ],
    github: "https://github.com/eyupzaferunal/journey-of-crops"
  },
  {
    name: "LinkedHU",
    description: "A university networking platform connecting students and faculty members.",
    technologies: ["Node.js", "Express", "MongoDB", "React", "JWT"],
    features: [
      "Backend functionality with comprehensive testing procedures using agile methodology",
      "User authentication and profile management systems",
      "RESTful APIs for university networking features",
      "Code quality and performance optimization with CI/CD integration"
    ],
    github: "https://github.com/eyupzaferunal/linkedhu"
  },
  {
    name: "AvukatLLM",
    description: "AI-powered legal assistant specializing in Turkish tax law consultations.",
    technologies: ["Python", "PyTorch", "Transformers", "Microsoft Phi-4", "NLP"],
    features: [
      "85% response accuracy in Turkish tax law consultations",
      "Model quantization for 75% memory reduction",
      "Continuous model improvement pipeline",
      "Multi-language support with Turkish focus"
    ]
  }
];

export const education: Education[] = [
  {
    institution: "Hacettepe University",
    degree: "Computer Engineering",
    year: "2021-2025"
  },
  {
    institution: "Eskişehir Fatih Fen Lisesi",
    degree: "Science High School"
  },
  {
    institution: "Emine-Emir Şahbaz BİLSEM",
    degree: "Science and Art Center"
  }
];

export const certifications: Certification[] = [
  {
    name: "Develop an ASP.NET Core web app that consumes an API",
    issuer: "Microsoft Learn",
    description: "Skills in developing ASP.NET Core web applications and consuming APIs, Implementation of HTTP clients and API integration"
  },
  {
    name: "Build distributed apps with .NET Aspire",
    issuer: "Microsoft Learn",
    description: "Utilizing .NET Aspire stack for distributed applications, Microservice architecture and cloud-native application development"
  }
];

export const skills = {
  "Languages & Frameworks": [
    "Python", "Java", "C++", "JavaScript", "TypeScript", "C#"
  ],
  "Frontend": [
    "React", "Flutter", "HTML5", "CSS3", "Tailwind CSS", "Three.js"
  ],
  "Backend": [
    "Node.js", "Express", "ASP.NET Core", ".NET Aspire"
  ],
  "AI/ML": [
    "PyTorch", "Transformers", "LLMs", "NLP", "TensorFlow"
  ],
  "Databases": [
    "MySQL", "PostgreSQL", "MongoDB", "Firebase"
  ],
  "Tools & Technologies": [
    "Git", "Docker", "CI/CD", "Arduino", "CANbus", "OBD2"
  ]
};

export const courses = [
  "Software Architecture",
  "Embedded Systems", 
  "Database Management Systems",
  "Computer Graphics",
  "Game Technologies",
  "Algorithm Design",
  "Data Structures"
];
