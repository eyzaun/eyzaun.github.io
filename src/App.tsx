import Header from './components/Header';
import Hero from './components/Hero';
import About from './components/About';
import Experience from './components/Experience';
import Projects from './components/Projects';
import Skills from './components/Skills';
import Contact from './components/Contact';
import Footer from './components/Footer';
import { LanguageProvider } from './contexts/LanguageContext';

function App() {
  return (
    <LanguageProvider>
      <div className="min-h-screen bg-slate-900">
        <Header />
        
        <main>
          {/* Hero section - Full width */}
          <Hero />
          
          {/* Other sections - Consistent padding */}
          <div className="bg-slate-900">
            <About />
            <Experience />
            <Projects />
            <Skills />
            <Contact />
          </div>
        </main>
        
        <Footer />
      </div>
    </LanguageProvider>
  );
}

export default App;