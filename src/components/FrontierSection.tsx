import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'motion/react';

export default function FrontierSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  const y1 = useTransform(scrollYProgress, [0, 1], [50, -50]);
  const y2 = useTransform(scrollYProgress, [0, 1], [100, -100]);

  return (
    <div ref={containerRef} className="py-32 bg-black relative overflow-hidden border-b border-line">
      {/* Cosmic Void Background */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.05)_0%,transparent_100%)]"></div>
      <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(white 1px, transparent 1px)', backgroundSize: '60px 60px' }}></div>

      <div className="container mx-auto px-4 md:px-8 max-w-7xl relative z-10">
        <div className="hud-text text-xs text-muted border border-line inline-block px-3 py-1 bg-surface/50 backdrop-blur-sm mb-16">
          PHASE 4: THE FRONTIER
        </div>

        <div className="text-center mb-24 relative z-10">
          <h2 className="font-display text-6xl md:text-8xl font-bold mb-6 tracking-tighter">From Bytes to Atoms</h2>
          <p className="text-muted font-mono text-xl md:text-2xl max-w-3xl mx-auto leading-relaxed">
            Solving extreme macro-problems. Breaking out of the grid dashboard and into the expansive, cosmic void.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-24 w-full relative z-10">
          
          {/* Path A: LAT Aerospace */}
          <motion.div style={{ y: y1 }} className="border border-line bg-surface/80 backdrop-blur-xl p-8 md:p-12 group hover:border-blue-500 transition-colors duration-500 shadow-2xl flex flex-col">
            <div className="flex justify-between items-start mb-12">
              <div className="hud-text text-blue-500 text-lg">PATH A: MACRO</div>
              <div className="w-16 h-16 rounded-full border border-blue-500/30 flex items-center justify-center group-hover:scale-110 transition-transform bg-blue-500/10 text-2xl">
                ✈️
              </div>
            </div>
            <h3 className="font-display text-4xl md:text-5xl font-bold mb-6">LAT Aerospace</h3>
            <p className="text-muted font-mono text-lg md:text-xl mb-12 leading-relaxed flex-grow">
              Hybrid-electric, ultra-short take-off and landing (uSTOL) aircraft. Eliminating the reliance on massive airport infrastructure.
            </p>
            
            <div className="relative w-full aspect-video bg-bg border border-line flex items-center justify-center overflow-hidden mb-8 group-hover:border-blue-500/50 transition-colors">
              <span className="font-mono text-sm text-ink absolute z-10 px-4 py-2 bg-surface/90 border border-line">
                lat-aerospace-ustol.webp
              </span>
              <img src="lat-aerospace-ustol.webp" alt="LAT Aerospace" className="w-full h-full object-cover opacity-40 mix-blend-luminosity" onError={(e) => e.currentTarget.style.display = 'none'} />
              <div className="absolute inset-0 bg-blue-500/10 mix-blend-overlay"></div>
            </div>

            <div className="h-1 w-full bg-line overflow-hidden">
              <div className="h-full bg-blue-500 w-0 group-hover:w-full transition-all duration-1000 ease-out"></div>
            </div>
          </motion.div>

          {/* Path B: Continue Research */}
          <motion.div style={{ y: y2 }} className="border border-line bg-surface/80 backdrop-blur-xl p-8 md:p-12 group hover:border-purple-500 transition-colors duration-500 shadow-2xl flex flex-col">
            <div className="flex justify-between items-start mb-12">
              <div className="hud-text text-purple-500 text-lg">PATH B: MICRO</div>
              <div className="w-16 h-16 rounded-full border border-purple-500/30 flex items-center justify-center group-hover:scale-110 transition-transform bg-purple-500/10 text-2xl">
                🧠
              </div>
            </div>
            <h3 className="font-display text-4xl md:text-5xl font-bold mb-6">Continue Research</h3>
            <p className="text-muted font-mono text-lg md:text-xl mb-12 leading-relaxed flex-grow">
              Investigating the "Gravity Ageing" hypothesis. Engineering proprietary devices to measure real-time cerebral brain blood flow.
            </p>
            
            <div className="relative w-full aspect-video bg-bg border border-line flex items-center justify-center overflow-hidden mb-8 group-hover:border-purple-500/50 transition-colors">
              <span className="font-mono text-sm text-ink absolute z-10 px-4 py-2 bg-surface/90 border border-line">
                continue-research-brain.webp
              </span>
              <img src="continue-research-brain.webp" alt="Continue Research" className="w-full h-full object-cover opacity-40 mix-blend-luminosity" onError={(e) => e.currentTarget.style.display = 'none'} />
              <div className="absolute inset-0 bg-purple-500/10 mix-blend-overlay"></div>
            </div>

            <div className="h-1 w-full bg-line overflow-hidden">
              <div className="h-full bg-purple-500 w-0 group-hover:w-full transition-all duration-1000 ease-out"></div>
            </div>
          </motion.div>

        </div>
      </div>
    </div>
  );
}
