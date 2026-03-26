import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence, useScroll, useTransform, useInView } from 'motion/react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const holdShapes = [
  <octahedronGeometry key="cone" args={[1, 0]} />,
  <boxGeometry key="box" args={[1, 1, 1]} />,
  <torusGeometry key="torus" args={[0.6, 0.2, 16, 32]} />,
  <icosahedronGeometry key="icosa" args={[1, 0]} />,
  <octahedronGeometry key="octa" args={[1, 0]} />,
  <dodecahedronGeometry key="dodeca" args={[0.8, 0]} />
];
const holdColors = ["#00ffff", "#ff0000", "#ffea00", "#ff3366", "#b026ff", "#ff8800"];

function LogoShape({ isHolding, shapeIndex }: { isHolding: boolean, shapeIndex: number }) {
  const meshRef = useRef<THREE.Mesh>(null);
  useFrame((state, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += delta * (isHolding ? 3 : 1);
      meshRef.current.rotation.x += delta * (isHolding ? 2 : 0.5);
      const targetScale = isHolding ? 1.2 : 1;
      meshRef.current.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), 0.1);
    }
  });
  const currentShape = holdShapes[shapeIndex % holdShapes.length];
  const currentColor = holdColors[shapeIndex % holdColors.length];
  return (
    <mesh ref={meshRef}>
      {currentShape}
      <meshBasicMaterial color={isHolding ? currentColor : "#ffffff"} wireframe={!isHolding} />
    </mesh>
  );
}

interface OverlayProps {
  isHolding: boolean;
  onHoldStart: () => void;
  onHoldEnd: () => void;
  shapeIndex: number;
}

type Section = 'home' | 'projects' | 'about' | 'contact';

