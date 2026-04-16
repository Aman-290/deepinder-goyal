import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'motion/react';
import { Users, Clock, FileText, ChevronRight } from 'lucide-react';

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
        
        <div className="absolute top-8 left-8 hud-text text-xs text-muted border border-line px-4 py-1.5 bg-bg/80 backdrop-blur-sm z-30 tracking-widest rounded shadow-sm">
          PHASE 1: THE MICRO-FRICTION (2008)
        </div>

        <motion.div 
          style={{ opacity }} 
          className="absolute md:top-32 top-24 left-6 md:left-16 max-w-xl z-30 glass glow-effect p-8 md:p-12 border border-line rounded-2xl shadow-2xl"
        >
          <div className="hud-text text-zomato mb-4 opacity-80">SYS_LOG: ORIGIN_SPARK</div>
          <h2 className="font-display text-5xl md:text-6xl font-bold mb-6 tracking-tight text-gradient">
            Bypassing<br/>the Queue
          </h2>
          <p className="text-muted font-mono text-base md:text-lg leading-relaxed">
            The origin story at Bain & Company. The initial spark wasn't a grand vision, but the frustration of highly-paid consultants wasting time in physical queues just to read paper menus.
          </p>
        </motion.div>

        <motion.div 
          style={{ x }} 
          className="flex items-center gap-12 md:gap-24 px-8 md:px-[40vw] mt-64 md:mt-24 w-[350vw] md:w-[250vw]"
        >
          {/* The Queue - Visual Representation */}
          <div className="flex items-center gap-6 opacity-80">
            {[...Array(5)].map((_, i) => (
              <motion.div 
                key={i} 
                initial={{ opacity: 0.5, y: 10 }}
                animate={{ opacity: [0.5, 1, 0.5], y: [10, 0, 10] }}
                transition={{ duration: 3, delay: i * 0.2, repeat: Infinity }}
                className="w-36 h-56 border border-line flex flex-col items-center justify-between bg-bg/50 relative rounded-xl p-5 shadow-lg backdrop-blur-sm"
              >
                <div className="bg-surface w-14 h-14 rounded-full flex items-center justify-center border border-line text-muted shadow-inner">
                  <Users size={24} />
                </div>
                <div className="flex flex-col items-center gap-3 w-full opacity-50">
                  <div className="w-full h-1.5 bg-line rounded-full"></div>
                  <div className="w-2/3 h-1.5 bg-line rounded-full"></div>
                </div>
                <div className="flex items-center gap-2 text-xs font-mono text-zomato mt-2 bg-zomato/10 px-3 py-1.5 rounded-full border border-zomato/20">
                  <Clock size={12} className="animate-pulse" />
                  <span>WAITING</span>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="flex items-center justify-center w-16 md:w-32 flex-shrink-0 opacity-50">
            <motion.div 
               animate={{ x: [0, 15, 0] }} 
               transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
               className="text-line flex items-center"
            >
              <ChevronRight size={48} strokeWidth={1} />
              <ChevronRight size={48} strokeWidth={1} className="-ml-6 opacity-50" />
            </motion.div>
          </div>

          {/* The Solution - High Fidelity UI Mockup */}
          <div className="flex-shrink-0 w-[90vw] md:w-[950px] border border-zomato/40 rounded-2xl bg-bg/80 p-6 md:p-10 relative overflow-hidden group glass shadow-[0_0_80px_rgba(226,55,68,0.15)] ml-4">
            <div className="absolute inset-0 bg-gradient-to-br from-zomato/5 to-transparent opacity-50 group-hover:opacity-100 transition-opacity duration-1000"></div>
            
            {/* macOS window dots */}
            <div className="absolute top-4 left-5 flex gap-2">
              <div className="w-3 h-3 rounded-full bg-red-500/80 shadow-sm"></div>
              <div className="w-3 h-3 rounded-full bg-yellow-500/80 shadow-sm"></div>
              <div className="w-3 h-3 rounded-full bg-green-500/80 shadow-sm"></div>
            </div>

            <div className="relative z-10 pt-6">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 border-b border-line/50 pb-6 gap-4">
                <div className="font-display text-4xl md:text-5xl font-bold text-gradient-zomato tracking-tight flex items-center gap-4">
                  <FileText className="text-zomato" size={36} />
                  Foodiebay.com
                </div>
                <div className="hud-text text-xs font-bold bg-zomato/10 text-zomato border border-zomato/30 px-4 py-2 rounded-full flex items-center gap-2 shadow-inner">
                  <span className="w-2 h-2 rounded-full bg-zomato animate-[ping_2s_cubic-bezier(0,0,0.2,1)_infinite]"></span>
                  INTRANET V1.0
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-5 gap-8 items-start">
                {/* Main Media Block */}
                <div className="md:col-span-3 relative aspect-video bg-surface rounded-xl border border-line flex items-center justify-center overflow-hidden group-hover:border-zomato/50 transition-colors duration-500 shadow-2xl">
                  <div className="absolute inset-0 bg-zomato/5 mix-blend-overlay z-10"></div>
                  <img src="foodiebay-menus.png" alt="Foodiebay Menus" className="w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-all duration-700 group-hover:scale-105" onError={(e) => e.currentTarget.style.display = 'none'} />
                  
                  {/* Subtle Scanline Animation */}
                  <motion.div 
                    animate={{ top: ['-10%', '110%'] }} 
                    transition={{ duration: 3, ease: "linear", repeat: Infinity }}
                    className="absolute left-0 right-0 h-16 bg-gradient-to-b from-transparent via-zomato/20 to-transparent z-20 pointer-events-none"
                  ></motion.div>
                  <motion.div 
                    animate={{ top: ['-10%', '110%'] }} 
                    transition={{ duration: 3, ease: "linear", repeat: Infinity }}
                    className="absolute left-0 right-0 h-[2px] bg-zomato/50 shadow-[0_0_10px_rgba(226,55,68,0.8)] z-20 pointer-events-none"
                  ></motion.div>
                </div>
                
                {/* Interactive Sidebar Listings */}
                <div className="md:col-span-2 flex flex-col gap-4 h-full">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="border border-line/40 p-4 md:p-5 rounded-xl hover:border-zomato/40 transition-all cursor-pointer bg-surface/30 group/item hover:bg-zomato/5 hover:-translate-y-1 hover:shadow-lg">
                      <div className="flex items-center justify-between mb-3">
                        <div className="h-4 w-1/2 bg-line/80 rounded group-hover/item:bg-zomato/60 transition-colors"></div>
                        <div className="text-[10px] font-mono text-muted group-hover/item:text-zomato transition-colors border border-line/50 group-hover/item:border-zomato/30 px-2 py-0.5 rounded backdrop-blur-sm">PDF</div>
                      </div>
                      <div className="h-2 w-3/4 bg-line/30 rounded mb-2"></div>
                      <div className="h-2 w-1/3 bg-line/20 rounded"></div>
                    </div>
                  ))}
                  
                  <button className="mt-auto w-full py-4 bg-line/10 text-muted border border-line/50 rounded-xl hover:bg-zomato hover:text-white hover:border-zomato transition-all duration-300 font-mono text-sm uppercase tracking-widest font-bold flex items-center justify-center gap-2 group/btn">
                    <span>Upload Scan</span>
                    <motion.span 
                      className="inline-block"
                      animate={{ y: [0, -3, 0] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                    >
                      ↑
                    </motion.span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

      </div>
    </div>
  );
}
