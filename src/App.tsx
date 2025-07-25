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
      <div className="min-h-screen">
        <Header />
        <main>
          <Hero />
          <div className="px-6 md:px-12 lg:px-24 xl:px-32">
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
