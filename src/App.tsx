import React, { Suspense, lazy } from 'react';
import { LanguageProvider } from './contexts/LanguageContext';
import SEO from './components/SEO';
import LoadingSpinner from './components/LoadingSpinner';
import { SkeletonCard } from './components/SkeletonLoader';
import CustomCursor from './components/CustomCursor';
import { useCursor } from './hooks/useCursor';

// Lazy load components for better performance
const Header = lazy(() => import('./components/Header'));
const Hero = lazy(() => import('./components/Hero'));
const About = lazy(() => import('./components/About'));
const Experience = lazy(() => import('./components/Experience'));
const Projects = lazy(() => import('./components/Projects'));
const Skills = lazy(() => import('./components/Skills'));
const Contact = lazy(() => import('./components/Contact'));
const Footer = lazy(() => import('./components/Footer'));

// Global AnimatedBackground - covers entire site
const AnimatedBackground = lazy(() => import('./components/AnimatedBackground'));

// Loading fallback components
const SectionSkeleton: React.FC = () => (
  <div className="py-16 px-6 md:px-12 lg:px-24 xl:px-32">
    <div className="max-w-6xl mx-auto">
      <div className="h-8 bg-slate-700 rounded-md w-64 mb-12 animate-pulse"></div>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 3 }, (_, i) => (
          <SkeletonCard key={i} />
        ))}
      </div>
    </div>
  </div>
);

const LoadingFallback: React.FC = () => (
  <div className="min-h-screen bg-slate-900 flex items-center justify-center">
    <div className="text-center">
      <LoadingSpinner size="lg" />
      <p className="text-slate-400 mt-4">Loading...</p>
    </div>
  </div>
);

// Main App Component with Global Background
const AppContent: React.FC = () => {
  const { cursor, isActive } = useCursor();

  return (
    <div className="min-h-screen bg-slate-900 relative">
      {/* SEO Component */}
      <SEO />
      
      {/* Custom Cursor - Highest layer */}
      <CustomCursor />
      
      {/* Global Three.js Background with Letters - Covers entire site */}
      {isActive && (
        <Suspense fallback={null}>
          <AnimatedBackground
            mouseX={cursor.x}
            mouseY={cursor.y}
            isActive={isActive}
          />
        </Suspense>
      )}
      
      {/* Header - Always visible */}
      <Suspense fallback={
        <div className="h-16 md:h-20 bg-slate-900/95 backdrop-blur-md border-b border-slate-700/50 fixed top-0 left-0 right-0 z-50"></div>
      }>
        <Header />
      </Suspense>
      
      <main className="relative z-10">
        {/* Hero section */}
        <Suspense fallback={<LoadingFallback />}>
          <Hero />
        </Suspense>
        
        {/* Other sections with transparent background to show letters */}
        <div className="bg-slate-900/30 backdrop-blur-sm relative z-10">
          <Suspense fallback={<SectionSkeleton />}>
            <About />
          </Suspense>
          
          <Suspense fallback={<SectionSkeleton />}>
            <Experience />
          </Suspense>
          
          <Suspense fallback={<SectionSkeleton />}>
            <Projects />
          </Suspense>
          
          <Suspense fallback={<SectionSkeleton />}>
            <Skills />
          </Suspense>
          
          <Suspense fallback={<SectionSkeleton />}>
            <Contact />
          </Suspense>
        </div>
      </main>
      
      {/* Footer */}
      <Suspense fallback={
        <div className="h-32 bg-slate-900/50 animate-pulse relative z-10"></div>
      }>
        <Footer />
      </Suspense>
    </div>
  );
};

function App() {
  return (
    <LanguageProvider>
      <AppContent />
    </LanguageProvider>
  );
}

export default App;