import React, { useState, useRef, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Volume2, VolumeX, Sparkles } from 'lucide-react';

const REELS = [
  {
    id: 1,
    title: '30-Point ThinkPad Diagnostics',
    tag: 'Quality Lab',
    poster: 'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=600&auto=format&fit=crop&q=80',
    src: 'https://assets.mixkit.co/videos/preview/mixkit-circuit-board-and-electronic-components-43184-large.mp4'
  },
  {
    id: 2,
    title: 'Precision Keyboard & Battery Load Testing',
    tag: 'Battery Health',
    poster: 'https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=600&auto=format&fit=crop&q=80',
    src: 'https://assets.mixkit.co/videos/preview/mixkit-hands-typing-on-a-laptop-keyboard-43092-large.mp4'
  },
  {
    id: 3,
    title: 'Chip-Level Motherboard Inspection',
    tag: 'BGA Diagnostics',
    poster: 'https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=600&auto=format&fit=crop&q=80',
    src: 'https://assets.mixkit.co/videos/preview/mixkit-close-up-of-a-technician-soldering-a-motherboard-41221-large.mp4'
  },
  {
    id: 4,
    title: 'Enterprise Fleet Multi-Monitor Setup',
    tag: 'Corporate Lease',
    poster: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=600&auto=format&fit=crop&q=80',
    src: 'https://assets.mixkit.co/videos/preview/mixkit-developer-working-on-code-with-multiple-monitors-42777-large.mp4'
  },
  {
    id: 5,
    title: 'Thermal Repasting & Heatsink Overhaul',
    tag: 'Arctic MX-4',
    poster: 'https://images.unsplash.com/photo-1587202372775-e229f172b9d7?w=600&auto=format&fit=crop&q=80',
    src: 'https://assets.mixkit.co/videos/preview/mixkit-macro-shot-of-a-processor-chip-43187-large.mp4'
  }
];

