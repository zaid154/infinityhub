import React, { useState, useRef, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Volume2, VolumeX, Sparkles, ShieldCheck } from 'lucide-react';

const REELS = [
  {
    id: 1,
    title: '30-Point Commercial Diagnostic Lab',
    tag: 'Quality Lab',
    poster: '/videos/reel-poster-1.jpg',
    fallbackPoster: 'https://cdn.shopify.com/s/files/1/0819/7072/5115/files/preview_images/17cc97a02d3142a4b113ba9524958330.thumbnail.0000000000.jpg?v=1783338434',
    src: '/videos/reel-1.mp4',
    cdnSrc: 'https://imrmuj-v6.myshopify.com/cdn/shop/videos/c/vp/17cc97a02d3142a4b113ba9524958330/17cc97a02d3142a4b113ba9524958330.HD-720p-1.6Mbps-88223508.mp4'
  },
  {
    id: 2,
    title: 'Keyboard, Display & Battery Load Test',
    tag: 'Battery Health',
    poster: '/videos/reel-poster-2.jpg',
    fallbackPoster: 'https://cdn.shopify.com/s/files/1/0819/7072/5115/files/preview_images/85f7959f4ac6471c9554a5a57a2c22fe.thumbnail.0000000000.jpg?v=1783338140',
    src: '/videos/reel-2.mp4',
    cdnSrc: 'https://imrmuj-v6.myshopify.com/cdn/shop/videos/c/vp/85f7959f4ac6471c9554a5a57a2c22fe/85f7959f4ac6471c9554a5a57a2c22fe.HD-720p-1.6Mbps-88223250.mp4'
  },
  {
    id: 3,
    title: 'Chip-Level Motherboard Diagnostics',
    tag: 'BGA Diagnostics',
    poster: '/videos/reel-poster-3.jpg',
    fallbackPoster: 'https://cdn.shopify.com/s/files/1/0819/7072/5115/files/preview_images/9caba9646dba47ed9d6b48d6c753018b.thumbnail.0000000000.jpg?v=1783338632',
    src: '/videos/reel-3.mp4',
    cdnSrc: 'https://imrmuj-v6.myshopify.com/cdn/shop/videos/c/vp/9caba9646dba47ed9d6b48d6c753018b/9caba9646dba47ed9d6b48d6c753018b.HD-720p-1.6Mbps-88223776.mp4'
  },
  {
    id: 4,
    title: 'Enterprise Multi-Screen Fleet Setup',
    tag: 'Corporate Lease',
    poster: '/videos/reel-poster-4.jpg',
    fallbackPoster: 'https://cdn.shopify.com/s/files/1/0819/7072/5115/files/preview_images/16ef13e5b1814a99b296bf4b3eefb76f.thumbnail.0000000000.jpg?v=1783338817',
    src: '/videos/reel-4.mp4',
    cdnSrc: 'https://imrmuj-v6.myshopify.com/cdn/shop/videos/c/vp/16ef13e5b1814a99b296bf4b3eefb76f/16ef13e5b1814a99b296bf4b3eefb76f.HD-720p-1.6Mbps-88223917.mp4'
  },
  {
    id: 5,
    title: 'Precision Thermal Overhaul & Fan Tuning',
    tag: 'Arctic MX-4',
    poster: '/videos/reel-poster-5.jpg',
    fallbackPoster: 'https://cdn.shopify.com/s/files/1/0819/7072/5115/files/preview_images/16e3ff5b690f42519c89c2acbcb3e0e1.thumbnail.0000000000.jpg?v=1783337869',
    src: '/videos/reel-5.mp4',
    cdnSrc: 'https://imrmuj-v6.myshopify.com/cdn/shop/videos/c/vp/16e3ff5b690f42519c89c2acbcb3e0e1/16e3ff5b690f42519c89c2acbcb3e0e1.HD-720p-1.6Mbps-88222991.mp4'
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

  // Play controls on active video
  useEffect(() => {
    if (activeVideoRef.current) {
      activeVideoRef.current.currentTime = 0;
      const playPromise = activeVideoRef.current.play();
      if (playPromise !== undefined) {
        playPromise.catch(() => {});
      }
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
    <section id="video-reels" className="max-w-7xl mx-auto px-4 sm:px-8 space-y-8 py-16 scroll-mt-24">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#0D3B2A]/10 border border-[#D4A24C]/40 text-[#D4A24C] text-[11px] font-bold tracking-[0.2em] uppercase">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Real Diagnostic Lab & Customer Experience</span>
        </div>
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-normal text-[#0D3B2A] font-serif">
          Inside Our Precision Facility
        </h2>
        <p className="text-sm sm:text-base text-[#5A6B63] max-w-xl mx-auto">
          Watch our engineers stress-test commercial fleets, inspect motherboards, and ensure zero-defect delivery before Pan-India dispatch.
        </p>
      </div>

      {/* 3D Cover Flow Carousel Container - Exact Al-Tooba Foods Architecture */}
      <div className="relative w-full max-w-[1400px] mx-auto flex items-center justify-center pt-4">
        {/* Navigation Arrow: Previous */}
        <button
          onClick={prevReel}
          aria-label="Previous reel"
          className="absolute left-2 sm:left-6 md:left-12 z-50 p-4 rounded-full bg-white/95 text-[#0D3B2A] hover:bg-[#D4A24C] hover:text-white transition-all border border-[#0D3B2A]/15 shadow-2xl cursor-pointer group active:scale-95"
        >
          <ChevronLeft className="w-5 h-5 group-hover:-translate-x-0.5 transition" />
        </button>

        {/* 3D Perspective Stage */}
        <div className="relative w-full h-[520px] sm:h-[600px] flex items-center justify-center [perspective:1200px] touch-pan-y overflow-hidden select-none">
          {REELS.map((reel, idx) => {
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
              translateX = 240;
              scale = 0.8;
              opacity = 0.85;
              zIndex = 9;
            } else if (offset === -1) {
              translateX = -240;
              scale = 0.8;
              opacity = 0.85;
              zIndex = 9;
            } else if (offset === 2) {
              translateX = 380;
              scale = 0.65;
              opacity = 0.5;
              zIndex = 8;
            } else if (offset === -2) {
              translateX = -380;
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
                  transition: 'all 0.55s cubic-bezier(0.25, 1, 0.5, 1)'
                }}
                className={`absolute w-[260px] sm:w-[290px] h-[460px] sm:h-[510px] rounded-[28px] overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.35)] bg-black border-2 border-[#D4A24C]/40 cursor-pointer group`}
              >
                {/* Video (Active) or Poster Image (Flanking) */}
                {isActive ? (
                  <video
                    ref={activeVideoRef}
                    poster={reel.poster}
                    autoPlay
                    loop
                    muted={isMuted}
                    playsInline
                    preload="auto"
                    className="w-full h-full object-cover"
                  >
                    <source src={reel.src} type="video/mp4" />
                    <source src={reel.cdnSrc} type="video/mp4" />
                  </video>
                ) : (
                  <img
                    src={reel.poster}
                    onError={(e) => {
                      e.target.src = reel.fallbackPoster;
                    }}
                    alt={reel.title}
                    className="w-full h-full object-cover filter brightness-90 group-hover:scale-105 transition-transform duration-500"
                  />
                )}

                {/* Dark Gradient Overlay for Text Readability */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/25 to-transparent pointer-events-none" />

                {/* Top Badge */}
                <div className="absolute top-4 left-4 z-20 flex items-center gap-1.5">
                  <span className="px-3 py-1 rounded-full bg-[#072117]/85 text-[#D4A24C] border border-[#D4A24C]/40 text-[9px] font-bold uppercase tracking-widest backdrop-blur-md shadow-md">
                    {reel.tag}
                  </span>
                </div>

                {/* Center Inactive Indicator */}
                {!isActive && (
                  <div className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none">
                    <div className="w-12 h-12 rounded-full bg-black/40 border border-[#D4A24C]/60 flex items-center justify-center backdrop-blur-sm shadow-xl group-hover:scale-110 transition">
                      <div className="w-0 h-0 border-t-[7px] border-t-transparent border-l-[12px] border-l-[#D4A24C] border-b-[7px] border-b-transparent ml-1" />
                    </div>
                  </div>
                )}

                {/* Bottom Overlay Info */}
                <div className="absolute bottom-4 left-4 right-14 z-20 text-white space-y-1">
                  <h4 className="font-serif text-sm sm:text-base font-bold leading-snug drop-shadow-md text-white/95">
                    {reel.title}
                  </h4>
                  <p className="text-[10px] text-[#D4A24C] font-mono tracking-widest uppercase flex items-center gap-1">
                    <ShieldCheck className="w-3 h-3 text-[#D4A24C]" />
                    <span>Nova Lab Verified</span>
                  </p>
                </div>

                {/* Floating Sound Toggle Button on Active Video - Al-Tooba Style */}
                {isActive && (
                  <button
                    onClick={toggleMute}
                    aria-label={isMuted ? 'Unmute reel video' : 'Mute reel video'}
                    className="absolute bottom-4 right-4 z-30 p-2.5 rounded-full bg-black/60 text-[#D4A24C] hover:bg-black/90 transition-all backdrop-blur-md border border-[#D4A24C]/50 shadow-xl cursor-pointer hover:scale-105 active:scale-95"
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
          className="absolute right-2 sm:right-6 md:right-12 z-50 p-4 rounded-full bg-white/95 text-[#0D3B2A] hover:bg-[#D4A24C] hover:text-white transition-all border border-[#0D3B2A]/15 shadow-2xl cursor-pointer group active:scale-95"
        >
          <ChevronRight className="w-5 h-5 group-hover:translate-x-0.5 transition" />
        </button>
      </div>
    </section>
  );
}
