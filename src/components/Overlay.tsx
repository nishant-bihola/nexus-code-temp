import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence, useScroll, useTransform } from 'motion/react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

function LogoShape({ isHolding }: { isHolding: boolean }) {
  const meshRef = useRef<THREE.Mesh>(null);
  useFrame((state, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += delta * (isHolding ? 3 : 1);
      meshRef.current.rotation.x += delta * (isHolding ? 2 : 0.5);
    }
  });
  return (
    <mesh ref={meshRef}>
      {isHolding ? <icosahedronGeometry args={[1.2, 0]} /> : <octahedronGeometry args={[1, 0]} />}
      <meshBasicMaterial color={isHolding ? "#ff3366" : "#ffffff"} wireframe={!isHolding} />
    </mesh>
  );
}

interface OverlayProps {
  isHolding: boolean;
  onHoldStart: () => void;
  onHoldEnd: () => void;
}

type Section = 'home' | 'projects' | 'about' | 'contact';

export default function Overlay({ isHolding, onHoldStart, onHoldEnd }: OverlayProps) {
  const [activeSection, setActiveSection] = useState<Section>('home');
  const [clickedProject, setClickedProject] = useState<string | null>(null);
  const [isMorphing, setIsMorphing] = useState(false);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const projectsSectionRef = useRef<HTMLDivElement>(null);
  const servicesSectionRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    container: scrollContainerRef,
  });

  useEffect(() => {
    const unsubscribe = scrollYProgress.on('change', (latest) => {
      if (latest < 0.2) setActiveSection('home');
      else if (latest < 0.5) setActiveSection('about');
      else if (latest < 0.8) setActiveSection('projects');
      else setActiveSection('contact');
    });
    return () => unsubscribe();
  }, [scrollYProgress]);

  const scrollToProjects = () => {
    projectsSectionRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const scrollToSection = (section: Section) => {
    if (section === 'home') {
      scrollContainerRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (section === 'projects') {
      scrollToProjects();
    } else if (section === 'about') {
      servicesSectionRef.current?.scrollIntoView({ behavior: 'smooth' });
    } else if (section === 'contact') {
      setActiveSection('contact');
      // Scroll to bottom
      scrollContainerRef.current?.scrollTo({ top: scrollContainerRef.current.scrollHeight, behavior: 'smooth' });
    }
  };

  const handleProjectClick = (title: string) => {
    setClickedProject(title);
    setTimeout(() => setClickedProject(null), 800);
  };

  const handleStartProject = () => {
    setIsMorphing(true);
    setTimeout(() => {
      window.open("https://www.linkedin.com/in/nishantsinh-bihola-8bb500321", "_blank");
      scrollToSection('home');
      setTimeout(() => {
        setIsMorphing(false);
      }, 500);
    }, 1000);
  };

  const renderContent = () => {
    switch (activeSection) {
      case 'projects':
        return (
          <motion.div
            key="projects"
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -40 }}
            className="flex flex-col items-start text-left max-w-md"
          >
            <div className="mb-12">
              <span className={`text-[10px] uppercase tracking-[0.5em] text-[#ff3366] block mb-2 transition-all duration-700 ${isHolding ? 'font-mono' : ''}`}>Portfolio</span>
              <h2 className={`text-5xl md:text-6xl text-white leading-tight transition-all duration-700 ${isHolding ? 'font-display font-bold uppercase tracking-tighter' : 'font-serif italic'}`}>Selected <br />Works</h2>
            </div>
            <div className="flex flex-col gap-6 w-full">
              {[
                { name: 'Next.js Multi-Page App', year: '2024', type: 'Full Stack', num: '01' },
                { name: 'Weather App', year: '2024', type: 'API Integration', num: '02' },
                { name: 'CIFAR-100 Classifier', year: '2023', type: 'Machine Learning', num: '03' },
                { name: 'Clustering Models', year: '2023', type: 'Data Science', num: '04' }
              ].map((project) => (
                <div 
                  key={project.name} 
                  onClick={scrollToProjects}
                  className="group cursor-pointer border-b border-white/5 pb-6 hover:border-white/20 transition-all duration-500 flex items-center gap-6"
                >
                  <span className="text-[10px] font-mono text-white/20 group-hover:text-[#ff3366] transition-colors">{project.num}</span>
                  <div className="flex-1 flex justify-between items-center">
                    <span className="text-2xl md:text-3xl font-light text-white/60 group-hover:text-white group-hover:translate-x-2 transition-all duration-500">{project.name}</span>
                    <div className="flex flex-col items-end opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                      <span className="text-[8px] uppercase tracking-widest text-[#ff3366]">{project.type}</span>
                      <span className="text-[8px] uppercase tracking-widest text-white/30">{project.year}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        );
      case 'about':
        return (
          <motion.div
            key="about"
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -40 }}
            className="max-w-md text-left"
          >
            <h2 className={`text-5xl text-white mb-8 transition-all duration-700 ${isHolding ? 'font-display font-bold uppercase tracking-tighter' : 'font-serif italic'}`}>The Developer</h2>
            <div className="space-y-6">
              <p className={`text-white/70 text-base leading-relaxed tracking-wide transition-all duration-700 ${isHolding ? 'font-mono text-sm' : 'font-light'}`}>
                Nishant Bihola is a Full Stack Developer specializing in React, Next.js, Node.js, and Python with applied experience in machine learning and AI development.
              </p>
              <p className={`text-white/50 text-sm leading-relaxed tracking-wide transition-all duration-700 ${isHolding ? 'font-mono text-xs' : 'font-light'}`}>
                Strong background in building scalable web applications, RESTful APIs, and database systems. Proven ability to deliver production-ready solutions.
              </p>
            </div>
            <div className="mt-12 grid grid-cols-2 gap-8">
              <div>
                <span className="text-[9px] uppercase tracking-[0.3em] text-white/30 block mb-2">Skills</span>
                <ul className={`text-[11px] text-white/60 space-y-1 uppercase tracking-wider transition-all duration-700 ${isHolding ? 'font-mono' : ''}`}>
                  <li>React & Next.js</li>
                  <li>Node.js & Python</li>
                  <li>Machine Learning</li>
                  <li>SQL & NoSQL</li>
                </ul>
              </div>
              <div>
                <span className="text-[9px] uppercase tracking-[0.3em] text-white/30 block mb-2">Location</span>
                <p className={`text-[11px] text-white/60 uppercase tracking-wider transition-all duration-700 ${isHolding ? 'font-mono' : ''}`}>Edmonton, AB</p>
              </div>
            </div>
          </motion.div>
        );
      case 'contact':
        return (
          <motion.div
            key="contact"
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -40 }}
            className="flex flex-col items-start text-left"
          >
            <h2 className={`text-5xl text-white mb-8 transition-all duration-700 ${isHolding ? 'font-display font-bold uppercase tracking-tighter' : 'font-serif italic'}`}>Get in <br />Touch</h2>
            <div className="flex flex-col gap-8">
              <div className="group cursor-pointer">
                <span className="text-[9px] uppercase tracking-[0.3em] text-white/30 block mb-2">Email</span>
                <a href="mailto:Biholanishant0@gmail.com" className={`text-2xl md:text-3xl font-light text-white/80 group-hover:text-white transition-all duration-700 border-b border-white/20 pb-1 pointer-events-auto ${isHolding ? 'font-mono tracking-tight' : ''}`}>Biholanishant0@gmail.com</a>
              </div>
              <div className="flex gap-12">
                <div className="group cursor-pointer pointer-events-auto">
                  <span className="text-[9px] uppercase tracking-[0.3em] text-white/30 block mb-2">Connect</span>
                  <a 
                    href="https://www.linkedin.com/in/nishantsinh-bihola-8bb500321" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className={`text-sm text-white/60 group-hover:text-white transition-all duration-700 uppercase tracking-widest ${isHolding ? 'font-mono' : ''}`}
                  >
                    LinkedIn
                  </a>
                </div>
                <div className="group cursor-pointer pointer-events-auto">
                  <span className="text-[9px] uppercase tracking-[0.3em] text-white/30 block mb-2">Phone</span>
                  <a 
                    href="tel:825977460" 
                    className={`text-sm text-white/60 group-hover:text-white transition-all duration-700 uppercase tracking-widest ${isHolding ? 'font-mono' : ''}`}
                  >
                    825-977-460
                  </a>
                </div>
              </div>
            </div>
          </motion.div>
        );
      default:
        return (
          <motion.div
            key="home"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="text-center"
          >
            <h2 className={`text-5xl md:text-7xl text-white mb-4 leading-tight transition-all duration-700 ${isHolding ? 'font-display font-bold uppercase tracking-tighter' : 'font-serif italic'}`}>
              Nishant <br />
              Bihola
            </h2>
            <p className={`text-white/40 text-sm tracking-widest uppercase transition-all duration-700 ${isHolding ? 'font-mono' : ''}`}>Full Stack Developer • AI Specialist</p>
          </motion.div>
        );
    }
  };

  return (
    <div 
      ref={scrollContainerRef}
      id="main-scroll-container"
      className="relative z-10 w-full h-screen overflow-y-auto overflow-x-hidden snap-y snap-mandatory scroll-smooth"
    >
      {/* Hero Section */}
      <section className="relative w-full h-screen flex flex-col justify-between p-8 md:p-12 snap-start select-none">
        {/* Header */}
        <header className="flex justify-between items-start pointer-events-auto">
          <div className="flex items-center cursor-pointer group" onClick={() => scrollToSection('home')}>
            <div className="w-10 h-10 mr-3">
              <Canvas camera={{ position: [0, 0, 3] }}>
                <LogoShape isHolding={isHolding} />
              </Canvas>
            </div>
            <div className="flex flex-col">
              <span className={`text-[10px] uppercase tracking-[0.3em] text-white/50 mb-1 transition-all duration-700 ${isHolding ? 'font-mono text-[#ff3366]' : ''}`}>Studio</span>
              <h1 className={`text-xl md:text-2xl font-light tracking-tighter text-white transition-all duration-700 ${isHolding ? 'font-display font-bold tracking-widest' : ''}`}>Nexus_dev.co</h1>
            </div>
          </div>
          
          <nav className="flex gap-8 md:gap-12">
            {(['projects', 'about', 'contact'] as Section[]).map((item) => (
              <button 
                key={item} 
                onClick={() => scrollToSection(item)}
                className={`text-[11px] uppercase tracking-[0.2em] transition-colors cursor-pointer relative ${activeSection === item ? 'text-white' : 'text-white/50 hover:text-white'}`}
              >
                {item}
                {activeSection === item && (
                  <motion.div layoutId="nav-underline" className="absolute -bottom-1 left-0 right-0 h-[1px] bg-white" />
                )}
              </button>
            ))}
          </nav>
        </header>

        {/* Main Content Area */}
        <div className="flex-1 flex items-center px-4 md:px-0">
          <div className="w-full grid grid-cols-1 md:grid-cols-12 gap-8">
            {/* Left Side Content (Sections) */}
            <div className="md:col-span-5 flex items-center pointer-events-auto pt-20 md:pt-0">
              <AnimatePresence mode="wait">
                {!isHolding && activeSection !== 'home' && renderContent()}
              </AnimatePresence>
            </div>

            {/* Center/Right Side (Sphere Area) */}
            <div className="md:col-span-7 flex items-center justify-center relative min-h-[40vh] md:min-h-0">
              <AnimatePresence mode="wait">
                {isHolding ? (
                  <motion.div
                    key="holding"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 1.1 }}
                    className="flex flex-col items-center z-20"
                  >
                    <h3 className={`text-4xl md:text-5xl text-white mb-2 transition-all duration-700 ${isHolding ? 'font-display font-bold uppercase tracking-tighter' : 'font-serif italic'}`}>Evolution</h3>
                    <p className={`text-[#ff3366] text-[9px] md:text-[10px] tracking-[0.8em] uppercase animate-pulse transition-all duration-700 ${isHolding ? 'font-mono' : ''}`}>Neural Link Established</p>
                  </motion.div>
                ) : activeSection === 'home' && (
                  <div className="pointer-events-auto">
                    {renderContent()}
                  </div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="flex flex-col items-center gap-6">
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1, duration: 1 }}
            className="absolute bottom-32 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 pointer-events-none"
          >
            <span className="text-[8px] uppercase tracking-[0.4em] text-white/20">Scroll</span>
            <div className="w-px h-8 bg-gradient-to-b from-white/20 to-transparent" />
          </motion.div>

          <div 
            className="pointer-events-auto cursor-pointer group flex flex-col items-center"
            onMouseDown={onHoldStart}
            onMouseUp={onHoldEnd}
            onMouseLeave={onHoldEnd}
            onTouchStart={onHoldStart}
            onTouchEnd={onHoldEnd}
          >
            <div className="relative w-16 h-16 flex items-center justify-center mb-4">
              <motion.div 
                className="absolute inset-0 border border-white/10 rounded-full"
                animate={{ 
                  scale: isHolding ? 1.8 : 1, 
                  opacity: isHolding ? 0 : 1,
                  borderColor: isHolding ? '#ff3366' : 'rgba(255,255,255,0.1)'
                }}
                transition={{ duration: 0.5 }}
              />
              <motion.div 
                className="absolute inset-0 border border-[#ff3366]/30 rounded-full"
                initial={{ scale: 0, opacity: 0 }}
                animate={{ 
                  scale: isHolding ? 1.2 : 0, 
                  opacity: isHolding ? 1 : 0 
                }}
                transition={{ type: 'spring', damping: 15 }}
              />
              <motion.div 
                className="w-3 h-3 bg-white rounded-full shadow-[0_0_15px_rgba(255,255,255,0.5)]"
                animate={{ 
                  scale: isHolding ? 3.5 : 1, 
                  backgroundColor: isHolding ? '#ff3366' : '#ffffff',
                  boxShadow: isHolding ? '0 0 30px rgba(255,51,102,0.8)' : '0 0 15px rgba(255,255,255,0.5)'
                }}
              />
            </div>
            <motion.span 
              className="text-[10px] uppercase tracking-[0.6em] text-white/40 group-hover:text-white transition-all duration-500"
              animate={{
                color: isHolding ? '#ff3366' : 'rgba(255,255,255,0.4)',
                letterSpacing: isHolding ? '0.8em' : '0.6em'
              }}
            >
              {isHolding ? 'Evolving...' : 'Click & Hold'}
            </motion.span>
          </div>

          <div className="w-full flex justify-between items-end">
            <div className="text-[10px] text-white/20 uppercase tracking-[0.3em]">
              © 2026 Nexus Code • Edmonton
            </div>
            <div className="flex gap-8 text-[10px] text-white/20 uppercase tracking-[0.3em]">
              <a href="https://www.linkedin.com/in/nishantsinh-bihola-8bb500321" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors cursor-pointer pointer-events-auto">LinkedIn</a>
            </div>
          </div>
        </footer>
      </section>

      {/* Services Section */}
      <section 
        ref={servicesSectionRef}
        className="relative w-full min-h-[60vh] bg-black p-8 md:p-24 snap-start z-20 border-t border-white/5"
      >
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-16 md:gap-24">
            {[
              { title: 'UI/UX Design', desc: 'Crafting intuitive interfaces that prioritize user flow and emotional connection.' },
              { title: 'Brand Identity', desc: 'Building cohesive visual systems that tell a compelling story across all touchpoints.' },
              { title: '3D Interaction', desc: 'Pushing the boundaries of the web with immersive WebGL and spatial experiences.' }
            ].map((service, i) => (
              <motion.div 
                key={service.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.2 }}
                className="flex flex-col gap-6"
              >
                <span className="text-[10px] text-[#ff3366] font-mono">0{i + 1}</span>
                <h3 className="text-3xl font-serif italic text-white">{service.title}</h3>
                <p className="text-white/40 text-sm leading-relaxed">{service.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Projects Showcase Section */}
      <section 
        ref={projectsSectionRef}
        className="relative w-full min-h-screen bg-black p-8 md:p-24 snap-start z-20"
      >
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-end mb-24 gap-8">
            <div className="max-w-2xl">
              <span className="text-[10px] uppercase tracking-[0.5em] text-[#ff3366] block mb-4">Portfolio</span>
              <h2 className="text-6xl md:text-8xl font-serif italic text-white leading-tight">
                Digital <br />Craftsmanship
              </h2>
            </div>
            <p className="text-white/40 text-sm max-w-xs leading-relaxed tracking-wide">
              A collection of UI/UX projects where functionality meets aesthetic perfection. Each pixel is intentional.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-32">
            {[
              { 
                title: 'Next.js Multi-Page App', 
                category: 'Full Stack Development', 
                img: 'https://picsum.photos/seed/code/800/1000',
                desc: 'Implemented dynamic routing, form validation, and optimized rendering strategies.'
              },
              { 
                title: 'Weather App', 
                category: 'API Integration', 
                img: 'https://picsum.photos/seed/weather/800/1000',
                desc: 'Built a real-time weather comparison tool with API integration and caching.'
              },
              { 
                title: 'CIFAR-100 Classifier', 
                category: 'Machine Learning / CNN', 
                img: 'https://picsum.photos/seed/ai/800/1000',
                desc: 'Developed a Convolutional Neural Network using TensorFlow/Keras with performance tuning.'
              },
              { 
                title: 'Clustering Models', 
                category: 'Data Science', 
                img: 'https://picsum.photos/seed/data/800/1000',
                desc: 'Applied K-Means, DBSCAN, ANN, and KNN for structured data analysis and predictive modeling.'
              },
              { 
                title: 'Movie Recommendation', 
                category: 'AI / Streamlit', 
                img: 'https://picsum.photos/seed/movie/800/1000',
                desc: 'Built a collaborative filtering engine deployed with Streamlit for personalized movie suggestions.'
              },
              { 
                title: 'Webflow CMS', 
                category: 'Web Development', 
                img: 'https://picsum.photos/seed/design/800/1000',
                desc: 'Developed responsive CMS-based websites, improved SEO performance, and optimized UI/UX.'
              }
            ].map((project, i) => (
              <motion.div 
                key={project.title}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: i * 0.1 }}
                className={`flex flex-col ${i % 2 === 1 ? 'md:mt-32' : ''}`}
              >
                <motion.div 
                  className="relative aspect-[4/5] overflow-hidden group cursor-pointer mb-8 rounded-lg"
                  onClick={() => handleProjectClick(project.title)}
                  animate={clickedProject === project.title ? { scale: 0.95, rotate: -2 } : { scale: 1, rotate: 0 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 15 }}
                >
                  <img 
                    src={project.img} 
                    alt={project.title}
                    className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700 scale-105 group-hover:scale-110"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-black/40 group-hover:bg-transparent transition-colors duration-500" />
                </motion.div>
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className={`text-3xl mb-2 transition-all duration-700 ${isHolding ? 'font-display font-bold uppercase tracking-tighter text-white' : 'font-serif italic text-white'}`}>{project.title}</h3>
                    <p className={`text-xs uppercase tracking-widest transition-all duration-700 ${isHolding ? 'font-mono text-[#ff3366]' : 'text-white/40'}`}>{project.category}</p>
                  </div>
                  <p className={`text-[11px] max-w-[180px] text-right leading-relaxed transition-all duration-700 ${isHolding ? 'font-mono text-white/50' : 'text-white/30'}`}>
                    {project.desc}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="mt-48 text-center">
            <button 
              onClick={handleStartProject}
              className="group relative inline-flex flex-col items-center"
            >
              <span className="text-[10px] uppercase tracking-[0.5em] text-white/40 mb-4 group-hover:text-white transition-colors">Start a Project</span>
              <div className="w-px h-24 bg-gradient-to-b from-white/20 to-transparent" />
            </button>
          </div>
        </div>
      </section>

      {/* Overlays (Fixed) */}
      <div className="fixed inset-0 pointer-events-none opacity-[0.04] bg-[url('https://grainy-gradients.vercel.app/noise.svg')] mix-blend-overlay z-50" />
      
      <AnimatePresence>
        {isHolding && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 pointer-events-none z-10 bg-gradient-to-t from-[#ff3366]/10 via-transparent to-[#ff3366]/5"
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isMorphing && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, borderRadius: '100%' }}
            animate={{ opacity: 1, scale: 1.5, borderRadius: '0%' }}
            exit={{ opacity: 0, scale: 0.8, borderRadius: '100%' }}
            transition={{ duration: 1, ease: "easeInOut" }}
            className="fixed inset-0 z-[100] bg-black flex items-center justify-center pointer-events-auto"
          >
            <motion.div 
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
              className="w-16 h-16 border-t-2 border-[#ff3366] rounded-full"
            />
          </motion.div>
        )}
      </AnimatePresence>
      
      <div className="fixed inset-0 pointer-events-none z-[-2] bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.5)_100%)]" />
    </div>
  );
}
