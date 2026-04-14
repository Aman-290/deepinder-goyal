import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'motion/react';

export default function MicroFrictionSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  });

  // Adjusted transform to ensure it scrolls fully and smoothly
  const x = useTransform(scrollYProgress, [0, 1], ["0%", "-60%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.1, 0.9, 1], [0, 1, 1, 0]);

  return (
    <div ref={containerRef} className="h-[300vh] bg-surface relative">
      <div className="sticky top-0 h-screen flex flex-col justify-center overflow-hidden border-t border-b border-line">
        
        <div className="absolute top-8 left-8 hud-text text-xs text-muted border border-line px-3 py-1 bg-bg/80 backdrop-blur-sm z-30">
          PHASE 1: THE MICRO-FRICTION (2008)
        </div>

        <motion.div style={{ opacity }} className="absolute top-24 left-8 md:left-24 max-w-2xl z-20 bg-surface/80 backdrop-blur-md p-8 border border-line shadow-2xl">
          <h2 className="font-display text-5xl md:text-7xl font-bold mb-6 tracking-tight">Bypassing the Queue</h2>
          <p className="text-muted font-mono text-lg md:text-xl leading-relaxed">
            The origin story at Bain & Company. The initial spark wasn't a grand vision, but the frustration of highly paid consultants waiting in physical queues just to read paper menus.
          </p>
        </motion.div>

        <motion.div 
          style={{ x }} 
          className="flex items-center gap-16 px-8 md:px-24 mt-48 w-[300vw] md:w-[250vw]"
        >
          {/* The Queue */}
          <div className="flex items-center gap-6 opacity-40">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="w-24 h-64 border border-line flex flex-col items-center justify-center bg-bg relative shadow-lg">
                <div className="w-12 h-12 rounded-full border border-line mb-6"></div>
                <div className="w-16 h-32 border border-line"></div>
                <div className="absolute -bottom-8 text-sm font-mono text-muted tracking-widest">WAITING</div>
              </div>
            ))}
          </div>

          {/* The Solution */}
          <div className="flex-shrink-0 w-[85vw] md:w-[800px] border border-zomato bg-bg p-8 md:p-12 relative overflow-hidden group shadow-[0_0_50px_rgba(226,55,68,0.15)] ml-12">
            <div className="absolute inset-0 bg-zomato/5 group-hover:bg-zomato/10 transition-colors duration-500"></div>
            <div className="relative z-10">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 border-b border-line pb-6 gap-4">
                <div className="font-display text-4xl md:text-5xl font-bold text-zomato tracking-tight">Foodiebay.com</div>
                <div className="hud-text text-sm bg-zomato/20 text-zomato px-3 py-1 rounded border border-zomato/30">INTRANET V1.0</div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                <div className="relative aspect-video bg-surface border border-line flex items-center justify-center overflow-hidden">
                  <span className="font-mono text-sm text-ink absolute z-10 px-4 py-2 bg-bg/90 border border-line">
                    foodiebay-menus.webp
                  </span>
                  <img src="foodiebay-menus.webp" alt="Foodiebay Menus" className="w-full h-full object-cover opacity-40" onError={(e) => e.currentTarget.style.display = 'none'} />
                </div>
                
                <div className="grid grid-cols-1 gap-4">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="border border-line p-6 hover:border-zomato transition-colors cursor-pointer bg-surface/50">
                      <div className="h-5 w-3/4 bg-line mb-4"></div>
                      <div className="h-4 w-1/2 bg-line/50 mb-3"></div>
                      <div className="h-4 w-1/3 bg-line/30"></div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </motion.div>

      </div>
    </div>
  );
}
