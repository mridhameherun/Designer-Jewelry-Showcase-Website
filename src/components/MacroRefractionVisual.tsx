import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { Sparkles, Sun, Play, Pause } from 'lucide-react';

interface MacroRefractionVisualProps {
  onExploreCustom: () => void;
}

export const MacroRefractionVisual: React.FC<MacroRefractionVisualProps> = ({ onExploreCustom }) => {
  const [activeScene, setActiveScene] = useState<'pave' | 'sunlit'>('pave');
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const primaryFrameRef = useRef<HTMLDivElement | null>(null);
  const captionRef = useRef<HTMLDivElement | null>(null);
  const ovalFrameRef = useRef<HTMLButtonElement | null>(null);
  const hallmarkCardRef = useRef<HTMLDivElement | null>(null);

  // Auto-transition between Scene 1 (Macro Pavé Diamond Refraction) and Scene 2 (Sunlit Layered 18k Gold)
  useEffect(() => {
    if (!isPlaying) return;
    const timer = window.setInterval(() => {
      setActiveScene((prev) => (prev === 'pave' ? 'sunlit' : 'pave'));
    }, 6500);
    return () => window.clearInterval(timer);
  }, [isPlaying]);

  // GSAP Entrance & Interactive 3D Perspective Tilt on Primary Hero Frame
  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    const ctx = gsap.context(() => {
      if (primaryFrameRef.current) {
        gsap.fromTo(
          primaryFrameRef.current,
          { clipPath: 'inset(14% 14% 14% 14%)', opacity: 0, scale: 0.96 },
          {
            clipPath: 'inset(0% 0% 0% 0%)',
            opacity: 1,
            scale: 1,
            duration: 1.5,
            ease: 'expo.out',
            delay: 0.2,
          }
        );
      }

      if (ovalFrameRef.current) {
        gsap.fromTo(
          ovalFrameRef.current,
          { scale: 0.82, opacity: 0, y: 28 },
          {
            scale: 1,
            opacity: 1,
            y: 0,
            duration: 1.3,
            ease: 'back.out(1.4)',
            delay: 0.45,
          }
        );
      }

      if (hallmarkCardRef.current) {
        gsap.fromTo(
          hallmarkCardRef.current,
          { y: 32, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 1.1,
            ease: 'power3.out',
            delay: 0.6,
          }
        );
      }
    });

    return () => ctx.revert();
  }, []);

  // Animate caption text when switching between 'pave' and 'sunlit'
  useEffect(() => {
    if (!captionRef.current) return;
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    gsap.fromTo(
      captionRef.current,
      { y: 14, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.65, ease: 'power3.out' }
    );
  }, [activeScene]);

  const handleFrameMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const frame = primaryFrameRef.current;
    if (!frame) return;
    const rect = frame.getBoundingClientRect();
    const relX = (e.clientX - rect.left) / rect.width - 0.5;
    const relY = (e.clientY - rect.top) / rect.height - 0.5;

    gsap.to(frame, {
      rotateY: relX * 7,
      rotateX: -relY * 7,
      transformPerspective: 900,
      duration: 0.6,
      ease: 'power2.out',
    });
  };

  const handleFrameMouseLeave = () => {
    if (!primaryFrameRef.current) return;
    gsap.to(primaryFrameRef.current, {
      rotateY: 0,
      rotateX: 0,
      duration: 0.9,
      ease: 'elastic.out(1, 0.5)',
    });
  };

  // Subtle slow-motion optical dispersion & caustic light refraction canvas overlay
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId = 0;
    const startTime = performance.now();

    const flares = [
      { x: 0.34, y: 0.62, r: 42, speed: 0.0007, phase: 0.2, hue: 42 },
      { x: 0.48, y: 0.56, r: 58, speed: 0.0009, phase: 1.5, hue: 205 },
      { x: 0.62, y: 0.68, r: 36, speed: 0.0006, phase: 2.8, hue: 38 },
      { x: 0.28, y: 0.74, r: 32, speed: 0.0008, phase: 4.1, hue: 255 },
      { x: 0.74, y: 0.32, r: 48, speed: 0.0005, phase: 5.0, hue: 45 },
    ];

    const renderFrame = (now: number) => {
      const elapsed = now - startTime;
      const w = canvas.width;
      const h = canvas.height;
      ctx.clearRect(0, 0, w, h);

      // Draw gentle spectral refraction rays & diamond fire glints
      flares.forEach((f, idx) => {
        const pulse = 0.5 + 0.5 * Math.sin(elapsed * f.speed + f.phase);
        const cx = f.x * w + Math.cos(elapsed * 0.0004 + idx) * 14;
        const cy = f.y * h + Math.sin(elapsed * 0.0005 + idx) * 10;
        const radius = f.r * (0.75 + pulse * 0.45);

        const grad = ctx.createRadialGradient(cx, cy, 1, cx, cy, radius);
        if (activeScene === 'pave') {
          grad.addColorStop(0, 'rgba(255, 253, 245, 0.75)');
          grad.addColorStop(0.35, `hsla(${f.hue}, 85%, 78%, ${0.28 * pulse})`);
          grad.addColorStop(1, 'rgba(255, 255, 255, 0)');
        } else {
          grad.addColorStop(0, 'rgba(252, 244, 214, 0.55)');
          grad.addColorStop(0.45, `rgba(213, 180, 115, ${0.22 * pulse})`);
          grad.addColorStop(1, 'rgba(252, 249, 235, 0)');
        }

        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(cx, cy, radius, 0, Math.PI * 2);
        ctx.fill();

        // Draw crisp 4-point star facet glint at peak refraction
        if (pulse > 0.62) {
          const starLen = 10 + pulse * 14;
          ctx.strokeStyle = `rgba(255, 252, 240, ${(pulse - 0.5) * 0.9})`;
          ctx.lineWidth = 1.1;
          ctx.beginPath();
          ctx.moveTo(cx - starLen, cy);
          ctx.lineTo(cx + starLen, cy);
          ctx.moveTo(cx, cy - starLen);
          ctx.lineTo(cx, cy + starLen);
          ctx.stroke();
        }
      });

      if (isPlaying) {
        animId = window.requestAnimationFrame(renderFrame);
      }
    };

    renderFrame(performance.now());
    return () => {
      if (animId) window.cancelAnimationFrame(animId);
    };
  }, [activeScene, isPlaying]);

  return (
    <div className="relative w-full h-full flex flex-col justify-between select-none">
      {/* Main Editorial Visual Composition with Generous Breathing Room */}
      <div className="relative w-full grid grid-cols-12 gap-6 lg:gap-8 items-stretch">
        {/* Primary Macro / Editorial Frame with 3D GSAP Tilt */}
        <div
          ref={primaryFrameRef}
          onMouseMove={handleFrameMouseMove}
          onMouseLeave={handleFrameMouseLeave}
          className="col-span-12 sm:col-span-8 relative overflow-hidden bg-[#1B1A1C] border border-[#242325]/10 h-[440px] sm:h-[520px] will-change-transform"
        >
          {/* Scene 1: Macro Slow-Motion Pavé Diamond Band Refraction */}
          <img
            src="assets/jewelry/rings-stone.png?v=2"
            alt="Macro 18k solid gold and pavé diamond rings on travertine stone refracting natural light"
            referrerPolicy="no-referrer"
            className={`absolute inset-0 w-full h-full object-cover transition-all duration-1000 ease-out ${
              activeScene === 'pave'
                ? 'opacity-100 scale-100 animate-ken-burns'
                : 'opacity-0 scale-105 pointer-events-none'
            }`}
          />

          {/* Scene 2: Candid Sunlit Shot of Woman Wearing Layered 18k Gold Necklaces */}
          <img
            src="assets/jewelry/layered-necklaces.png?v=2"
            alt="Candid sunlit portrait of a woman wearing layered 18k solid gold necklaces"
            referrerPolicy="no-referrer"
            className={`absolute inset-0 w-full h-full object-cover object-center transition-all duration-1000 ease-out ${
              activeScene === 'sunlit'
                ? 'opacity-100 scale-100 animate-ken-burns'
                : 'opacity-0 scale-105 pointer-events-none'
            }`}
          />

          {/* Optical Dispersion & Caustic Light Refraction Canvas */}
          <canvas
            ref={canvasRef}
            width={520}
            height={520}
            aria-hidden="true"
            className="absolute inset-0 w-full h-full pointer-events-none mix-blend-screen"
          />

          {/* Subtle Bottom Contrast Scrim for Caption */}
          <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-[#161517]/90 via-[#161517]/40 to-transparent p-6 sm:p-8 flex items-end justify-between gap-4">
            <div ref={captionRef} className="space-y-1.5">
              <p className="font-tabular-mono text-[11px] tracking-[0.18em] uppercase text-[#D5C096]">
                {activeScene === 'pave'
                  ? '01 / Macro Optical Refraction'
                  : '02 / Golden Hour Ritual'}
              </p>
              <p className="text-sm text-[#FCF9EB]/95 font-light leading-relaxed max-w-sm">
                {activeScene === 'pave'
                  ? 'Top 1% GIA-certified cut engineered for maximum dispersion and fire.'
                  : 'Waterproof, tarnish-free 750‰ solid gold forged for everyday permanence.'}
              </p>
            </div>
          </div>
        </div>

        {/* Secondary Oval Inset & Architectural Spec Column */}
        <div className="col-span-12 sm:col-span-4 flex sm:flex-col justify-between gap-6 h-full">
          {/* Oval Sculptural Cutout Frame */}
          <button
            ref={ovalFrameRef}
            type="button"
            onClick={() => setActiveScene(activeScene === 'pave' ? 'sunlit' : 'pave')}
            aria-label="Switch hero visual perspective between macro diamond pavé and sunlit layered gold necklaces"
            className="group relative w-1/2 sm:w-full aspect-[4/5] rounded-full overflow-hidden border border-[#242325]/15 bg-[#242325] focus-visible:outline-2 focus-visible:outline-[#4732D4] transition-transform duration-300 hover:scale-[1.02] cursor-pointer"
          >
            <img
              src={
                activeScene === 'pave'
                  ? 'assets/jewelry/layered-necklaces.png?v=2'
                  : 'assets/jewelry/eternity-pave-rings.png?v=2'
              }
              alt="Preview alternate perspective"
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-[#242325]/20 group-hover:bg-transparent transition-colors flex items-center justify-center p-4">
              <span className="px-3.5 py-1.5 rounded-full bg-[#FDFBF7]/95 text-[#242325] text-[11px] tracking-widest uppercase font-medium shadow-xs">
                {activeScene === 'pave' ? 'Sunlit Stack' : 'Macro Pavé'}
              </span>
            </div>
          </button>

          {/* Clean Hallmark Card */}
          <div
            ref={hallmarkCardRef}
            className="w-1/2 sm:w-full bg-[#F7F3E8] border border-[#242325]/10 p-6 flex flex-col justify-between flex-1"
          >
            <div className="flex items-center justify-between gap-2">
              <span className="font-tabular-mono text-xs tracking-[0.16em] uppercase text-[#242325]/80">
                18K · 750‰
              </span>
              <button
                type="button"
                onClick={onExploreCustom}
                className="w-9 h-9 rounded-full bg-[#242325] text-[#FDFBF7] flex items-center justify-center text-[11px] font-tabular-mono tracking-wider transition-transform duration-200 hover:scale-105 cursor-pointer"
                aria-label="Open 3D Bespoke Ring Studio"
                title="3D CAD Studio"
              >
                3D
              </button>
            </div>
            <p className="text-xs text-[#242325]/75 font-light leading-relaxed my-4">
              Every diamond passes a 40x microscopic inspection; 99% of stones inspected are rejected.
            </p>
            <div className="pt-3 border-t border-[#242325]/10 flex items-center justify-between text-[10px] font-tabular-mono tracking-widest text-[#242325]/70">
              <span>GIA TOP 1%</span>
              <span>·</span>
              <span>RJC AUDITED</span>
            </div>
          </div>
        </div>
      </div>

      {/* Interactive Visual Cue Controls Bar */}
      <div className="mt-6 pt-5 border-t border-[#242325]/10 flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-2.5">
          <button
            type="button"
            onClick={() => setActiveScene('pave')}
            className={`px-4 py-2 rounded-full text-xs tracking-wider uppercase transition-all whitespace-nowrap shrink-0 flex items-center gap-2 cursor-pointer ${
              activeScene === 'pave'
                ? 'bg-[#242325] text-[#FDFBF7]'
                : 'border border-[#242325]/25 text-[#242325]/80 hover:border-[#242325]'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            Macro Pavé Refraction
          </button>
          <button
            type="button"
            onClick={() => setActiveScene('sunlit')}
            className={`px-4 py-2 rounded-full text-xs tracking-wider uppercase transition-all whitespace-nowrap shrink-0 flex items-center gap-2 cursor-pointer ${
              activeScene === 'sunlit'
                ? 'bg-[#242325] text-[#FDFBF7]'
                : 'border border-[#242325]/25 text-[#242325]/80 hover:border-[#242325]'
            }`}
          >
            <Sun className="w-3.5 h-3.5" />
            Sunlit Layered 18k Gold
          </button>
        </div>

        <button
          type="button"
          onClick={() => setIsPlaying((p) => !p)}
          aria-label={isPlaying ? 'Pause slow-motion visual transition' : 'Play slow-motion visual transition'}
          className="px-4 py-2 rounded-full border border-[#242325]/25 text-xs text-[#242325]/80 hover:bg-[#242325] hover:text-[#FDFBF7] transition-colors flex items-center gap-2 whitespace-nowrap shrink-0 cursor-pointer"
        >
          {isPlaying ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3" />}
          <span>{isPlaying ? 'Auto-Transition On' : 'Paused'}</span>
        </button>
      </div>
    </div>
  );
};
