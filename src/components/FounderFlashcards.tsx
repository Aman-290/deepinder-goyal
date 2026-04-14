import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';

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
    <div className="py-32 bg-bg relative border-b border-line overflow-hidden">
      <div className="absolute inset-0 grid-bg opacity-10"></div>
      
      <div className="container mx-auto px-4 md:px-8 max-w-7xl relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        
        <div>
          <div className="hud-text text-xs text-muted border border-line inline-block px-3 py-1 bg-surface/50 mb-8">
            THE PARADOX OF THE PARANOID FOUNDER
          </div>
          <h2 className="font-display text-5xl md:text-7xl font-bold mb-8 tracking-tight">
            Rewiring the <br/>Subconscious
          </h2>
          <p className="font-mono text-lg md:text-xl text-muted leading-relaxed mb-8">
            To combat the complacency of a billion-dollar net worth, Goyal utilizes handwritten flashcards kept bound by a rubber band next to his MacBook. They serve as constant, physical anchors to maintain an "athlete mindset."
          </p>
          <div className="hud-text text-sm text-zomato animate-pulse">
            CLICK CARDS TO CYCLE DECK &gt;
          </div>
        </div>

        <div className="relative h-[400px] md:h-[500px] flex items-center justify-center perspective-1000">
          <AnimatePresence mode="popLayout">
            {cards.map((card, index) => {
              const isTop = index === 0;
              return (
                <motion.div
                  key={card.id}
                  layout
                  initial={{ opacity: 0, scale: 0.8, y: 50 }}
                  animate={{ 
                    opacity: 1 - index * 0.2, 
                    scale: 1 - index * 0.05, 
                    y: index * 20,
                    zIndex: cards.length - index
                  }}
                  exit={{ opacity: 0, scale: 1.1, y: -50 }}
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  onClick={isTop ? moveToEnd : undefined}
                  className={`absolute w-full max-w-md aspect-[4/3] border border-line bg-surface p-8 md:p-12 flex flex-col justify-center shadow-2xl ${isTop ? 'cursor-pointer hover:border-zomato/50' : 'pointer-events-none'}`}
                  style={{
                    transformOrigin: "top center",
                  }}
                >
                  <div className="font-display text-3xl md:text-4xl font-bold text-ink mb-6 leading-tight">
                    "{card.text}"
                  </div>
                  <div className="font-mono text-sm md:text-base text-muted border-t border-line/50 pt-6 mt-auto">
                    {card.context}
                  </div>
                  
                  {isTop && (
                    <div className="absolute top-4 right-4 hud-text text-xs text-line">
                      {card.id} / {flashcards.length}
                    </div>
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