export default function Overlay({ isHolding, onHoldStart, onHoldEnd, shapeIndex }: OverlayProps) {
  const [activeSection, setActiveSection] = useState<Section>('home');
  const [clickedProject, setClickedProject] = useState<string | null>(null);
  const [isMorphing, setIsMorphing] = useState(false);
  const [exploringService, setExploringService] = useState<number | null>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const projectsSectionRef = useRef<HTMLDivElement>(null);
  const servicesSectionRef = useRef<HTMLDivElement>(null);
  const dividerRef = useRef<HTMLDivElement>(null);
  const isServicesInView = useInView(servicesSectionRef, { margin: '-20% 0px -20% 0px' });
  const isProjectsInView = useInView(projectsSectionRef, { margin: '-10% 0px -10% 0px' });

  const { scrollYProgress: servicesProgress } = useScroll({
    target: servicesSectionRef,
    container: scrollContainerRef,
    offset: ['start end', 'end start'],
  });
  const { scrollYProgress: projectsProgress } = useScroll({
    target: projectsSectionRef,
    container: scrollContainerRef,
    offset: ['start end', 'end start'],
  });

  const servicesHeaderY = useTransform(servicesProgress, [0, 1], ['8%', '-8%']);
  const projectsHeaderY = useTransform(projectsProgress, [0, 1], ['10%', '-10%']);
  const projectsImgScale = useTransform(projectsProgress, [0, 0.5, 1], [1.08, 1, 1.08]);

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
      case 'about':
        return (
          <motion.div
            key="about"
            initial={{ opacity: 0, x: -20, filter: 'blur(10px)' }}
            animate={{ opacity: 1, x: 0, filter: 'blur(0px)' }}
            exit={{ opacity: 0, x: 20, filter: 'blur(10px)' }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="max-w-xl text-left w-full"
          >
            <h2 className="text-5xl md:text-7xl font-display font-bold tracking-tighter text-white mb-10 leading-none">The <br /><span className="text-white/30 italic font-serif font-light">Vision</span></h2>
            <div className="space-y-8">
              <p className="text-white/80 text-lg md:text-xl leading-relaxed font-sans font-light">
                Nishant Bihola is a <span className="text-white font-medium">Full Stack Developer</span> & <span className="text-[#ff3366] font-medium">AI Specialist</span> bridging the gap between sophisticated algorithms and immersive digital experiences.
              </p>
              <div className="grid grid-cols-2 gap-12 pt-8 border-t border-white/5">
                <div>
                  <span className="text-[10px] uppercase tracking-[0.4em] text-[#ff3366] font-mono block mb-4">Expertise</span>
                  <ul className="text-xs text-white/50 space-y-2 uppercase tracking-widest font-mono">
                    <li className="flex items-center gap-2"><div className="w-1 h-1 bg-[#ff3366] rounded-full" /> React & Next.js</li>
                    <li className="flex items-center gap-2"><div className="w-1 h-1 bg-[#ff3366] rounded-full" /> Neural Networks</li>
                    <li className="flex items-center gap-2"><div className="w-1 h-1 bg-[#ff3366] rounded-full" /> 3D Interaction</li>
                    <li className="flex items-center gap-2"><div className="w-1 h-1 bg-[#ff3366] rounded-full" /> Cloud Arch</li>
                  </ul>
                </div>
                <div>
                  <span className="text-[10px] uppercase tracking-[0.4em] text-white/30 font-mono block mb-4">Genesis</span>
                  <p className="text-xs text-white/50 uppercase tracking-widest font-mono leading-relaxed">Based in Edmonton, AB.<br />Crafting global solutions.</p>
                </div>
              </div>
            </div>
          </motion.div>
        );
      case 'contact':
        return (
          <motion.div
            key="contact"
            initial={{ opacity: 0, x: -20, filter: 'blur(10px)' }}
            animate={{ opacity: 1, x: 0, filter: 'blur(0px)' }}
            exit={{ opacity: 0, x: 20, filter: 'blur(10px)' }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="flex flex-col items-start text-left w-full max-w-xl"
          >
            <h2 className="text-5xl md:text-7xl font-display font-bold tracking-tighter text-white mb-10 leading-none">Start a <br /><span className="text-[#ff3366] italic font-serif font-light">Conversation</span></h2>
            <div className="flex flex-col gap-10 w-full">
              <div className="group cursor-pointer w-full">
                <span className="text-[10px] uppercase tracking-[0.4em] text-white/30 font-mono block mb-3">Direct Neural Link</span>
                <a href="mailto:Biholanishant0@gmail.com" className="text-2xl md:text-4xl font-display font-light text-white/70 group-hover:text-white transition-all duration-700 border-b border-white/10 pb-2 pointer-events-auto block w-fit">Biholanishant0@gmail.com</a>
              </div>
              <div className="flex flex-wrap gap-12">
                <div className="group cursor-pointer pointer-events-auto">
                  <span className="text-[10px] uppercase tracking-[0.4em] text-white/30 font-mono block mb-3">Social</span>
                  <a 
                    href="https://www.linkedin.com/in/nishantsinh-bihola-8bb500321" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-xs text-white/50 group-hover:text-[#ff3366] transition-all duration-500 uppercase tracking-widest font-mono"
                  >
                    LinkedIn ↗
                  </a>
                </div>
                <div className="group cursor-pointer pointer-events-auto">
                  <span className="text-[10px] uppercase tracking-[0.4em] text-white/30 font-mono block mb-3">Voice</span>
                  <a 
                    href="tel:825977460" 
                    className="text-xs text-white/50 group-hover:text-[#ff3366] transition-all duration-500 uppercase tracking-widest font-mono"
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
            initial={{ opacity: 0, scale: 1.1, filter: 'blur(10px)' }}
            animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
            exit={{ opacity: 0, scale: 0.9, filter: 'blur(10px)' }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="text-center w-full"
          >
            <h2 className={`text-4xl sm:text-5xl md:text-7xl lg:text-8xl text-white mb-4 leading-tight transition-all duration-700 ${isHolding ? 'font-display font-bold uppercase tracking-tighter' : 'font-serif italic'}`}>
              Nishant <br />
              Bihola
            </h2>
            <p className={`text-white/40 text-xs sm:text-sm tracking-widest uppercase transition-all duration-700 ${isHolding ? 'font-mono' : ''}`}>Full Stack Developer • AI Specialist</p>
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
      <motion.div
        className="fixed top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-[#ff3366] via-[#b026ff] to-[#00ffff] origin-left z-[100] shadow-[0_0_10px_rgba(255,51,102,0.3)]"
        style={{ scaleX: scrollYProgress }}
      />
      {/* Hero Section */}
      <section className="relative w-full min-h-screen flex flex-col justify-between p-4 sm:p-8 md:p-12 snap-start select-none overflow-hidden">
        {/* Header */}
        <header className="fixed top-0 left-0 right-0 px-6 sm:px-12 py-6 flex flex-col md:flex-row justify-between items-center z-[90] glass-dark border-b border-white/5 backdrop-blur-md">
          <div className="flex items-center cursor-pointer group" onClick={() => scrollToSection('home')}>
            <div className="w-8 h-8 md:w-10 md:h-10 mr-3 overflow-visible">
              <Canvas camera={{ position: [0, 0, 3] }}>
                <LogoShape isHolding={isHolding} shapeIndex={shapeIndex} />
              </Canvas>
            </div>
            <div className="flex flex-col">
              <span className={`text-[8px] md:text-[9px] uppercase tracking-[0.4em] text-[#ff3366] font-mono mb-0.5 transition-all duration-700`}>Nexus Studio</span>
              <h1 className={`text-lg sm:text-xl font-display font-medium tracking-tight text-white transition-all duration-700 ${isHolding ? 'scale-105' : ''}`}>Nexus_dev.co</h1>
            </div>
          </div>
          
          <nav className="flex items-center gap-6 sm:gap-8 md:gap-10 mt-4 md:mt-0">
            {(['projects', 'about', 'contact'] as Section[]).map((item) => (
              <button 
                key={item} 
                onClick={() => scrollToSection(item)}
                className={`text-[9px] sm:text-[10px] uppercase tracking-[0.25em] transition-all duration-500 cursor-pointer relative py-2 group ${activeSection === item ? 'text-white' : 'text-white/40 hover:text-white'}`}
              >
                <span className="relative z-10">{item === 'contact' ? 'Connect' : item}</span>
                <motion.div 
                  className="absolute bottom-0 left-0 h-[1px] bg-[#ff3366]"
                  layoutId="nav-underline"
                  animate={{ width: activeSection === item ? '100%' : '0%' }}
                  transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                />
              </button>
            ))}
          </nav>
        </header>

        {/* Main Content Area */}
        <div className="flex-1 flex items-center px-2 sm:px-4 md:px-0 mt-8 md:mt-0">
          <div className="w-full grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-8 h-full">
            {/* Left Side Content (Sections) */}
            <div className="md:col-span-5 flex items-center justify-center md:justify-start pointer-events-auto pt-10 md:pt-0 order-2 md:order-1 z-20">
              <AnimatePresence mode="wait">
                {!isHolding && activeSection !== 'home' && renderContent()}
              </AnimatePresence>
            </div>

            {/* Center/Right Side (Sphere Area) */}
            <div className="md:col-span-7 flex items-center justify-center relative min-h-[30vh] sm:min-h-[40vh] md:min-h-0 order-1 md:order-2">
              <AnimatePresence mode="wait">
                {isHolding ? (
                  <motion.div
                    key="holding"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 1.1 }}
                    className="flex flex-col items-center z-20"
                  >
                    <h3 className={`text-3xl sm:text-4xl md:text-5xl text-white mb-2 transition-all duration-700 ${isHolding ? 'font-display font-bold uppercase tracking-tighter' : 'font-serif italic'}`}>Evolution</h3>
                    <p className={`text-[#ff3366] text-[8px] sm:text-[9px] md:text-[10px] tracking-[0.5em] sm:tracking-[0.8em] uppercase animate-pulse transition-all duration-700 ${isHolding ? 'font-mono' : ''}`}>Neural Link Established</p>
                  </motion.div>
                ) : activeSection === 'home' && (
                  <div className="pointer-events-auto z-20 w-full flex justify-center md:justify-start">
                    {renderContent()}
                  </div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="flex flex-col items-center gap-6 mt-12 z-20">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.5, duration: 1 }}
            className="absolute bottom-32 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3 pointer-events-none hidden md:flex"
          >
            <span className="text-[8px] uppercase tracking-[0.6em] text-white/10">Deep Navigation</span>
            <div className="w-[1px] h-12 bg-gradient-to-b from-white/20 to-transparent" />
          </motion.div>

          <motion.div 
            className="pointer-events-auto cursor-pointer group flex flex-col items-center"
            onMouseDown={onHoldStart}
            onMouseUp={onHoldEnd}
            onMouseLeave={onHoldEnd}
            onTouchStart={onHoldStart}
            onTouchEnd={onHoldEnd}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <div className="relative w-16 h-16 flex items-center justify-center mb-6">
              <motion.div 
                className="absolute inset-0 border border-white/5 rounded-full"
                animate={{ 
                  scale: isHolding ? 2 : 1, 
                  opacity: isHolding ? 0 : 1,
                  borderColor: isHolding ? '#ff3366' : 'rgba(255,255,255,0.05)'
                }}
                transition={{ duration: 0.8, ease: "easeOut" }}
              />
              <motion.div 
                className="absolute inset-0 border border-[#ff3366]/20 rounded-full"
                initial={{ scale: 0, opacity: 0 }}
                animate={{ 
                  scale: isHolding ? 1.4 : 0, 
                  opacity: isHolding ? 0.6 : 0 
                }}
                transition={{ type: 'spring', damping: 15 }}
              />
              <motion.div 
                className="w-3 h-3 bg-white rounded-full shadow-[0_0_20px_rgba(255,255,255,0.4)]"
                animate={{ 
                  scale: isHolding ? 4 : 1, 
                  backgroundColor: isHolding ? '#ff3366' : '#ffffff',
                  boxShadow: isHolding ? '0 0 40px rgba(255,51,102,0.8)' : '0 0 20px rgba(255,255,255,0.4)'
                }}
              />
            </div>
            <motion.span 
              className="text-[10px] uppercase tracking-[0.6em] text-white/20 font-mono transition-all duration-500 group-hover:text-white"
              animate={{
                color: isHolding ? '#ff3366' : 'rgba(255,255,255,0.2)',
                letterSpacing: isHolding ? '0.8em' : '0.6em'
              }}
            >
              {isHolding ? 'SYNCHRONIZING' : 'HOLD TO EVOLVE'}
            </motion.span>
          </motion.div>

          <div className="w-full flex flex-col md:flex-row justify-between items-center gap-4 mt-8 pt-8 border-t border-white/5">
            <div className="text-[9px] text-white/10 uppercase tracking-[0.4em] font-mono">
              © 2026 Nexus_Dev.co // Edmonton_Node
            </div>
            <div className="flex gap-10 text-[9px] text-white/10 uppercase tracking-[0.4em] font-mono">
              <a href="https://www.linkedin.com/in/nishantsinh-bihola-8bb500321" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-all duration-300">LinkedIn</a>
              <a href="https://github.com/NishantBihola" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-all duration-300">GitHub</a>
            </div>
          </div>
        </footer>
      </section>

      {/* ─── Intro / Marquee + Stats Section ─── */}
      <section className="relative w-full bg-[#080808] overflow-hidden snap-start z-20 flex flex-col justify-between py-0">

        {/* ── Infinite marquee ticker ── */}
        <div className="relative w-full overflow-hidden border-y border-white/5 py-5 group">
          <div className="flex whitespace-nowrap animate-marquee group-hover:[animation-play-state:paused]">
            {[
              'React', 'Next.js', 'Three.js', 'TypeScript', 'Node.js',
              'AI / ML', 'TensorFlow', 'Tailwind', 'Framer Motion', 'WebGL',
              'Python', 'MongoDB', 'PostgreSQL', 'AWS', 'Vercel',
            ].concat([
              'React', 'Next.js', 'Three.js', 'TypeScript', 'Node.js',
              'AI / ML', 'TensorFlow', 'Tailwind', 'Framer Motion', 'WebGL',
              'Python', 'MongoDB', 'PostgreSQL', 'AWS', 'Vercel',
            ]).map((tech, i) => (
              <span key={i} className="inline-flex items-center gap-6 mx-6">
                <span className="text-[10px] uppercase tracking-[0.5em] text-white/20 font-mono hover:text-[#887bff] transition-colors duration-300 cursor-default">
                  {tech}
                </span>
                <span className="text-[#ff3366]/30 text-xs">✦</span>
              </span>
            ))}
          </div>
        </div>

        {/* ── Stats / Numbers ── */}
        <div className="px-8 md:px-24 pt-20 pb-10 max-w-7xl mx-auto w-full">
          <motion.div
            className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-0 border-b border-white/5 pb-20"
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: '-80px' }}
            variants={{ hidden: {}, show: { transition: { staggerChildren: 0.12 } } }}
          >
            {[
              { num: '6+',  label: 'Projects Shipped',    sub: 'Full-stack production' },
              { num: '2+',  label: 'Years Experience',    sub: 'Building digital products' },
              { num: '3',   label: 'AI Models Built',     sub: 'CNN · KNN · Clustering' },
              { num: '∞',   label: 'Ideas In Pipeline',   sub: 'Always evolving' },
            ].map((stat) => (
              <motion.div
                key={stat.label}
                variants={{
                  hidden: { opacity: 0, y: 40 },
                  show: { opacity: 1, y: 0, transition: { duration: 0.9, ease: [0.22, 1, 0.36, 1] } },
                }}
                className="flex flex-col md:border-r border-white/5 md:px-12 first:md:pl-0 last:md:border-r-0 group"
              >
                <div className="overflow-hidden mb-2">
                  <motion.span
                    className="block text-5xl md:text-7xl font-display font-bold tracking-tighter text-white group-hover:text-[#887bff] transition-colors duration-500"
                    whileInView={{ opacity: [0, 1] }}
                    viewport={{ once: true }}
                  >
                    {stat.num}
                  </motion.span>
                </div>
                <span className="text-[10px] uppercase tracking-[0.4em] text-white/50 font-mono mb-1">
                  {stat.label}
                </span>
                <span className="text-[9px] text-white/20 font-mono">
                  {stat.sub}
                </span>
              </motion.div>
            ))}
          </motion.div>

          {/* ── Kinetic typography manifesto ── */}
          <div className="pt-20 pb-24">
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.5 }}
            >
              {/* Label */}
              <div className="overflow-hidden mb-8">
                <motion.span
                  initial={{ y: '110%' }}
                  whileInView={{ y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
                  className="block text-[10px] uppercase tracking-[0.8em] text-[#ff3366] font-mono"
                >
                  Philosophy
                </motion.span>
              </div>

              {/* Big statement — each word is an independent reveal */}
              <div className="flex flex-wrap gap-x-4 gap-y-2 mb-12">
                {[
                  { word: 'Code', accent: false },
                  { word: 'is',   accent: false },
                  { word: 'craft.', accent: true  },
                  { word: 'Design', accent: false },
                  { word: 'is',    accent: false },
                  { word: 'intent.', accent: true },
                  { word: 'AI',    accent: false },
                  { word: 'is',    accent: false },
                  { word: 'the',   accent: false },
                  { word: 'edge.', accent: true  },
                ].map(({ word, accent }, i) => (
                  <div key={i} className="overflow-hidden">
                    <motion.span
                      initial={{ y: '115%' }}
                      whileInView={{ y: 0 }}
                      viewport={{ once: true, margin: '-40px' }}
                      transition={{
                        duration: 1,
                        delay: i * 0.07,
                        ease: [0.22, 1, 0.36, 1],
                      }}
                      className={`block text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-serif italic leading-tight ${
                        accent ? 'text-[#887bff]' : 'text-white/80'
                      }`}
                    >
                      {word}
                    </motion.span>
                  </div>
                ))}
              </div>

              {/* Supporting text + rule */}
              <div className="flex flex-col md:flex-row gap-12 items-start">
                <motion.div
                  initial={{ scaleX: 0 }}
                  whileInView={{ scaleX: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
                  style={{ originX: 0 }}
                  className="hidden md:block w-24 h-px bg-gradient-to-r from-[#887bff]/60 to-transparent mt-4 flex-shrink-0"
                />
                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.9, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
                  className="text-white/35 text-sm leading-relaxed max-w-md font-sans tracking-wide"
                >
                  I build digital experiences that sit at the intersection of engineering precision
                  and creative vision. Every project is an opportunity to push what's possible — 
                  faster, smarter, more beautiful.
                </motion.p>
              </div>
            </motion.div>
          </div>
        </div>

        {/* ── Second marquee (reversed, slower) ── */}
        <div className="relative w-full overflow-hidden border-t border-white/5 py-5">
          <div className="flex whitespace-nowrap animate-marquee-reverse">
            {[
              'Full Stack Dev', 'UI / UX', 'Machine Learning', '3D Interactive',
              'AI Integration', 'Data Science', 'WebGL', 'Cloud Architecture',
              'Full Stack Dev', 'UI / UX', 'Machine Learning', '3D Interactive',
              'AI Integration', 'Data Science', 'WebGL', 'Cloud Architecture',
            ].map((label, i) => (
              <span key={i} className="inline-flex items-center gap-6 mx-8">
                <span className="text-[9px] uppercase tracking-[0.6em] text-white/10 font-mono">
                  {label}
                </span>
                <span className="text-[#887bff]/20 text-xs">◆</span>
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ─── About / Services Section ─── */}
      <section
        ref={servicesSectionRef}
        className="relative w-full min-h-screen bg-[#050505] overflow-hidden snap-start z-20"
      >
        {/* Parallax header block */}
        <motion.div
          style={{ y: servicesHeaderY }}
          className="px-8 md:px-24 pt-28 pb-0 max-w-7xl mx-auto"
        >
          <div className="overflow-hidden">
            <motion.span
              initial={{ y: '110%' }}
              animate={isServicesInView ? { y: 0 } : { y: '110%' }}
              transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
              className="text-[10px] uppercase tracking-[0.8em] text-[#ff3366] font-mono block mb-4"
            >
              Capabilities
            </motion.span>
          </div>
          <div className="overflow-hidden">
            <motion.h2
              initial={{ y: '110%' }}
              animate={isServicesInView ? { y: 0 } : { y: '110%' }}
              transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1], delay: 0.08 }}
              className="text-5xl sm:text-7xl md:text-8xl font-display font-medium tracking-tighter text-white leading-none"
            >
              Our{' '}
              <span className="text-white/15 italic font-serif font-light">Specialization</span>
            </motion.h2>
          </div>
          {/* Animated rule */}
          <motion.div
            initial={{ scaleX: 0 }}
            animate={isServicesInView ? { scaleX: 1 } : { scaleX: 0 }}
            transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1], delay: 0.3 }}
            style={{ originX: 0 }}
            className="h-px bg-gradient-to-r from-[#ff3366]/60 via-white/10 to-transparent mt-12 mb-20"
          />
        </motion.div>

        {/* Cards */}
        <div className="px-8 md:px-24 pb-24 max-w-7xl mx-auto">
          <motion.div
            className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8"
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: '-80px' }}
            variants={{
              hidden: { opacity: 0 },
              show: { opacity: 1, transition: { staggerChildren: 0.18 } },
            }}
          >
            {[
              {
                title: 'Full-Stack Development',
                desc: 'Sleek, performant web applications built with Next.js, Node.js, and modern AI integrations.',
                icon: '⚡',
                details:
                  'Our full-stack expertise spans the entire development lifecycle. We specialize in building scalable architectures using Next.js 14+, implementing robust server-side logic with Node.js/Express, and leveraging cutting-edge AI embedding for intelligent features. Every line of code is optimized for speed, security, and developer experience.',
              },
              {
                title: 'Machine Learning',
                desc: 'Intelligent systems powered by neural networks and sophisticated data clustering algorithms.',
                icon: '🧠',
                details:
                  'We push the boundaries of data science by implementing advanced neural networks and clustering algorithms (DBSCAN, K-Means). Our focus is on creating actionable insights from complex datasets, enabling predictive modeling that drives real-world business value.',
              },
              {
                title: 'Visual Experience',
                desc: 'Immersive 3D environments and pixel-perfect UI/UX design that captivates audiences.',
                icon: '✨',
                details:
                  'Visual storytelling is at our core. We blend high-end 3D graphics with meticulous UI/UX principles to create websites that feel alive. Our focus is on Awwwards-level precision—every transition, micro-animation, and layout shift is purposeful and premium.',
              },
            ].map((service, i) => (
              <motion.div
                key={service.title}
                variants={{
                  hidden: { opacity: 0, y: 50, filter: 'blur(8px)' },
                  show: {
                    opacity: 1,
                    y: 0,
                    filter: 'blur(0px)',
                    transition: { duration: 0.9, ease: [0.22, 1, 0.36, 1] },
                  },
                }}
                className={`group relative glass p-8 md:p-10 rounded-2xl hover:bg-white/[0.04] transition-all duration-700 overflow-hidden cursor-pointer border border-white/5 ${
                  exploringService === i ? 'ring-1 ring-[#ff3366]/60' : 'hover:border-white/10'
                }`}
                onClick={() => setExploringService(exploringService === i ? null : i)}
                whileHover={{ y: -6 }}
                transition={{ type: 'spring', stiffness: 220, damping: 22 }}
              >
                {/* background glow on hover */}
                <div className="absolute -top-16 -right-16 w-32 h-32 rounded-full bg-[#ff3366]/0 group-hover:bg-[#ff3366]/5 blur-3xl transition-all duration-700" />
                <motion.div
                  className="absolute top-0 right-0 p-5 text-xl"
                  animate={{ opacity: exploringService === i ? 1 : 0.15, scale: exploringService === i ? 1.2 : 1 }}
                  transition={{ duration: 0.4 }}
                >
                  {service.icon}
                </motion.div>
                <span className="text-[10px] text-[#ff3366] font-mono mb-6 block">0{i + 1}</span>
                <h3 className="text-xl md:text-2xl font-display font-bold text-white mb-3 group-hover:text-[#ff3366] transition-colors duration-500">
                  {service.title}
                </h3>
                <p className="text-white/40 text-sm leading-relaxed mb-6 group-hover:text-white/60 transition-colors duration-500">
                  {service.desc}
                </p>

                <AnimatePresence initial={false}>
                  {exploringService === i && (
                    <motion.div
                      key="details"
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                      className="overflow-hidden"
                    >
                      <p className="text-xs text-white/70 font-light leading-relaxed mb-6 border-t border-white/5 pt-5 italic">
                        {service.details}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>

                <div className="flex items-center gap-2 text-[9px] uppercase tracking-widest text-white/25 group-hover:text-[#ff3366] transition-all duration-500">
                  <span>{exploringService === i ? 'Show Less' : 'Explore More'}</span>
                  <motion.div
                    animate={{ rotate: exploringService === i ? 90 : 0 }}
                    transition={{ duration: 0.35 }}
                    className="w-5 h-[1px] bg-current"
                  />
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* ─── Cinematic bridge into Projects ─── */}
        <div ref={dividerRef} className="relative w-full h-48 overflow-hidden">
          <motion.div
            initial={{ opacity: 0, scaleX: 0 }}
            whileInView={{ opacity: 1, scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
            style={{ originX: 0 }}
            className="absolute top-1/2 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#ff3366]/30 to-transparent"
          />
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.9, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="absolute inset-0 flex items-center justify-center"
          >
            <span className="text-[9px] uppercase tracking-[0.6em] text-white/15 font-mono">
              Selected Works&nbsp;&nbsp;↓
            </span>
          </motion.div>
        </div>
      </section>

      {/* ─── Projects Section ─── */}
      <section
        ref={projectsSectionRef}
        className="relative w-full min-h-screen bg-[#030303] overflow-hidden snap-start z-20"
      >
        {/* Parallax section header */}
        <motion.div
          style={{ y: projectsHeaderY }}
          className="px-6 sm:px-8 md:px-24 pt-20 pb-0 max-w-7xl mx-auto"
        >
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-4">
            <div>
              <div className="overflow-hidden mb-3">
                <motion.span
                  initial={{ y: '110%' }}
                  animate={isProjectsInView ? { y: 0 } : { y: '110%' }}
                  transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
                  className="text-[9px] md:text-[10px] uppercase tracking-[0.5em] text-[#ff3366] font-mono block"
                >
                  Portfolio
                </motion.span>
              </div>
              <div className="overflow-hidden">
                <motion.h2
                  initial={{ y: '110%' }}
                  animate={isProjectsInView ? { y: 0 } : { y: '110%' }}
                  transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1], delay: 0.07 }}
                  className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-serif italic text-white leading-tight"
                >
                  Digital{' '}
                  <br />
                  Craftsmanship
                </motion.h2>
              </div>
            </div>
            <motion.p
              initial={{ opacity: 0, x: 20 }}
              animate={isProjectsInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 20 }}
              transition={{ duration: 0.9, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
              className="text-white/35 text-xs sm:text-sm max-w-[220px] leading-relaxed tracking-wide md:text-right"
            >
              Functionality meets aesthetic perfection. Each pixel is intentional.
            </motion.p>
          </div>
          {/* Animated rule */}
          <motion.div
            initial={{ scaleX: 0 }}
            animate={isProjectsInView ? { scaleX: 1 } : { scaleX: 0 }}
            transition={{ duration: 1.3, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
            style={{ originX: 0 }}
            className="h-px bg-gradient-to-r from-white/10 via-[#ff3366]/40 to-transparent mb-16 md:mb-24"
          />
        </motion.div>

        {/* Project Grid */}
        <div className="px-6 sm:px-8 md:px-24 pb-24 max-w-7xl mx-auto">
          <div
            className="grid grid-cols-1 md:grid-cols-2 gap-x-8 lg:gap-x-16 gap-y-16 md:gap-y-36"
            style={{ perspective: '2000px' }}
          >
            {[
              {
                title: 'Next.js Multi-Page App',
                category: 'Full Stack Development',
                img: 'https://picsum.photos/seed/code/800/1000',
                desc: 'Implemented dynamic routing, form validation, and optimised rendering strategies.',
              },
              {
                title: 'Weather App',
                category: 'API Integration',
                img: 'https://picsum.photos/seed/weather/800/1000',
                desc: 'Built a real-time weather comparison tool with API integration and caching.',
              },
              {
                title: 'CIFAR-100 Classifier',
                category: 'Machine Learning / CNN',
                img: 'https://picsum.photos/seed/ai/800/1000',
                desc: 'Developed a Convolutional Neural Network using TensorFlow/Keras with performance tuning.',
              },
              {
                title: 'Clustering Models',
                category: 'Data Science',
                img: 'https://picsum.photos/seed/data/800/1000',
                desc: 'Applied K-Means, DBSCAN, ANN, and KNN for structured data analysis.',
              },
              {
                title: 'Movie Recommendation',
                category: 'AI / Streamlit',
                img: 'https://picsum.photos/seed/movie/800/1000',
                desc: 'Built a collaborative filtering engine deployed with Streamlit.',
              },
              {
                title: 'Webflow CMS',
                category: 'Web Development',
                img: 'https://picsum.photos/seed/design/800/1000',
                desc: 'Developed responsive CMS-based websites and improved SEO performance.',
              },
            ].map((project, i) => {
              const [isImageLoaded, setIsImageLoaded] = useState(false);
              return (
                <motion.div
                  key={project.title}
                  initial={{ opacity: 0, y: 80, filter: 'blur(6px)' }}
                  whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                  viewport={{ once: true, margin: '-60px' }}
                  transition={{
                    duration: 1,
                    delay: (i % 2) * 0.18,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                  className={`flex flex-col ${
                    i % 2 === 1 ? 'md:mt-36' : ''
                  } origin-bottom group/card`}
                  whileHover={{ y: -8 }}
                >
                  {/* Image wrapper with scroll parallax scale */}
                  <motion.div
                    className="relative aspect-[4/5] overflow-hidden cursor-pointer mb-5 md:mb-7 rounded-xl bg-white/5"
                    onClick={() => handleProjectClick(project.title)}
                    animate={
                      clickedProject === project.title
                        ? { scale: 0.95, rotate: -1.5 }
                        : { scale: 1, rotate: 0 }
                    }
                    transition={{ type: 'spring', stiffness: 300, damping: 18 }}
                  >
                    {!isImageLoaded && (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-7 h-7 border-2 border-[#ff3366]/20 border-t-[#ff3366] rounded-full animate-spin" />
                      </div>
                    )}
                    <motion.img
                      src={project.img}
                      alt={project.title}
                      onLoad={() => setIsImageLoaded(true)}
                      style={{ scale: projectsImgScale }}
                      className={`w-full h-full object-cover grayscale group-hover/card:grayscale-0 transition-[filter] duration-700 ${
                        isImageLoaded ? 'opacity-100' : 'opacity-0'
                      }`}
                      referrerPolicy="no-referrer"
                    />
                    {/* Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent group-hover/card:opacity-0 transition-opacity duration-500" />
                    {/* Hover CTA */}
                    <div className="absolute inset-0 flex items-end p-6 opacity-0 group-hover/card:opacity-100 transition-opacity duration-500">
                      <span className="text-[9px] uppercase tracking-[0.5em] text-white/60 font-mono">
                        View Project ↗
                      </span>
                    </div>
                  </motion.div>

                  {/* Caption */}
                  <div className="flex flex-col sm:flex-row justify-between items-start gap-3 sm:gap-0">
                    <div>
                      <h3
                        className={`text-2xl sm:text-3xl mb-1 transition-all duration-700 ${
                          isHolding
                            ? 'font-display font-bold uppercase tracking-tighter text-white'
                            : 'font-serif italic text-white'
                        }`}
                      >
                        {project.title}
                      </h3>
                      <p
                        className={`text-[10px] uppercase tracking-widest transition-all duration-700 ${
                          isHolding ? 'font-mono text-[#ff3366]' : 'text-white/35'
                        }`}
                      >
                        {project.category}
                      </p>
                    </div>
                    <p
                      className={`text-[10px] sm:max-w-[160px] sm:text-right leading-relaxed transition-all duration-700 ${
                        isHolding ? 'font-mono text-white/40' : 'text-white/25'
                      }`}
                    >
                      {project.desc}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* CTA */}
          <div className="mt-24 md:mt-48 text-center">
            <motion.button
              onClick={handleStartProject}
              className="group relative inline-flex flex-col items-center"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <span className="text-[9px] md:text-[10px] uppercase tracking-[0.5em] group-hover:tracking-[0.8em] text-white/35 mb-4 group-hover:text-white transition-all duration-500">
                Start a Project
              </span>
              <div className="w-px h-16 md:h-24 bg-gradient-to-b from-white/20 to-transparent" />
            </motion.button>
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
