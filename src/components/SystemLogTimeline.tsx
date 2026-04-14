import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'motion/react';

const logs = [
  { year: '2008.07', action: 'INIT', desc: 'Foodiebay.exe deployed. Intranet menu digitization complete.' },
  { year: '2010.11', action: 'REFACTOR', desc: 'Rebranded to Zomato. Global expansion protocols initiated to avoid eBay naming conflicts.' },
  { year: '2015.04', action: 'PIVOT', desc: 'Last-mile logistics engine integrated. Transitioned from asset-light data business to capital-intensive delivery network.' },
  { year: '2020.01', action: 'MERGE', desc: 'UberEats_India acquired. Market share optimized.' },
  { year: '2021.07', action: 'EXECUTE', desc: 'Historic IPO. Oversubscribed 35x. $12B valuation achieved. Public market scrutiny engaged.' },
  { year: '2022.06', action: 'ACQUIRE', desc: 'Blinkit integrated. Quick-commerce matrix established despite intense market skepticism.' },
  { year: '2025.01', action: 'RESTRUCTURE', desc: 'Eternal Limited holding company formed. Systemic risk isolated. Decentralized leadership empowered.' }
];

export default function SystemLogTimeline() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start center", "end center"]
  });

  const height = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  return (
    <div ref={containerRef} className="py-32 bg-surface relative border-b border-line">
      <div className="container mx-auto px-4 md:px-8 max-w-5xl relative z-10">
        
        <div className="hud-text text-xs text-muted border border-line inline-block px-3 py-1 bg-bg mb-16">
          SYSTEM LOG: EVOLUTIONARY ARCS
        </div>

        <div className="relative">
          {/* The main vertical line */}
          <div className="absolute left-4 md:left-32 top-0 bottom-0 w-px bg-line">
            <motion.div 
              style={{ height }} 
              className="w-full bg-zomato shadow-[0_0_10px_rgba(226,55,68,0.5)]"
            ></motion.div>
          </div>

          <div className="space-y-12 md:space-y-24">
            {logs.map((log, index) => (
              <motion.div 
                key={index}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="flex flex-col md:flex-row items-start md:items-center gap-6 md:gap-12 relative pl-12 md:pl-0"
              >
                {/* Node */}
                <div className="absolute left-4 md:left-32 w-3 h-3 bg-bg border-2 border-zomato rounded-full -translate-x-[5px] mt-1.5 md:mt-0 z-10"></div>
                
                {/* Year */}
                <div className="md:w-32 flex-shrink-0 font-mono text-lg text-muted md:text-right">
                  [{log.year}]
                </div>

                {/* Content */}
                <div className="flex-grow border border-line bg-bg p-6 hover:border-zomato/50 transition-colors group relative overflow-hidden">
                  <div className="absolute inset-0 bg-zomato/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  <div className="relative z-10">
                    <span className="font-mono text-sm px-2 py-1 bg-line/50 text-ink inline-block mb-3">
                      {log.action}
                    </span>
                    <p className="font-mono text-base md:text-lg text-ink/90 leading-relaxed">
                      {log.desc}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
