// src/components/PortraitSection.tsx
import { useRef, useEffect, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function PortraitSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const nameRef = useRef<HTMLHeadingElement>(null);
  const metaRef = useRef<HTMLDivElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);
  const lineLeftRef = useRef<HTMLDivElement>(null);
  const lineRightRef = useRef<HTMLDivElement>(null);
  const [imageLoaded, setImageLoaded] = useState(false);

  useEffect(() => {
    if (!sectionRef.current) return;

    const ctx = gsap.context(() => {
      // Name reveal — characters animate in
      if (nameRef.current) {
        const chars = nameRef.current.querySelectorAll('.char');
        gsap.from(chars, {
          y: 80,
          opacity: 0,
          rotateX: -90,
          stagger: 0.04,
          duration: 1,
          ease: 'power4.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 60%',
            toggleActions: 'play none none reverse',
          },
        });
      }

      // Image parallax
      if (imgRef.current) {
        gsap.to(imgRef.current, {
          yPercent: -10,
          ease: 'none',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top bottom',
            end: 'bottom top',
            scrub: true,
          },
        });
      }

      // Horizontal lines expand outward
      gsap.from(lineLeftRef.current, {
        scaleX: 0,
        transformOrigin: 'right center',
        duration: 1.2,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 55%',
          toggleActions: 'play none none reverse',
        },
      });
      gsap.from(lineRightRef.current, {
        scaleX: 0,
        transformOrigin: 'left center',
        duration: 1.2,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 55%',
          toggleActions: 'play none none reverse',
        },
      });

      // Meta text fades up
      if (metaRef.current) {
        gsap.from(metaRef.current.children, {
          y: 30,
          opacity: 0,
          stagger: 0.12,
          duration: 0.8,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: metaRef.current,
            start: 'top 80%',
            toggleActions: 'play none none reverse',
          },
        });
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const firstName = 'DEEPINDER';
  const lastName = 'GOYAL';

  return (
    <section
      ref={sectionRef}
      className="relative flex flex-col items-center justify-center py-12 md:py-16 overflow-hidden"
    >
      {/* Subtle radial glow behind the text */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div
          className="w-[800px] h-[400px]"
          style={{
            background: 'radial-gradient(ellipse, rgba(226,55,68,0.06) 0%, transparent 70%)',
          }}
        />
      </div>

      {/* Portrait image — shown if available */}
      {imageLoaded && (
        <div className="relative w-48 h-48 md:w-64 md:h-64 rounded-full overflow-hidden mb-6 border border-white/10">
          <img
            ref={imgRef}
            src="/deepinder-hero-portrait.png"
            alt="Deepinder Goyal"
            className="w-full h-[120%] object-cover object-top"
          />
        </div>
      )}

      {/* Hidden image loader */}
      <img
        src="/deepinder-hero-portrait.png"
        alt=""
        className="hidden"
        onLoad={() => setImageLoaded(true)}
        onError={() => setImageLoaded(false)}
      />

      {/* Main name display — always shown, smaller when image is present */}
      <div className="relative text-center">
        <h2
          ref={nameRef}
          className="font-display font-bold tracking-tight leading-none select-none"
        >
          <span
            className={`block ${imageLoaded ? 'text-4xl md:text-6xl lg:text-7xl' : 'text-6xl md:text-8xl lg:text-[10rem]'} text-white/90`}
            style={{ perspective: '600px' }}
          >
            {firstName.split('').map((char, i) => (
              <span key={i} className="char inline-block" style={{ transformStyle: 'preserve-3d' }}>
                {char}
              </span>
            ))}
          </span>
          <span
            className={`block ${imageLoaded ? 'text-5xl md:text-7xl lg:text-8xl' : 'text-7xl md:text-9xl lg:text-[12rem]'} text-gradient mt-[-0.1em]`}
            style={{ perspective: '600px' }}
          >
            {lastName.split('').map((char, i) => (
              <span key={i} className="char inline-block" style={{ transformStyle: 'preserve-3d' }}>
                {char}
              </span>
            ))}
          </span>
        </h2>
      </div>

      {/* Decorative lines */}
      <div className="flex items-center gap-6 mt-6 w-full max-w-3xl px-8">
        <div ref={lineLeftRef} className="flex-1 h-px bg-gradient-to-l from-zomato/40 to-transparent" />
        <div className="w-2 h-2 rotate-45 border border-zomato/60" />
        <div ref={lineRightRef} className="flex-1 h-px bg-gradient-to-r from-zomato/40 to-transparent" />
      </div>

      {/* Meta information */}
      <div ref={metaRef} className="text-center mt-6 space-y-2">
        <p className="hud-text text-muted tracking-[0.25em] text-sm">
          FOUNDER & CEO // ETERNAL LIMITED
        </p>
        <p className="hud-text text-muted/30 text-[10px] tracking-[0.35em]">
          IIT DELHI M.TECH '05 &nbsp;·&nbsp; ZOMATO '08 &nbsp;·&nbsp; NEW DELHI, INDIA
        </p>
        <p className="hud-text text-muted/20 text-[10px] tracking-[0.3em] mt-3">
          28.6139°N &nbsp; 77.2090°E
        </p>
      </div>
    </section>
  );
}
