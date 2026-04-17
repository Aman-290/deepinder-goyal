import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'motion/react';
import { Rocket, Brain, ChevronRight } from 'lucide-react';
import GravityBrainViz from './GravityBrainViz';

export default function FrontierSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  const y1 = useTransform(scrollYProgress, [0, 1], [30, -30]);
  const y2 = useTransform(scrollYProgress, [0, 1], [60, -60]);

  return (
    <div ref={containerRef} className="py-24 md:py-40 bg-black relative overflow-hidden border-b border-line">
      {/* Cosmic Void Background */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,rgba(59,130,246,0.15)_0%,rgba(0,0,0,1)_70%)] pointer-events-none"></div>
      
      {/* Animated 3D Grid */}
      <div className="absolute inset-0 opacity-[0.04] pointer-events-none" style={{ backgroundImage: 'radial-gradient(white 1px, transparent 1px)', backgroundSize: '40px 40px', transform: 'perspective(500px) rotateX(60deg) scale(2)', transformOrigin: 'bottom' }}></div>

      <div className="container mx-auto px-4 md:px-8 max-w-7xl relative z-10">
        <div className="flex flex-col items-center mb-20 md:mb-32 relative z-10 text-center">
          <div className="inline-flex items-center gap-3 z-30 mb-8 md:mb-12">
            <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse shadow-[0_0_10px_#3b82f6]"></span>
            <div className="hud-text text-xs border border-blue-500/40 text-blue-400 bg-blue-500/10 shadow-[0_0_15px_rgba(59,130,246,0.2)] px-4 py-2 backdrop-blur-sm rounded-md font-bold tracking-widest">
              PHASE 4: THE FRONTIER
            </div>
          </div>

          <h2 className="font-display text-6xl md:text-8xl font-bold mb-8 tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 drop-shadow-[0_0_20px_rgba(168,85,247,0.3)]">
            From Bytes to Atoms
          </h2>
          <p className="font-mono text-xl md:text-2xl max-w-3xl mx-auto leading-relaxed text-muted/90">
             Solving extreme macro-problems. Breaking out of the grid dashboard and into the expansive, physical world.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-16 w-full relative z-10">
          
          {/* Path A: LAT Aerospace */}
          <motion.div style={{ y: y1 }} className="glass border border-blue-500/30 bg-surface/40 p-8 md:p-12 group hover:border-blue-400 transition-all duration-700 shadow-[0_0_40px_rgba(59,130,246,0.05)] hover:shadow-[0_0_60px_rgba(59,130,246,0.2)] rounded-3xl flex flex-col relative overflow-hidden hover:-translate-y-2 backdrop-blur-xl">
            
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-1000 pointer-events-none"></div>

            <div className="flex justify-between items-start mb-12 relative z-10">
              <div className="hud-text text-blue-400 text-sm md:text-base tracking-[0.2em] font-bold bg-blue-500/10 px-3 py-1 rounded shadow-inner border border-blue-500/20">PATH A: MACRO</div>
              <div className="w-14 h-14 rounded-full border border-blue-400/40 flex items-center justify-center group-hover:scale-110 transition-transform duration-500 bg-blue-500/20 shadow-[0_0_20px_rgba(59,130,246,0.3)]">
                <Rocket className="text-blue-300" size={24} strokeWidth={1.5} />
              </div>
            </div>
            
            <h3 className="font-display text-4xl md:text-5xl font-bold mb-6 text-white group-hover:text-blue-50 transition-colors relative z-10 tracking-tight">LAT Aerospace</h3>
            
            <p className="text-muted/80 font-mono text-lg md:text-xl mb-12 leading-relaxed flex-grow relative z-10">
              Hybrid-electric, ultra-short take-off and landing <span className="text-blue-400 font-bold bg-blue-500/10 px-1 rounded">uSTOL</span> aircraft. Eliminating the reliance on massive airport infrastructure.
            </p>
            
            <div className="relative w-full aspect-video rounded-2xl border border-blue-500/20 flex items-center justify-center overflow-hidden mb-8 group-hover:border-blue-400/50 transition-colors shadow-inner z-10 bg-bg">
              <img src="lat-aerospace-ustol.png" alt="LAT Aerospace" className="w-full h-full object-cover opacity-60 mix-blend-luminosity grayscale group-hover:grayscale-0 group-hover:scale-[1.03] transition-all duration-1000" loading="lazy" onError={(e) => e.currentTarget.style.display = 'none'} />
              <div className="absolute inset-0 bg-blue-900/40 mix-blend-overlay group-hover:bg-blue-500/20 transition-colors duration-1000 pointer-events-none"></div>
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_40%,rgba(0,0,0,0.8)_100%)] pointer-events-none"></div>
            </div>

            <a 
              href="https://www.lat.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-blue-400 font-mono text-sm tracking-widest font-bold group/btn cursor-pointer w-max relative z-10 hover:text-blue-300 transition-colors"
            >
              EXPLORE PROTOTYPE 
              <ChevronRight size={16} className="group-hover/btn:translate-x-2 transition-transform" />
            </a>
            
            {/* Soft top border reflection */}
             <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-blue-400/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-1000 rounded-t-3xl"></div>
          </motion.div>

          {/* Path B: Continue Research */}
          <motion.div style={{ y: y2 }} className="glass border border-purple-500/30 bg-surface/40 p-8 md:p-12 group hover:border-purple-400 transition-all duration-700 shadow-[0_0_40px_rgba(168,85,247,0.05)] hover:shadow-[0_0_60px_rgba(168,85,247,0.2)] rounded-3xl flex flex-col relative overflow-hidden hover:-translate-y-2 mt-0 md:mt-24 backdrop-blur-xl">
            
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-1000 pointer-events-none"></div>

            <div className="flex justify-between items-start mb-12 relative z-10">
              <div className="hud-text text-purple-400 text-sm md:text-base tracking-[0.2em] font-bold bg-purple-500/10 px-3 py-1 rounded shadow-inner border border-purple-500/20">PATH B: MICRO</div>
              <div className="w-14 h-14 rounded-full border border-purple-400/40 flex items-center justify-center group-hover:scale-110 transition-transform duration-500 bg-purple-500/20 shadow-[0_0_20px_rgba(168,85,247,0.3)]">
                <Brain className="text-purple-300" size={24} strokeWidth={1.5} />
              </div>
            </div>
            
            <h3 className="font-display text-4xl md:text-5xl font-bold mb-6 text-white group-hover:text-purple-50 transition-colors relative z-10 tracking-tight">Continue Research</h3>
            
            <p className="text-muted/80 font-mono text-lg md:text-xl mb-12 leading-relaxed flex-grow relative z-10">
              Investigating the <span className="text-purple-400 font-bold bg-purple-500/10 px-1 rounded">"Gravity Ageing"</span> hypothesis. Engineering proprietary devices to measure real-time cerebral brain blood flow.
            </p>
            
            <div className="relative w-full aspect-video rounded-2xl border border-purple-500/20 flex items-center justify-center overflow-hidden mb-8 group-hover:border-purple-400/50 transition-colors shadow-inner z-10 bg-bg">
              <GravityBrainViz />
              <div className="absolute inset-0 bg-purple-900/40 mix-blend-overlay group-hover:bg-purple-500/20 transition-colors duration-1000 pointer-events-none"></div>
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_40%,rgba(0,0,0,0.8)_100%)] pointer-events-none"></div>
            </div>

            <a 
              href="https://www.temple.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-purple-400 font-mono text-sm tracking-widest font-bold group/btn cursor-pointer w-max relative z-10 hover:text-purple-300 transition-colors"
            >
              VIEW MEDICAL DATA 
              <ChevronRight size={16} className="group-hover/btn:translate-x-2 transition-transform" />
            </a>

            {/* Soft top border reflection */}
             <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-purple-400/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-1000 rounded-t-3xl"></div>
          </motion.div>

        </div>
      </div>
    </div>
  );
}
