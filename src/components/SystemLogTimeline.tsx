import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'motion/react';
import { Terminal, Wrench, RefreshCw, GitMerge, DollarSign, PlusCircle, Network, Clock } from 'lucide-react';

const logs = [
  { year: '2008.07', action: 'INIT', icon: Terminal, color: 'text-blue-400', bg: 'bg-blue-400/10', border: 'border-blue-400/30', desc: 'Foodiebay.exe deployed. Intranet menu digitization complete.' },
  { year: '2010.11', action: 'REFACTOR', icon: Wrench, color: 'text-orange-400', bg: 'bg-orange-400/10', border: 'border-orange-400/30', desc: 'Rebranded to Zomato. Global expansion protocols initiated to avoid eBay naming conflicts.' },
  { year: '2015.04', action: 'PIVOT', icon: RefreshCw, color: 'text-yellow-400', bg: 'bg-yellow-400/10', border: 'border-yellow-400/30', desc: 'Last-mile logistics engine integrated. Transitioned from asset-light data business to capital-intensive delivery network.' },
  { year: '2020.01', action: 'MERGE', icon: GitMerge, color: 'text-purple-400', bg: 'bg-purple-400/10', border: 'border-purple-400/30', desc: 'UberEats_India acquired. Market share optimized.' },
  { year: '2021.07', action: 'EXECUTE', icon: DollarSign, color: 'text-green-400', bg: 'bg-green-400/10', border: 'border-green-400/30', desc: 'Historic IPO. Oversubscribed 35x. $12B valuation achieved. Public market scrutiny engaged.' },
  { year: '2022.06', action: 'ACQUIRE', icon: PlusCircle, color: 'text-[var(--color-blinkit)]', bg: 'bg-yellow-500/10', border: 'border-yellow-500/30', desc: 'Blinkit integrated. Quick-commerce matrix established despite intense market skepticism.' },
  { year: '2025.01', action: 'RESTRUCTURE', icon: Network, color: 'text-[var(--color-zomato)]', bg: 'bg-red-500/10', border: 'border-red-500/30', desc: 'Eternal Limited holding company formed. Systemic risk isolated. Decentralized leadership empowered.' }
];

export default function SystemLogTimeline() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start center", "end center"]
  });

  const height = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  return (
    <div ref={containerRef} className="py-24 md:py-40 bg-surface relative border-b border-line overflow-hidden">
      {/* Visual background lines */}
      <div className="absolute inset-0 grid-bg opacity-10 blur-[1px]"></div>
      
      <div className="container mx-auto px-4 md:px-8 max-w-5xl relative z-10">
        
        <div className="flex flex-col items-center md:items-start mb-24">
          <div className="flex items-center gap-3 mb-6">
            <span className="w-2 h-2 rounded-full bg-zomato animate-pulse"></span>
            <div className="hud-text text-zomato tracking-widest text-xs border border-zomato/30 px-3 py-1 bg-zomato/5 rounded shadow-[0_0_10px_rgba(226,55,68,0.2)]">
              SYSTEM LOG: EVOLUTIONARY ARCS
            </div>
          </div>
          <h2 className="font-display text-4xl md:text-6xl font-bold tracking-tight text-ink text-center md:text-left text-gradient">
            Timeline <span className="opacity-50">/</span> Execution
          </h2>
        </div>

        <div className="relative">
          {/* Default faded line */}
          <div className="absolute left-6 md:left-[160px] top-0 bottom-0 w-[2px] bg-line/50 rounded-full"></div>
          
          {/* Animated line tied to scroll */}
          <div className="absolute left-6 md:left-[160px] top-0 bottom-0 w-[2px] rounded-full overflow-hidden">
            <motion.div 
              style={{ height }} 
              className="w-full bg-gradient-to-b from-zomato to-[#f79bb4] shadow-[0_0_20px_rgba(226,55,68,1)]"
            ></motion.div>
          </div>

          <div className="space-y-16 md:space-y-24 pt-4 relative">
            {logs.map((log, index) => {
              const Icon = log.icon;
              return (
                <motion.div 
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ duration: 0.6, delay: 0.1, type: "spring", stiffness: 100 }}
                  className="flex flex-col md:flex-row items-start md:items-center gap-8 md:gap-16 relative pl-16 md:pl-0 group"
                >
                  {/* Glowing Node connected to timeline */}
                  <div className="absolute left-6 md:left-[160px] w-5 h-5 bg-surface border-[3px] border-line rounded-full -translate-x-[9px] mt-[6px] md:mt-0 z-10 transition-all duration-500 group-hover:border-zomato group-hover:scale-125 group-hover:shadow-[0_0_15px_#E23744]">
                    <div className="absolute inset-0 m-auto w-1 h-1 bg-muted rounded-full group-hover:bg-zomato transition-colors"></div>
                  </div>
                  
                  {/* Year display */}
                  <div className="md:w-[130px] flex-shrink-0 flex items-center md:justify-end gap-2 font-mono text-sm md:text-base text-muted/50 transition-colors duration-500 group-hover:text-ink">
                    <Clock size={14} className="opacity-50 group-hover:text-zomato transition-colors" />
                    <span>[{log.year}]</span>
                  </div>

                  {/* Glassmorphic Log Card */}
                  <div className="flex-grow w-full glass glow-effect border border-line/50 p-6 md:p-8 rounded-2xl relative overflow-hidden transition-all duration-500 hover:-translate-y-1 hover:border-line group-hover:shadow-[0_10px_40px_rgba(0,0,0,0.5)]">
                    
                    {/* Background subtle colored gradient */}
                    <div className={`absolute inset-0 bg-gradient-to-br ${log.bg} opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none`}></div>
                    
                    {/* Tiny animated dots top right */}
                    <div className="absolute top-4 right-4 flex gap-1 opacity-20 group-hover:opacity-100 transition-opacity">
                      <span className="w-1.5 h-1.5 rounded-full bg-line group-hover:bg-muted delay-75 transition-colors"></span>
                      <span className="w-1.5 h-1.5 rounded-full bg-line group-hover:bg-muted delay-150 transition-colors"></span>
                      <span className="w-1.5 h-1.5 rounded-full bg-line group-hover:bg-muted delay-200 transition-colors"></span>
                    </div>

                    <div className="relative z-10">
                      {/* Categorical Chip */}
                      <div className={`inline-flex items-center gap-2 font-mono text-xs px-3 py-1.5 rounded shadow-inner mb-4 border ${log.border} ${log.bg} ${log.color} backdrop-blur-md`}>
                        <Icon size={14} />
                        <span className="font-bold tracking-widest">{log.action}</span>
                      </div>
                      
                      {/* Description Text */}
                      <p className="font-mono text-base md:text-lg text-ink/70 leading-relaxed group-hover:text-ink transition-colors duration-500">
                        {log.desc}
                      </p>
                    </div>

                    {/* Scanline overly running down on hover */}
                    <motion.div 
                      className={`absolute top-0 left-0 w-full h-[1px] ${log.bg.replace('/10', '/50')} opacity-0 group-hover:opacity-100 pointer-events-none z-20`}
                      animate={{ top: ['0%', '100%'] }}
                      transition={{ duration: 2, ease: "linear", repeat: Infinity }}
                    ></motion.div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

      </div>
    </div>
  );
}
