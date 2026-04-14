import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';

interface Order {
  id: string;
  cellId: number;
  timeLeft: number;
  maxTime: number;
}

export default function DeliveryMatrixGame() {
  const [gameState, setGameState] = useState<'idle' | 'playing' | 'gameover'>('idle');
  const [score, setScore] = useState(0);
  const [friction, setFriction] = useState(0);
  const [orders, setOrders] = useState<Order[]>([]);
  
  const requestRef = useRef<number>(0);
  const lastTimeRef = useRef<number>(0);
  const spawnTimerRef = useRef<number>(0);
  
  // Game parameters
  const baseSpawnRate = 1200; // ms between spawns initially
  const minSpawnRate = 300; // fastest spawn rate
  const baseDecayRate = 15; // units per second
  
  const startGame = () => {
    setGameState('playing');
    setScore(0);
    setFriction(0);
    setOrders([]);
    lastTimeRef.current = performance.now();
    spawnTimerRef.current = 0;
    requestRef.current = requestAnimationFrame(gameLoop);
  };

  const stopGame = useCallback(() => {
    setGameState('gameover');
    cancelAnimationFrame(requestRef.current);
  }, []);

  const gameLoop = useCallback((time: number) => {
    if (gameState !== 'playing') return;

    const deltaTime = (time - lastTimeRef.current) / 1000; // in seconds
    lastTimeRef.current = time;

    setOrders(prevOrders => {
      let newFriction = 0;
      
      // Update existing orders
      const currentScore = score; // We need a ref for score if we want exact scaling, but let's approximate
      const decayMultiplier = 1 + (currentScore * 0.05); // Speeds up as score increases
      
      const updatedOrders = prevOrders.map(order => ({
        ...order,
        timeLeft: order.timeLeft - (baseDecayRate * decayMultiplier * deltaTime)
      })).filter(order => {
        if (order.timeLeft <= 0) {
          newFriction += 25; // 4 missed orders = game over
          return false;
        }
        return true;
      });

      if (newFriction > 0) {
        setFriction(f => {
          const nextFriction = f + newFriction;
          if (nextFriction >= 100) {
            stopGame();
          }
          return Math.min(nextFriction, 100);
        });
      }

      return updatedOrders;
    });

    // Handle Spawning
    spawnTimerRef.current += deltaTime * 1000;
    // Calculate current spawn rate based on score (needs to be accessed via state, but we'll use a ref or just calculate it)
    // To avoid stale state in requestAnimationFrame, we can use a functional state update or just let the effect re-bind.
    // Actually, since gameLoop is in useCallback without score dependency, `score` is stale. 
    // Let's use a ref for the mutable game state to keep the loop clean.
    
    requestRef.current = requestAnimationFrame(gameLoop);
  }, [gameState, score, stopGame]);

  // Re-bind the game loop when score changes so we have fresh state, 
  // or better yet, use a ref for the entire game state.
  const stateRef = useRef({ score: 0, friction: 0, orders: [] as Order[] });
  
  // Let's rewrite the loop using stateRef for perfect sync
  const tick = useCallback((time: number) => {
    if (gameState !== 'playing') return;
    
    const deltaTime = (time - lastTimeRef.current) / 1000;
    lastTimeRef.current = time;
    
    const currentState = stateRef.current;
    let newFriction = currentState.friction;
    
    // Decay
    const decayMultiplier = 1 + (currentState.score * 0.05);
    const nextOrders = currentState.orders.map(o => ({
      ...o,
      timeLeft: o.timeLeft - (baseDecayRate * decayMultiplier * deltaTime)
    })).filter(o => {
      if (o.timeLeft <= 0) {
        newFriction += 25;
        return false;
      }
      return true;
    });
    
    // Spawn
    spawnTimerRef.current += deltaTime * 1000;
    const currentSpawnRate = Math.max(minSpawnRate, baseSpawnRate - (currentState.score * 30));
    
    if (spawnTimerRef.current >= currentSpawnRate && nextOrders.length < 20) {
      spawnTimerRef.current = 0;
      const availableCells = Array.from({length: 36}, (_, i) => i).filter(
        i => !nextOrders.some(o => o.cellId === i)
      );
      
      if (availableCells.length > 0) {
        const randomCell = availableCells[Math.floor(Math.random() * availableCells.length)];
        nextOrders.push({
          id: Math.random().toString(36).substr(2, 9),
          cellId: randomCell,
          timeLeft: 100,
          maxTime: 100
        });
      }
    }
    
    // Check Game Over
    if (newFriction >= 100) {
      newFriction = 100;
      setGameState('gameover');
    }
    
    // Update Refs & State
    stateRef.current = { ...currentState, friction: newFriction, orders: nextOrders };
    setFriction(newFriction);
    setOrders(nextOrders);
    
    if (newFriction < 100) {
      requestRef.current = requestAnimationFrame(tick);
    }
  }, [gameState]);

  useEffect(() => {
    if (gameState === 'playing') {
      lastTimeRef.current = performance.now();
      requestRef.current = requestAnimationFrame(tick);
    }
    return () => cancelAnimationFrame(requestRef.current);
  }, [gameState, tick]);

  const handleOrderClick = (id: string) => {
    if (gameState !== 'playing') return;
    
    stateRef.current.orders = stateRef.current.orders.filter(o => o.id !== id);
    stateRef.current.score += 1;
    
    setOrders(stateRef.current.orders);
    setScore(stateRef.current.score);
    
    // Small friction recovery for good performance
    if (stateRef.current.friction > 0) {
      stateRef.current.friction = Math.max(0, stateRef.current.friction - 2);
      setFriction(stateRef.current.friction);
    }
  };

  return (
    <div className="py-32 bg-surface relative border-b border-line overflow-hidden">
      <div className="absolute inset-0 grid-bg opacity-10"></div>
      
      <div className="container mx-auto px-4 md:px-8 max-w-5xl relative z-10">
        <div className="hud-text text-xs text-muted border border-line inline-block px-3 py-1 bg-bg mb-12">
          INTERACTIVE PROTOCOL: LOGISTICS STRESS TEST
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          
          {/* Left: Instructions & Stats */}
          <div className="lg:col-span-1 flex flex-col justify-center space-y-8">
            <div>
              <h2 className="font-display text-4xl md:text-5xl font-bold mb-4 tracking-tight">
                The 10-Minute <br/>Matrix
              </h2>
              <p className="font-mono text-sm text-muted leading-relaxed">
                Quick-commerce is a brutal optimization problem. Orders spawn rapidly. You have seconds to fulfill them before systemic friction overloads the network.
              </p>
            </div>

            <div className="space-y-6 border border-line bg-bg p-6">
              <div>
                <div className="flex justify-between font-mono text-xs mb-2">
                  <span className="text-muted">ORDERS FULFILLED</span>
                  <span className="text-blinkit font-bold">{score}</span>
                </div>
                <div className="h-2 bg-line overflow-hidden">
                  <div className="h-full bg-blinkit transition-all" style={{ width: `${Math.min(100, score * 2)}%` }}></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between font-mono text-xs mb-2">
                  <span className="text-muted">SYSTEM FRICTION</span>
                  <span className="text-zomato font-bold">{Math.floor(friction)}%</span>
                </div>
                <div className="h-2 bg-line overflow-hidden">
                  <div className="h-full bg-zomato transition-all" style={{ width: `${friction}%` }}></div>
                </div>
              </div>
            </div>

            {gameState === 'idle' && (
              <button 
                onClick={() => {
                  stateRef.current = { score: 0, friction: 0, orders: [] };
                  startGame();
                }}
                className="w-full py-4 bg-blinkit text-black font-bold uppercase tracking-widest hover:bg-yellow-400 transition-colors font-mono text-sm"
              >
                Initiate Stress Test
              </button>
            )}
          </div>

          {/* Right: The Game Grid */}
          <div className="lg:col-span-2 relative">
            <div className="aspect-square md:aspect-[4/3] w-full border border-line bg-bg relative p-4 md:p-8">
              
              {/* Grid Background Lines */}
              <div className="absolute inset-0 grid grid-cols-6 grid-rows-6 opacity-20 pointer-events-none">
                {Array.from({length: 36}).map((_, i) => (
                  <div key={i} className="border border-line"></div>
                ))}
              </div>

              {/* The Playable Area */}
              <div className="relative w-full h-full grid grid-cols-6 grid-rows-6 gap-2 md:gap-4 z-10">
                {Array.from({length: 36}).map((_, i) => {
                  const order = orders.find(o => o.cellId === i);
                  return (
                    <div key={i} className="relative w-full h-full flex items-center justify-center">
                      <AnimatePresence>
                        {order && (
                          <motion.button
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            exit={{ scale: 0, opacity: 0 }}
                            onClick={() => handleOrderClick(order.id)}
                            className="absolute inset-0 w-full h-full bg-surface border-2 flex items-center justify-center cursor-crosshair group overflow-hidden"
                            style={{
                              borderColor: order.timeLeft > 50 ? 'var(--color-blinkit)' : 'var(--color-zomato)',
                              boxShadow: order.timeLeft > 50 ? '0 0 15px rgba(248,203,70,0.2)' : '0 0 15px rgba(226,55,68,0.4)',
                            }}
                          >
                            {/* Shrinking background to represent time */}
                            <div 
                              className="absolute bottom-0 left-0 w-full opacity-20 transition-all duration-75"
                              style={{ 
                                height: `${(order.timeLeft / order.maxTime) * 100}%`,
                                backgroundColor: order.timeLeft > 50 ? 'var(--color-blinkit)' : 'var(--color-zomato)'
                              }}
                            ></div>
                            <span className="font-mono text-xs md:text-sm font-bold relative z-10 group-hover:scale-110 transition-transform"
                                  style={{ color: order.timeLeft > 50 ? 'var(--color-blinkit)' : 'var(--color-zomato)' }}>
                              {Math.ceil(order.timeLeft / 10)}s
                            </span>
                          </motion.button>
                        )}
                      </AnimatePresence>
                    </div>
                  );
                })}
              </div>

              {/* Game Over Overlay */}
              <AnimatePresence>
                {gameState === 'gameover' && (
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="absolute inset-0 z-20 bg-bg/90 backdrop-blur-sm flex flex-col items-center justify-center p-8 text-center border border-zomato"
                  >
                    <div className="hud-text text-zomato text-xl mb-4 animate-pulse">SYSTEM HALTED</div>
                    <div className="font-display text-6xl font-bold mb-2">{score}</div>
                    <div className="font-mono text-sm text-muted mb-8">ORDERS FULFILLED BEFORE FAILURE</div>
                    
                    <div className="border-t border-b border-line py-6 mb-8 max-w-md">
                      <p className="font-mono text-sm italic text-ink/80">
                        "The market doesn't care about your effort, only your execution. If you can't handle the velocity, someone else will."
                      </p>
                    </div>

                    <button 
                      onClick={() => {
                        stateRef.current = { score: 0, friction: 0, orders: [] };
                        startGame();
                      }}
                      className="px-8 py-3 bg-surface border border-line hover:border-blinkit hover:text-blinkit transition-colors font-mono text-sm uppercase tracking-widest"
                    >
                      Reboot System
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>

            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
