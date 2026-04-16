import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { BrainCircuit, Quote, Repeat, ArrowRight } from 'lucide-react';

const flashcards = [
  {
    id: 1,
    text: "Dream without action is hallucination.",
    context: "A stark reminder that grand visions are worthless without flawless, immediate execution."
  },
  {
    id: 2,
    text: "Mindfulness -> Gratitude",
    context: "Used to stave off the soft complacency that traditionally accompanies immense financial success."
  },
  {
    id: 3,
    text: "For want of a nail, the kingdom was lost.",
    context: "A physical anchor reminding him that the massive Eternal organization remains acutely vulnerable to the slightest operational oversight."
  },
  {
    id: 4,
    text: "Leadership is leased, never owned.",
    context: "The willingness to detach personal ego from corporate titles. If you become a bottleneck, you must fire yourself."
  }
];

export default function FounderFlashcards() {
  const [cards, setCards] = useState(flashcards);

  const moveToEnd = () => {
    setCards((prev) => {
      const newCards = [...prev];
      const topCard = newCards.shift();
      if (topCard) newCards.push(topCard);
      return newCards;
    });
  };

  return (
    <div className="py-24 md:py-40 bg-surface relative border-b border-line overflow-hidden transition-colors duration-1000">
      <div className="absolute inset-0 grid-bg opacity-10"></div>
      
      {/* Ambient background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-zomato/5 rounded-full blur-[120px] pointer-events-none"></div>

      <div className="container mx-auto px-4 md:px-8 max-w-7xl relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">
        
        <div className="relative">
          <div className="inline-flex items-center gap-3 z-30 mb-8">
            <span className="w-2 h-2 rounded-full bg-zomato animate-pulse shadow-[0_0_10px_#E23744]"></span>
            <div className="hud-text text-xs border border-zomato/40 text-zomato bg-zomato/10 shadow-[0_0_15px_rgba(226,55,68,0.2)] px-4 py-2 backdrop-blur-sm rounded font-bold tracking-widest">
              THE PARADOX OF THE PARANOID FOUNDER
            </div>
          </div>

          <div className="flex items-center gap-4 mb-8">
             <BrainCircuit className="text-zomato drop-shadow-[0_0_10px_rgba(226,55,68,0.5)]" size={48} strokeWidth={1.5} />
             <h2 className="font-display text-5xl md:text-7xl font-bold tracking-tight text-gradient-zomato leading-[0.9] drop-shadow-[0_0_10px_rgba(226,55,68,0.2)]">
               Rewiring the <br/>Subconscious
             </h2>
          </div>
          
          <div className="relative">
            <div className="absolute -left-6 top-2 bottom-2 w-1 rounded-full bg-zomato/50 shadow-[0_0_10px_rgba(226,55,68,0.5)]"></div>
            <p className="font-mono text-lg md:text-xl text-muted/90 leading-relaxed mb-10 pl-0 border-l border-transparent">
              To combat the complacency of a billion-dollar net worth, Goyal utilizes handwritten flashcards kept bound by a rubber band next to his MacBook. They serve as constant, physical anchors to maintain an <span className="text-ink font-bold bg-line/20 px-1 rounded">"athlete mindset."</span>
            </p>
          </div>
          
          <div className="inline-flex items-center gap-3 hud-text text-sm md:text-base text-zomato group cursor-pointer border border-zomato/30 px-6 py-3 rounded-xl hover:bg-zomato/10 transition-colors shadow-[0_0_15px_rgba(226,55,68,0.1)] hover:shadow-[0_0_20px_rgba(226,55,68,0.2)] relative overflow-hidden" onClick={moveToEnd}>
            <div className="absolute inset-0 w-full h-full bg-white/10 -translate-x-full group-hover:animate-[scan_1s_ease-out] skew-x-12 blur-[1px]"></div>
            <Repeat size={16} className="group-hover:animate-spin-slow relative z-10" />
            <span className="tracking-[0.2em] relative z-10">CYCLE MENTAL DECK</span>
            <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform relative z-10" />
          </div>
        </div>

        <div className="relative h-[450px] md:h-[550px] flex items-center justify-center perspective-1000 mt-12 lg:mt-0 w-full">
          <AnimatePresence mode="popLayout">
            {cards.map((card, index) => {
              const isTop = index === 0;
              return (
                <motion.div
                  key={card.id}
                  layout
                  initial={{ opacity: 0, scale: 0.8, y: 50, rotateX: 20 }}
                  animate={{ 
                    opacity: 1 - index * 0.15, 
                    scale: 1 - index * 0.05, 
                    y: index * 25,
                    rotateX: 0,
                    zIndex: cards.length - index
                  }}
                  exit={{ opacity: 0, scale: 1.1, y: -100, rotateX: -20, filter: "blur(10px)" }}
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                  onClick={isTop ? moveToEnd : undefined}
                  className={`absolute w-full max-w-lg aspect-[4/3] rounded-3xl p-8 md:p-12 flex flex-col justify-between transition-all duration-500 border ${
                    isTop 
                      ? 'cursor-pointer glass border-zomato/40 shadow-[0_20px_50px_rgba(226,55,68,0.15)] hover:-translate-y-2 hover:shadow-[0_30px_60px_rgba(226,55,68,0.25)] bg-bg/80 backdrop-blur-2xl' 
                      : 'border-line/40 shadow-xl bg-surface/50 pointer-events-none'
                  }`}
                  style={{
                    transformOrigin: "top center",
                  }}
                >
                  <Quote className={`absolute top-6 right-6 md:top-8 md:right-8 transition-colors duration-500 ${isTop ? 'text-zomato opacity-20' : 'text-muted opacity-5'}`} size={64} />
                  
                  {isTop && (
                    <div className="absolute inset-0 bg-gradient-to-br from-zomato/10 to-transparent pointer-events-none rounded-3xl opacity-50"></div>
                  )}

                  <div className="relative z-10 w-full">
                    <div className="font-display text-3xl md:text-[2.5rem] font-bold text-ink leading-tight mb-8 tracking-tight">
                       "{card.text}"
                    </div>
                  </div>
                  
                  <div className={`relative z-10 font-mono text-sm md:text-base border-t pt-6 mt-auto flex justify-between items-end transition-colors duration-500 ${isTop ? 'border-zomato/30 text-ink/80' : 'border-line/50 text-muted/50'}`}>
                    <div className="max-w-[85%] leading-relaxed">{card.context}</div>
                    <div className="hud-text text-xs tracking-widest shrink-0 font-bold pb-1 flex gap-1">
                      <span className={isTop ? 'text-zomato' : 'text-muted/50'}>{(card.id).toString().padStart(2, '0')}</span>
                      <span className="text-muted/30">/</span>
                      <span className="text-muted/50">{(flashcards.length).toString().padStart(2, '0')}</span>
                    </div>
                  </div>
                  
                  {/* Subtle top glare/reflection line */}
                  {isTop && (
                     <div className="absolute top-0 left-0 right-0 h-[1.5px] bg-gradient-to-r from-transparent via-zomato/30 to-transparent pointer-events-none rounded-t-3xl"></div>
                  )}
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>

      </div>
    </div>
  );
}