export default function VideoReels() {
  const [currentIndex, setCurrentIndex] = useState(2); // Center video active by default
  const [isMuted, setIsMuted] = useState(true);
  const activeVideoRef = useRef(null);

  const prevReel = () => {
    setCurrentIndex((prev) => (prev === 0 ? REELS.length - 1 : prev - 1));
  };

  const nextReel = () => {
    setCurrentIndex((prev) => (prev === REELS.length - 1 ? 0 : prev + 1));
  };

  // Play/pause and volume controls on active video
  useEffect(() => {
    if (activeVideoRef.current) {
      activeVideoRef.current.currentTime = 0;
      activeVideoRef.current.play().catch(() => {});
    }
  }, [currentIndex]);

  const toggleMute = (e) => {
    e.stopPropagation();
    if (activeVideoRef.current) {
      activeVideoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  return (
    <section id="video-reels" className="max-w-7xl mx-auto px-4 sm:px-8 space-y-8 py-12 scroll-mt-24">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto space-y-2">
        <span className="text-[11px] uppercase tracking-[0.25em] text-[#D4A24C] font-semibold block">
          — REAL HARDWARE EXPERIENCE & LAB REELS
        </span>
        <h2 className="text-3xl sm:text-4xl font-normal text-[#0D3B2A] font-serif">
          Inside Our Diagnostic Facility
        </h2>
        <p className="text-sm text-[#5A6B63]">
          Watch our engineers stress-test commercial fleets, inspect motherboards, and ensure zero-defect delivery.
        </p>
      </div>

      {/* 3D Cover Flow Carousel Container - Exactly like Al-Tooba Foods */}
      <div className="relative w-full max-w-[1400px] mx-auto flex items-center justify-center">
        {/* Navigation Arrow: Previous */}
        <button
          onClick={prevReel}
          aria-label="Previous reel"
          className="absolute left-2 sm:left-4 md:left-12 z-50 p-4 rounded-full bg-white text-[#0D3B2A] hover:bg-[#D4A24C] hover:text-white transition-colors border border-[#0D3B2A]/10 shadow-lg cursor-pointer group"
        >
          <ChevronLeft className="w-5 h-5 group-hover:scale-110 transition" />
        </button>

        {/* 3D Perspective Stage */}
        <div className="relative w-full h-[520px] sm:h-[600px] flex items-center justify-center [perspective:1000px] touch-pan-y overflow-hidden">
          {REELS.map((reel, idx) => {
            // Calculate distance offset from active index
            let offset = idx - currentIndex;
            if (offset < -2) offset += REELS.length;
            if (offset > 2) offset -= REELS.length;

            const isActive = offset === 0;
            const isVisible = Math.abs(offset) <= 2;

            if (!isVisible) return null;

            // Transform parameters matching Al-Tooba's exact CSS
            let translateX = 0;
            let scale = 1;
            let opacity = 1;
            let zIndex = 10;

            if (offset === 1) {
              translateX = 220;
              scale = 0.8;
              opacity = 0.85;
              zIndex = 9;
            } else if (offset === -1) {
              translateX = -220;
              scale = 0.8;
              opacity = 0.85;
              zIndex = 9;
            } else if (offset === 2) {
              translateX = 340;
              scale = 0.65;
              opacity = 0.5;
              zIndex = 8;
            } else if (offset === -2) {
              translateX = -340;
              scale = 0.65;
              opacity = 0.5;
              zIndex = 8;
            }

            return (
              <div
                key={reel.id}
                onClick={() => !isActive && setCurrentIndex(idx)}
                style={{
                  transform: `translateX(${translateX}px) scale(${scale})`,
                  opacity,
                  zIndex,
                  transition: 'all 0.5s cubic-bezier(0.25, 1, 0.5, 1)'
                }}
                className={`absolute w-[260px] sm:w-[280px] h-[460px] sm:h-[500px] rounded-[24px] overflow-hidden shadow-2xl bg-black border border-[#D4A24C]/40 cursor-pointer select-none`}
              >
                {/* Video or Poster */}
                {isActive ? (
                  <video
                    ref={activeVideoRef}
                    src={reel.src}
                    poster={reel.poster}
                    autoPlay
                    loop
                    muted={isMuted}
                    playsInline
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <img
                    src={reel.poster}
                    alt={reel.title}
                    className="w-full h-full object-cover filter brightness-90"
                  />
                )}

                {/* Gradient Overlay for Text Legibility */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent pointer-events-none" />

                {/* Top Badge */}
                <div className="absolute top-4 left-4 z-20">
                  <span className="px-2.5 py-1 rounded-full bg-[#0D3B2A]/80 text-[#D4A24C] border border-[#D4A24C]/40 text-[9px] font-bold uppercase tracking-widest backdrop-blur-sm">
                    {reel.tag}
                  </span>
                </div>

                {/* Bottom Overlay Info */}
                <div className="absolute bottom-4 left-4 right-14 z-20 text-white space-y-1">
                  <h4 className="font-serif text-sm font-bold leading-snug drop-shadow-md">
                    {reel.title}
                  </h4>
                  <p className="text-[10px] text-[#D4A24C] font-mono tracking-wider">
                    Nova Lab Verified
                  </p>
                </div>

                {/* Floating Sound Toggle Button on Active Video - Al-Tooba Style */}
                {isActive && (
                  <button
                    onClick={toggleMute}
                    aria-label={isMuted ? 'Unmute reel video' : 'Mute reel video'}
                    className="absolute bottom-4 right-4 z-30 p-2.5 rounded-full bg-black/50 text-[#D4A24C] hover:bg-black/75 transition-colors backdrop-blur-sm border border-[#D4A24C]/40 shadow-lg cursor-pointer"
                  >
                    {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                  </button>
                )}
              </div>
            );
          })}
        </div>

        {/* Navigation Arrow: Next */}
        <button
          onClick={nextReel}
          aria-label="Next reel"
          className="absolute right-2 sm:right-4 md:right-12 z-50 p-4 rounded-full bg-white text-[#0D3B2A] hover:bg-[#D4A24C] hover:text-white transition-colors border border-[#0D3B2A]/10 shadow-lg cursor-pointer group"
        >
          <ChevronRight className="w-5 h-5 group-hover:scale-110 transition" />
        </button>
      </div>
    </section>
  );
}
