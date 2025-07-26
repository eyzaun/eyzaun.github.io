import React, { useEffect } from 'react';
import { useLanguage } from '../contexts/LanguageContext';

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string;
  image?: string;
  url?: string;
  type?: string;
}

const SEO: React.FC<SEOProps> = ({
  title = "Eyüp Zafer Ünal - Software Developer",
  description = "Computer Engineering graduate from Hacettepe University. Experienced in software development, AI/ML, and full-stack development. Passionate about creating innovative solutions.",
  keywords = "software developer, computer engineering, AI, ML, React, Node.js, Python, portfolio, web development, Hacettepe University",
  image = "/og-image.jpg",
  url = "https://eyzaun.github.io",
  type = "website"
}) => {
  const { language } = useLanguage();

  const seoData = {
    tr: {
      title: "Eyüp Zafer Ünal - Yazılım Geliştirici",
      description: "Hacettepe Üniversitesi Bilgisayar Mühendisliği mezunu. Yazılım geliştirme, AI/ML ve full-stack development alanlarında deneyimli. İnovatif çözümler üretme konusunda tutkulu.",
      keywords: "yazılım geliştirici, bilgisayar mühendisliği, AI, ML, React, Node.js, Python, portfolio, web geliştirme, Hacettepe Üniversitesi"
    },
    en: {
      title,
      description,
      keywords
    }
  };

  const currentSeo = seoData[language];

  useEffect(() => {
    // Update document title
    document.title = currentSeo.title;

    // Update meta description
    updateMetaTag('description', currentSeo.description);
    updateMetaTag('keywords', currentSeo.keywords);

    // Update Open Graph tags
    updateMetaProperty('og:title', currentSeo.title);
    updateMetaProperty('og:description', currentSeo.description);
    updateMetaProperty('og:image', image);
    updateMetaProperty('og:url', url);
    updateMetaProperty('og:type', type);
    updateMetaProperty('og:locale', language === 'tr' ? 'tr_TR' : 'en_US');

    // Update Twitter Card tags
    updateMetaName('twitter:card', 'summary_large_image');
    updateMetaName('twitter:title', currentSeo.title);
    updateMetaName('twitter:description', currentSeo.description);
    updateMetaName('twitter:image', image);

    // Update language and canonical
    updateMetaProperty('canonical', url);
    document.documentElement.lang = language;

    // Update schema.org structured data
    updateStructuredData(currentSeo);

  }, [language, currentSeo.title, currentSeo.description, currentSeo.keywords, image, url, type]);

  const updateMetaTag = (name: string, content: string) => {
    let element = document.querySelector(`meta[name="${name}"]`) as HTMLMetaElement;
    if (!element) {
      element = document.createElement('meta');
      element.name = name;
      document.head.appendChild(element);
    }
    element.content = content;
  };

  const updateMetaProperty = (property: string, content: string) => {
    let element = document.querySelector(`meta[property="${property}"]`) as HTMLMetaElement;
    if (!element) {
      element = document.createElement('meta');
      element.setAttribute('property', property);
      document.head.appendChild(element);
    }
    element.content = content;
  };

  const updateMetaName = (name: string, content: string) => {
    let element = document.querySelector(`meta[name="${name}"]`) as HTMLMetaElement;
    if (!element) {
      element = document.createElement('meta');
      element.name = name;
      document.head.appendChild(element);
    }
    element.content = content;
  };

  const updateStructuredData = (seo: typeof currentSeo) => {
    const structuredData = {
      "@context": "https://schema.org",
      "@type": "Person",
      "name": "Eyüp Zafer Ünal",
      "url": url,
      "image": image,
      "description": seo.description,
      "jobTitle": language === 'tr' ? "Yazılım Geliştirici" : "Software Developer",
      "worksFor": {
        "@type": "Organization",
        "name": "Freelance"
      },
      "alumniOf": {
        "@type": "EducationalOrganization",
        "name": "Hacettepe University",
        "department": "Computer Engineering"
      },
      "knowsAbout": [
        "Software Development",
        "Artificial Intelligence",
        "Machine Learning",
        "React",
        "Node.js",
        "Python",
        "Full Stack Development"
      ],
      "sameAs": [
        "https://github.com/eyzaun",
        "https://linkedin.com/in/eyzaun"
      ]
    };

    let script = document.querySelector('script[type="application/ld+json"]') as HTMLScriptElement;
    if (!script) {
      script = document.createElement('script');
      script.type = 'application/ld+json';
      document.head.appendChild(script);
    }
    script.textContent = JSON.stringify(structuredData);
  };

  return null; // This component doesn't render anything
};

export default SEO;