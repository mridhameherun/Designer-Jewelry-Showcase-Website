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
      rotateY: relX * 8,
      rotateX: -relY * 8,
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
      { x: 0.34, y: 0.62, r: 48, speed: 0.0007, phase: 0.2, hue: 42 },
      { x: 0.48, y: 0.56, r: 64, speed: 0.0009, phase: 1.5, hue: 205 },
      { x: 0.62, y: 0.68, r: 42, speed: 0.0006, phase: 2.8, hue: 38 },
      { x: 0.28, y: 0.74, r: 38, speed: 0.0008, phase: 4.1, hue: 255 },
      { x: 0.74, y: 0.32, r: 54, speed: 0.0005, phase: 5.0, hue: 45 },
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
          grad.addColorStop(0, 'rgba(255, 253, 245, 0.85)');
          grad.addColorStop(0.35, `hsla(${f.hue}, 88%, 78%, ${0.34 * pulse})`);
          grad.addColorStop(1, 'rgba(255, 255, 255, 0)');
        } else {
          grad.addColorStop(0, 'rgba(252, 244, 214, 0.65)');
          grad.addColorStop(0.45, `rgba(213, 180, 115, ${0.28 * pulse})`);
          grad.addColorStop(1, 'rgba(252, 249, 235, 0)');
        }

        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(cx, cy, radius, 0, Math.PI * 2);
        ctx.fill();

        // Draw crisp 4-point star facet glint at peak refraction
        if (pulse > 0.58) {
          const starLen = 12 + pulse * 16;
          ctx.strokeStyle = `rgba(255, 250, 228, ${(pulse - 0.45) * 0.95})`;
          ctx.lineWidth = 1.25;
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
      {/* Ambient Golden Caustic Glow Halo Behind the Visual Showcase */}
      <div
        aria-hidden="true"
        className="absolute -inset-6 bg-[radial-gradient(circle_at_35%_40%,rgba(213,192,150,0.28),rgba(71,50,212,0.08)_55%,transparent_75%)] blur-2xl pointer-events-none"
      />

      {/* Main Editorial Visual Composition with Generous Breathing Room */}
      <div className="relative w-full grid grid-cols-12 gap-6 lg:gap-8 items-stretch">
        {/* Primary Macro / Editorial Frame with 3D GSAP Tilt & Gilded Gallery Frame */}
        <div
          ref={primaryFrameRef}
          onMouseMove={handleFrameMouseMove}
          onMouseLeave={handleFrameMouseLeave}
          className="col-span-12 sm:col-span-8 relative overflow-hidden bg-[#161517] border border-[#9D814D]/45 shadow-[0_30px_70px_-20px_rgba(36,35,37,0.35)] h-[450px] sm:h-[530px] will-change-transform group"
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

          {/* Inner Gilded Museum Frame Hairline */}
          <div
            aria-hidden="true"
            className="absolute inset-3.5 border border-[#D5C096]/35 pointer-events-none z-10"
          />

          {/* Top-Left Glassmorphic Optical Telemetry Pill */}
          <div className="absolute top-6 left-6 z-20 inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#161517]/75 backdrop-blur-md border border-[#D5C096]/40">
            <span className="w-2 h-2 rounded-full bg-[#D5C096] animate-pulse" />
            <span className="font-tabular-mono text-[10px] tracking-[0.2em] uppercase text-[#FDFBF7]">
              {activeScene === 'pave' ? 'REFRACTIVE INDEX 2.417 · GIA IDEAL' : '18K SOLID GOLD · 750‰ HALLMARK'}
            </span>
          </div>

          {/* Subtle Bottom Contrast Scrim for Caption */}
          <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-[#121113]/95 via-[#121113]/55 to-transparent p-6 sm:p-8 flex items-end justify-between gap-4 z-20">
            <div ref={captionRef} className="space-y-1.5">
              <p className="font-tabular-mono text-[11px] tracking-[0.2em] uppercase text-[#D5C096] flex items-center gap-2">
                <span className="animate-twinkle inline-block text-[#EBD5A7]">✦</span>
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

        {/* Secondary Oval Inset & Velvet Obsidian Hallmark Column */}
        <div className="col-span-12 sm:col-span-4 flex sm:flex-col justify-between gap-6 h-full">
          {/* Oval Sculptural Cutout Frame with Double Gold Ring */}
          <button
            ref={ovalFrameRef}
            type="button"
            onClick={() => setActiveScene(activeScene === 'pave' ? 'sunlit' : 'pave')}
            aria-label="Switch hero visual perspective between macro diamond pavé and sunlit layered gold necklaces"
            className="group relative w-1/2 sm:w-full aspect-[4/5] rounded-full p-1.5 border border-[#9D814D]/50 bg-gradient-to-b from-[#D5C096]/30 to-transparent shadow-[0_20px_50px_-15px_rgba(157,129,77,0.3)] focus-visible:outline-2 focus-visible:outline-[#4732D4] transition-transform duration-300 hover:scale-[1.03] cursor-pointer"
          >
            <div className="w-full h-full rounded-full overflow-hidden relative bg-[#242325]">
              <img
                src={
                  activeScene === 'pave'
                    ? 'assets/jewelry/layered-necklaces.png?v=2'
                    : 'assets/jewelry/eternity-pave-rings.png?v=2'
                }
                alt="Preview alternate perspective"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#161517]/70 via-transparent to-transparent flex items-end justify-center pb-5 p-4">
                <span className="px-3.5 py-1.5 rounded-full bg-[#FDFBF7]/95 text-[#242325] text-[10px] font-tabular-mono tracking-widest uppercase font-medium shadow-md">
                  ✦ {activeScene === 'pave' ? 'Sunlit Stack' : 'Macro Pavé'}
                </span>
              </div>
            </div>
          </button>

          {/* High-Contrast Velvet Obsidian & Gold Foil Hallmark Card */}
          <div
            ref={hallmarkCardRef}
            className="w-1/2 sm:w-full bg-[#181719] text-[#FDFBF7] border border-[#9D814D]/45 p-6 flex flex-col justify-between flex-1 relative overflow-hidden shadow-[0_20px_45px_-15px_rgba(36,35,37,0.28)]"
          >
            <div
              aria-hidden="true"
              className="absolute -top-12 -right-12 w-28 h-28 rounded-full bg-[#D5C096]/15 blur-xl pointer-events-none"
            />
            <div className="flex items-center justify-between gap-2 relative z-10">
              <div>
                <span className="font-tabular-mono text-[10px] tracking-[0.2em] uppercase text-[#D5C096] block">
                  SWISS ASSAY
                </span>
                <span className="font-editorial-serif italic text-xl text-gold-foil">
                  18K · 750‰
                </span>
              </div>
              <button
                type="button"
                onClick={onExploreCustom}
                className="w-10 h-10 rounded-full bg-gradient-to-br from-[#D5C096] to-[#9D814D] text-[#181719] font-semibold flex items-center justify-center text-[11px] font-tabular-mono tracking-wider transition-transform duration-200 hover:scale-110 shadow-md cursor-pointer"
                aria-label="Open 3D Bespoke Ring Studio"
                title="Launch Interactive 3D CAD Studio"
              >
                360°
              </button>
            </div>
            <p className="text-xs text-[#FDFBF7]/80 font-light leading-relaxed my-4 relative z-10">
              Every diamond passes a 40x microscopic inspection; 99% of stones inspected are rejected.
            </p>
            <div className="pt-3 border-t border-[#D5C096]/25 flex items-center justify-between text-[10px] font-tabular-mono tracking-widest text-[#D5C096] relative z-10">
              <span>GIA TOP 1%</span>
              <span>✦</span>
              <span>RJC AUDITED</span>
            </div>
          </div>
        </div>
      </div>

      {/* Interactive Visual Cue Controls Bar */}
      <div className="mt-6 pt-5 border-t border-[#242325]/12 flex flex-wrap items-center justify-between gap-4 relative z-10">
        <div className="flex flex-wrap items-center gap-2.5">
          <button
            type="button"
            onClick={() => setActiveScene('pave')}
            className={`px-4 py-2 rounded-full text-xs tracking-wider uppercase transition-all whitespace-nowrap shrink-0 flex items-center gap-2 cursor-pointer ${
              activeScene === 'pave'
                ? 'bg-[#242325] text-[#D5C096] border border-[#9D814D]/50 shadow-sm'
                : 'border border-[#242325]/25 text-[#242325]/80 hover:border-[#9D814D]'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-[#9D814D]" />
            Macro Pavé Refraction
          </button>
          <button
            type="button"
            onClick={() => setActiveScene('sunlit')}
            className={`px-4 py-2 rounded-full text-xs tracking-wider uppercase transition-all whitespace-nowrap shrink-0 flex items-center gap-2 cursor-pointer ${
              activeScene === 'sunlit'
                ? 'bg-[#242325] text-[#D5C096] border border-[#9D814D]/50 shadow-sm'
                : 'border border-[#242325]/25 text-[#242325]/80 hover:border-[#9D814D]'
            }`}
          >
            <Sun className="w-3.5 h-3.5 text-[#9D814D]" />
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
