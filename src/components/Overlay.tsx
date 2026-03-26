import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';

interface OverlayProps {
  isHolding: boolean;
  onHoldStart: () => void;
  onHoldEnd: () => void;
}

type Section = 'home' | 'projects' | 'about' | 'contact';

export default function Overlay({ isHolding, onHoldStart, onHoldEnd }: OverlayProps) {
  const [activeSection, setActiveSection] = useState<Section>('home');

  const renderContent = () => {
    switch (activeSection) {
      case 'projects':
        return (
          <motion.div
            key="projects"
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -40 }}
            className="flex flex-col items-start text-left max-w-sm"
          >
            <h2 className="text-5xl font-serif italic text-white mb-8">Selected <br />Works</h2>
            <div className="flex flex-col gap-8 w-full">
              {[
                { name: 'Zentry', year: '2024', type: 'Immersive' },
                { name: 'Shapeshifter', year: '2023', type: 'Experimental' },
                { name: 'Nexus', year: '2024', type: 'Platform' },
                { name: 'Ethereal', year: '2022', type: 'Visual' }
              ].map((project) => (
                <div key={project.name} className="group cursor-pointer border-b border-white/10 pb-4 hover:border-white/40 transition-colors">
                  <div className="flex justify-between items-end">
                    <span className="text-2xl font-light text-white/80 group-hover:text-white transition-colors">{project.name}</span>
                    <span className="text-[9px] uppercase tracking-widest text-white/30">{project.type} • {project.year}</span>
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
            <h2 className="text-5xl font-serif italic text-white mb-8">The Studio</h2>
            <div className="space-y-6">
              <p className="text-white/70 text-base leading-relaxed tracking-wide font-light">
                Nexus Code is a digital laboratory where code meets art. We specialize in building immersive, high-performance web experiences that push the boundaries of the browser.
              </p>
              <p className="text-white/50 text-sm leading-relaxed tracking-wide font-light">
                Founded on the principle of technical excellence and creative courage, we partner with brands that want to define the future of the web.
              </p>
            </div>
            <div className="mt-12 grid grid-cols-2 gap-8">
              <div>
                <span className="text-[9px] uppercase tracking-[0.3em] text-white/30 block mb-2">Services</span>
                <ul className="text-[11px] text-white/60 space-y-1 uppercase tracking-wider">
                  <li>Creative Direction</li>
                  <li>WebGL / 3D</li>
                  <li>Fullstack Dev</li>
                </ul>
              </div>
              <div>
                <span className="text-[9px] uppercase tracking-[0.3em] text-white/30 block mb-2">Location</span>
                <p className="text-[11px] text-white/60 uppercase tracking-wider">Auckland, NZ</p>
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
            <h2 className="text-5xl font-serif italic text-white mb-8">Get in <br />Touch</h2>
            <div className="flex flex-col gap-8">
              <div className="group cursor-pointer">
                <span className="text-[9px] uppercase tracking-[0.3em] text-white/30 block mb-2">Inquiries</span>
                <a href="mailto:hello@nexuscode.studio" className="text-3xl font-light text-white/80 group-hover:text-white transition-colors border-b border-white/20 pb-1 pointer-events-auto">hello@nexuscode.studio</a>
              </div>
              <div className="flex gap-12">
                <div className="group cursor-pointer">
                  <span className="text-[9px] uppercase tracking-[0.3em] text-white/30 block mb-2">Social</span>
                  <span className="text-sm text-white/60 group-hover:text-white transition-colors uppercase tracking-widest">Instagram</span>
                </div>
                <div className="group cursor-pointer">
                  <span className="text-[9px] uppercase tracking-[0.3em] text-white/30 block mb-2">Social</span>
                  <span className="text-sm text-white/60 group-hover:text-white transition-colors uppercase tracking-widest">Twitter</span>
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
            <h2 className="text-5xl md:text-7xl font-serif italic text-white mb-4 leading-tight">
              Immersive <br />
              Digital Experiences
            </h2>
            <p className="text-white/40 text-sm tracking-widest uppercase">Est. 2004 • New Zealand</p>
          </motion.div>
        );
    }
  };

  return (
    <div className="relative z-10 w-full h-screen flex flex-col justify-between p-8 md:p-12 pointer-events-none select-none">
      {/* Header */}
      <header className="flex justify-between items-start pointer-events-auto">
        <div className="flex flex-col cursor-pointer" onClick={() => setActiveSection('home')}>
          <span className="text-[10px] uppercase tracking-[0.3em] text-white/50 mb-1">Creative Studio</span>
          <h1 className="text-2xl font-light tracking-tighter text-white">NEXUS CODE.</h1>
        </div>
        
        <nav className="flex gap-12">
          {(['projects', 'about', 'contact'] as Section[]).map((item) => (
            <button 
              key={item} 
              onClick={() => setActiveSection(item)}
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
      <div className="flex-1 flex items-center">
        <div className="w-full grid grid-cols-1 md:grid-cols-12 gap-8">
          {/* Left Side Content (Sections) */}
          <div className="md:col-span-5 flex items-center pointer-events-auto">
            <AnimatePresence mode="wait">
              {!isHolding && activeSection !== 'home' && renderContent()}
            </AnimatePresence>
          </div>

          {/* Center/Right Side (Sphere Area) */}
          <div className="md:col-span-7 flex items-center justify-center relative">
            <AnimatePresence mode="wait">
              {isHolding ? (
                <motion.div
                  key="holding"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 1.1 }}
                  className="flex flex-col items-center z-20"
                >
                  <h3 className="text-5xl font-serif italic text-white mb-2">Evolution</h3>
                  <p className="text-[#ff3366] text-[10px] tracking-[0.8em] uppercase animate-pulse">Neural Link Established</p>
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
        <div 
          className="pointer-events-auto cursor-pointer group flex flex-col items-center"
          onMouseDown={onHoldStart}
          onMouseUp={onHoldEnd}
          onMouseLeave={onHoldEnd}
          onTouchStart={onHoldStart}
          onTouchEnd={onHoldEnd}
        >
          <div className="relative w-14 h-14 flex items-center justify-center mb-3">
            <motion.div 
              className="absolute inset-0 border border-white/20 rounded-full"
              animate={{ scale: isHolding ? 1.6 : 1, opacity: isHolding ? 0 : 1 }}
            />
            <motion.div 
              className="w-2.5 h-2.5 bg-white rounded-full"
              animate={{ scale: isHolding ? 4 : 1, backgroundColor: isHolding ? '#ff3366' : '#ffffff' }}
            />
          </div>
          <span className="text-[10px] uppercase tracking-[0.5em] text-white/40 group-hover:text-white/80 transition-colors">
            {isHolding ? 'Release' : 'Click & Hold'}
          </span>
        </div>

        <div className="w-full flex justify-between items-end">
          <div className="text-[10px] text-white/20 uppercase tracking-[0.3em]">
            © 2026 Nexus Code Studio
          </div>
          <div className="flex gap-8 text-[10px] text-white/20 uppercase tracking-[0.3em]">
            <span className="hover:text-white transition-colors cursor-pointer pointer-events-auto">Twitter</span>
            <span className="hover:text-white transition-colors cursor-pointer pointer-events-auto">Instagram</span>
          </div>
        </div>
      </footer>

      {/* Overlays */}
      <div className="fixed inset-0 pointer-events-none opacity-[0.04] bg-[url('https://grainy-gradients.vercel.app/noise.svg')] mix-blend-overlay" />
      
      <AnimatePresence>
        {isHolding && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 pointer-events-none z-[-1] bg-gradient-to-t from-[#ff3366]/10 via-transparent to-[#ff3366]/5"
          />
        )}
      </AnimatePresence>
      
      <div className="fixed inset-0 pointer-events-none z-[-2] bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.5)_100%)]" />
    </div>
  );
}
