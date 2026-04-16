import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Package, AlertTriangle, Crosshair, Box, Activity, ShieldAlert } from 'lucide-react';

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
  const [displayTime, setDisplayTime] = useState('10:00');
  const [isGlitching, setIsGlitching] = useState(false);

  const requestRef = useRef<number>(0);
  const lastTimeRef = useRef<number>(0);
  const spawnTimerRef = useRef<number>(0);
  const gameElapsedRef = useRef<number>(0); // real ms elapsed during game
  
  // Game parameters
  const baseSpawnRate = 1200; // ms between spawns initially
  const minSpawnRate = 300; // fastest spawn rate
  const baseDecayRate = 15; // units per second
  
  const spawnConfetti = () => {
    const colors = ['#E23744', '#F8CB46', '#8A2BE2', '#2E8B57'];
    for (let i = 0; i < 30; i++) {
      const el = document.createElement('div');
      el.className = 'confetti-particle';
      el.style.left = Math.random() * 100 + 'vw';
      el.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
      el.style.animationDelay = Math.random() * 0.5 + 's';
      document.body.appendChild(el);
      setTimeout(() => el.remove(), 2500);
    }
  };

  const startGame = () => {
    setGameState('playing');
    setScore(0);
    setFriction(0);
    setOrders([]);
    setDisplayTime('10:00');
    setIsGlitching(false);
    lastTimeRef.current = performance.now();
    spawnTimerRef.current = 0;
    gameElapsedRef.current = 0;
    requestRef.current = requestAnimationFrame(gameLoop);
  };

  const stopGame = useCallback(() => {
    setGameState('gameover');
    cancelAnimationFrame(requestRef.current);
  }, []);

  const gameLoop = useCallback((time: number) => {
    if (gameState !== 'playing') return;

    const deltaTime = (time - lastTimeRef.current) / 1000;
    lastTimeRef.current = time;

    setOrders(prevOrders => {
      let newFriction = 0;
      
      const currentScore = score;
      const decayMultiplier = 1 + (currentScore * 0.05);
      
      const updatedOrders = prevOrders.map(order => ({
        ...order,
        timeLeft: order.timeLeft - (baseDecayRate * decayMultiplier * deltaTime)
      })).filter(order => {
        if (order.timeLeft <= 0) {
          newFriction += 25; 
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

    spawnTimerRef.current += deltaTime * 1000;
    
    requestRef.current = requestAnimationFrame(gameLoop);
  }, [gameState, score, stopGame]);

  const stateRef = useRef({ score: 0, friction: 0, orders: [] as Order[] });
  
  const tick = useCallback((time: number) => {
    if (gameState !== 'playing') return;

    const deltaTime = (time - lastTimeRef.current) / 1000;
    lastTimeRef.current = time;

    // Update elapsed time and countdown display (each real second = ~6 display seconds)
    gameElapsedRef.current += deltaTime * 1000;
    const displaySecondsElapsed = (gameElapsedRef.current / 1000) * 6;
    const totalDisplaySeconds = 600; // 10:00 in seconds
    const remainingDisplay = Math.max(0, totalDisplaySeconds - displaySecondsElapsed);
    const mins = Math.floor(remainingDisplay / 60);
    const secs = Math.floor(remainingDisplay % 60);
    setDisplayTime(`${mins}:${secs.toString().padStart(2, '0')}`);

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
      // Trigger glitch effect on failure
      setIsGlitching(true);
      setTimeout(() => setIsGlitching(false), 1000);
      // Spawn confetti if score is decent (10+ orders)
      if (currentState.score >= 10) {
        spawnConfetti();
      }
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

  const handleOrderClick = (id: string, e: React.MouseEvent) => {
    if (gameState !== 'playing') return;
    
    // Impact expanding ripple effect
    const btn = e.currentTarget as HTMLElement;
    const circle = document.createElement("span");
    const diameter = Math.max(btn.clientWidth, btn.clientHeight);
    const radius = diameter / 2;

    circle.style.width = circle.style.height = `${diameter}px`;
    circle.style.left = `${e.clientX - btn.getBoundingClientRect().left - radius}px`;
    circle.style.top = `${e.clientY - btn.getBoundingClientRect().top - radius}px`;
    circle.classList.add("ripple-effect");
    
    // Just simple ripple
    btn.appendChild(circle);
    setTimeout(() => circle.remove(), 500);

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
    <div className={`py-24 md:py-40 bg-bg relative border-b border-line overflow-hidden${isGlitching ? ' glitch-active' : ''}`}>
      {/* Dynamic Background */}
      <div className="absolute inset-0 grid-bg opacity-10 pointer-events-none"></div>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120vw] h-[120vw] bg-radial-gradient from-blinkit/5 directly-to-transparent opacity-30 pointer-events-none"></div>

      <style>{`
        .bg-radial-gradient { background: radial-gradient(circle, var(--tw-gradient-from) 0%, transparent 60%); }
        .ripple-effect {
          position: absolute;
          border-radius: 50%;
          transform: scale(0);
          animation: ripple 500ms linear;
          background-color: rgba(255, 255, 255, 0.7);
        }
        @keyframes ripple {
          to { transform: scale(4); opacity: 0; }
        }
        .scanning-line {
          animation: scan 4s linear infinite;
        }
        @keyframes scan {
          0% { transform: translateY(-100%); }
          100% { transform: translateY(1000%); }
        }
      `}</style>
      
      <div className="container mx-auto px-4 md:px-8 max-w-6xl relative z-10">
        
        {/* HUD Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-16 gap-6 border-b border-line/50 pb-8">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-2 h-2 rounded-full bg-blinkit animate-pulse shadow-[0_0_10px_#F8CB46]"></div>
              <span className="hud-text text-blinkit tracking-widest text-[10px]">INTERACTIVE PROTOCOL: LOGISTICS STRESS TEST</span>
            </div>
            <h2 className="font-display text-5xl md:text-7xl font-bold tracking-tight text-ink">
              The 10-Minute<br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blinkit to-white">Matrix</span>
            </h2>
          </div>
          <div className="max-w-md text-muted font-mono text-sm leading-relaxed glass p-6 border border-line/30 rounded-xl relative overflow-hidden">
            <div className="absolute right-0 top-0 w-16 h-16 bg-blinkit/10 blur-[30px]"></div>
            <Activity className="absolute right-4 top-4 text-line opacity-30" size={48} />
            Quick-commerce is a brutal optimization problem. Orders spawn rapidly. You have mere seconds to fulfill them before systemic friction permanently overloads the network grid.
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left: Telemetry & Controls */}
          <div className="lg:col-span-4 flex flex-col justify-center space-y-8 glass p-8 border border-line/50 rounded-2xl relative shadow-2xl">
            <div className="absolute top-0 left-4 w-12 h-[2px] bg-blinkit"></div>
            
            <div className="space-y-8">
              {/* Score HUD */}
              <div className="relative group">
                <div className="absolute -inset-1 bg-gradient-to-r from-blinkit/20 to-transparent blur-lg opacity-50"></div>
                <div className="relative flex flex-col pb-4 border-b border-line/50">
                  <div className="flex justify-between items-center font-mono text-xs mb-3 uppercase tracking-widest text-muted">
                    <span className="flex items-center gap-2"><Package size={14} className="text-blinkit"/> Orders Fulfilled</span>
                    <span className="text-blinkit font-bold text-lg bg-blinkit/10 px-2 rounded border border-blinkit/30">{score}</span>
                  </div>
                  <div className="h-2 w-full bg-surface rounded-full overflow-hidden border border-line/50">
                    <motion.div 
                      className="h-full bg-blinkit shadow-[0_0_10px_#F8CB46]" 
                      initial={{ width: "0%" }}
                      animate={{ width: `${Math.min(100, score * 2)}%` }}
                      transition={{ type: "spring", bounce: 0, duration: 0.5 }}
                    />
                  </div>
                </div>
              </div>

              {/* Friction HUD */}
              <div className="relative group">
                <div className="absolute -inset-1 bg-gradient-to-r from-zomato/20 to-transparent blur-lg opacity-50"></div>
                <div className="relative flex flex-col">
                  <div className="flex justify-between items-center font-mono text-xs mb-3 uppercase tracking-widest text-muted">
                    <span className="flex items-center gap-2"><AlertTriangle size={14} className="text-zomato"/> System Friction</span>
                    <span className="text-zomato font-bold text-lg bg-zomato/10 px-2 rounded border border-zomato/30">{Math.floor(friction)}%</span>
                  </div>
                  <div className="h-2 w-full bg-surface rounded-full overflow-hidden border border-line/50">
                    <motion.div 
                      className="h-full bg-zomato shadow-[0_0_10px_#E23744]" 
                      initial={{ width: "0%" }}
                      animate={{ width: `${friction}%` }}
                      transition={{ ease: "linear", duration: 0.2 }}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Countdown Clock */}
            {gameState === 'playing' && (
              <div className="relative flex flex-col items-center py-4 border border-blinkit/30 bg-blinkit/5 rounded-lg">
                <div className="font-mono text-[10px] uppercase tracking-widest text-blinkit/60 mb-1">Time Remaining</div>
                <div
                  className="font-display font-bold text-blinkit drop-shadow-[0_0_12px_#F8CB46]"
                  style={{ fontSize: '3rem', lineHeight: 1 }}
                >
                  {displayTime}
                </div>
              </div>
            )}

            {gameState === 'idle' && (
              <button
                onClick={() => {
                  stateRef.current = { score: 0, friction: 0, orders: [] };
                  startGame();
                }}
                className="mt-8 w-full py-5 bg-surface border border-blinkit hover:bg-blinkit text-blinkit hover:text-black font-bold uppercase tracking-[0.2em] transition-all duration-300 font-mono text-sm relative overflow-hidden group shadow-[0_0_15px_rgba(248,203,70,0.1)] hover:shadow-[0_0_30px_rgba(248,203,70,0.4)]"
              >
                <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:animate-[scan_1.5s_ease-in-out_infinite] skew-x-12"></div>
                Initiate Stress Test
              </button>
            )}
            {gameState === 'playing' && (
               <div className="mt-4 text-center border border-blinkit/20 bg-blinkit/5 py-4 font-mono text-xs text-blinkit animate-pulse flex items-center justify-center gap-2 tracking-widest">
                 <Activity size={16} /> SYSTEM ACTIVE
               </div>
            )}
          </div>

          {/* Right: The Game Grid (Radar Scope) */}
          <div className="lg:col-span-8 relative flex justify-center lg:justify-end">
            <div className="aspect-square w-full sm:w-[500px] border border-line/50 bg-black/40 relative p-4 backdrop-blur-md rounded-xl shadow-2xl overflow-hidden glass">
              
              {/* Radar Crosshairs */}
              <div className="absolute top-1/2 left-0 w-full h-[1px] bg-line/50 pointer-events-none"></div>
              <div className="absolute left-1/2 top-0 w-[1px] h-full bg-line/50 pointer-events-none"></div>
              <div className="absolute inset-0 border-[40px] border-surface/30 rounded-full mix-blend-overlay pointer-events-none pointer-events-none"></div>
              <div className="absolute inset-0 w-full h-[2px] bg-gradient-to-r from-transparent via-blinkit/50 to-transparent scanning-line pointer-events-none"></div>

              {/* Grid Background */}
              <div className="absolute inset-0 grid grid-cols-6 grid-rows-6 opacity-20 pointer-events-none p-4 gap-2">
                {Array.from({length: 36}).map((_, i) => (
                  <div key={i} className="border border-line rounded bg-surface/50"></div>
                ))}
              </div>

              {/* The Playable Area */}
              <div className="relative w-full h-full grid grid-cols-6 grid-rows-6 gap-2 z-10">
                {Array.from({length: 36}).map((_, i) => {
                  const order = orders.find(o => o.cellId === i);
                  const isCritical = order && order.timeLeft < 30;
                  return (
                    <div key={i} className="relative w-full h-full flex items-center justify-center">
                      <AnimatePresence>
                        {order && (
                          <motion.button
                            initial={{ scale: 0, rotate: -45 }}
                            animate={{ scale: 1, rotate: 0 }}
                            exit={{ scale: 0, opacity: 0 }}
                            onClick={(e) => handleOrderClick(order.id, e)}
                            className={`absolute inset-0 w-full h-full border rounded flex items-center justify-center cursor-crosshair group overflow-hidden transition-colors ${isCritical ? 'bg-zomato/10 border-zomato/50' : 'bg-surface border-line hover:border-blinkit/50'}`}
                            style={{
                              boxShadow: isCritical ? '0 0 20px rgba(226,55,68,0.3) inset' : 'none',
                            }}
                          >
                            {/* Radial time indicator */}
                            <div 
                              className="absolute bottom-0 left-0 w-full opacity-30 transition-all duration-75"
                              style={{ 
                                height: `${(order.timeLeft / order.maxTime) * 100}%`,
                                backgroundColor: isCritical ? 'var(--color-zomato)' : 'var(--color-blinkit)'
                              }}
                            ></div>
                            
                            {/* Icon overlay */}
                            <div className="relative z-10 flex flex-col items-center justify-center pointer-events-none">
                              {isCritical ? (
                                <ShieldAlert size={20} className="text-zomato group-hover:scale-110 transition-transform animate-pulse"/>
                              ) : (
                                <Box size={20} className="text-muted group-hover:text-blinkit group-hover:scale-110 transition-all"/>
                              )}
                              <span className={`font-mono text-[10px] sm:text-xs font-bold mt-1 tracking-tighter ${isCritical ? 'text-zomato' : 'text-inka/80'}`}>
                                {Math.ceil(order.timeLeft / 10)}s
                              </span>
                            </div>

                            {/* Corner brackets for aesthetic */}
                            <div className="absolute top-1 left-1 w-2 h-2 border-t border-l border-white/20"></div>
                            <div className="absolute bottom-1 right-1 w-2 h-2 border-b border-r border-white/20"></div>
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
                    initial={{ opacity: 0, backdropFilter: "blur(0px)" }}
                    animate={{ opacity: 1, backdropFilter: "blur(10px)" }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 z-50 bg-black/80 flex flex-col items-center justify-center p-8 text-center border-2 border-zomato/50 rounded-xl"
                  >
                    <Crosshair size={48} className="text-zomato mb-6 animate-[spin_4s_linear_infinite] opacity-50" />
                    
                    <div className="hud-text text-zomato text-xl mb-4 animate-[pulse_0.5s_infinite] tracking-widest bg-zomato/20 px-4 py-1 rounded">CRITICAL NETWORK FAILURE</div>
                    <div className="font-display text-7xl font-bold mb-2 text-white glow-effect">{score}</div>
                    <div className="font-mono text-sm text-zomato/80 mb-8 border-b border-zomato/30 pb-4">ORDERS FULFILLED BEFORE MELTDOWN</div>
                    
                    <p className="font-mono text-xs md:text-sm text-muted/80 max-w-sm mb-8 leading-relaxed">
                      "The market doesn't care about your effort, only your execution.<br/>If you can't handle the velocity, someone else will."
                    </p>

                    <button 
                      onClick={() => {
                        stateRef.current = { score: 0, friction: 0, orders: [] };
                        startGame();
                      }}
                      className="px-8 py-3 bg-zomato/10 border border-zomato hover:bg-zomato text-zomato hover:text-white transition-all font-mono text-sm uppercase tracking-[0.3em] group relative overflow-hidden"
                    >
                      <div className="absolute inset-0 w-full h-full bg-white/20 -translate-x-full group-hover:translate-x-full transition-transform duration-500 skew-x-12"></div>
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
