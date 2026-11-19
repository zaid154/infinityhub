import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence, useMotionValue, useMotionTemplate } from 'framer-motion';
import { Check, ShieldCheck, ArrowRight, Download, FileText } from 'lucide-react';
import { Link } from 'react-router-dom';

/**
 * Apple-Grade Motion System
 * Lean, high-impact motion primitives matching Apple.com:
 * 1. APPLE_EASE: [0.16, 1, 0.3, 1] (Apple's signature cubic-bezier deceleration)
 * 2. APPLE_SPRING: Crisp spring physics for morphing tabs & layout shifts
 * 3. AppleSpotlightCard: Cursor-following radial flashlight illumination
 * 4. AppleReveal: Cinematic scroll reveal with subtle scale & depth
 * 5. AnimatedAccordion: Smooth spring-height expansion for FAQs
 * 6. ExecutiveSuccessCard: High-trust B2B order confirmation (replaces toy confetti)
 */

export const APPLE_EASE = [0.16, 1, 0.3, 1];
export const APPLE_SPRING = { type: 'spring', stiffness: 420, damping: 32 };
export const APPLE_GENTLE_SPRING = { type: 'spring', stiffness: 280, damping: 28 };

/**
 * Accessibility hook respecting OS-level reduced motion preferences
 */
export function useReducedMotionSafe() {
  const [shouldReduce, setShouldReduce] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return;
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setShouldReduce(mediaQuery.matches);

    const handler = (e) => setShouldReduce(e.matches);
    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, []);

  return shouldReduce;
}

/**
 * AppleSpotlightCard
 * Interactive mouse-follow radial spotlight sheen (seen on Apple Mac Pro & iPad Pro feature cards).
 * Illuminates card surface and gold borders as the cursor glides over it.
 */
export function AppleSpotlightCard({ children, className = '', glowColor = 'rgba(212, 162, 76, 0.12)' }) {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  function handleMouseMove({ currentTarget, clientX, clientY }) {
    const { left, top } = currentTarget.getBoundingClientRect();
    mouseX.set(clientX - left);
    mouseY.set(clientY - top);
  }

  return (
    <div
      onMouseMove={handleMouseMove}
      className={`group relative rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-xl ${className}`}
    >
      {/* Dynamic Cursor Spotlight Radial Glow */}
      <motion.div
        className="pointer-events-none absolute -inset-px opacity-0 transition-opacity duration-300 group-hover:opacity-100 z-10"
        style={{
          background: useMotionTemplate`radial-gradient(380px circle at ${mouseX}px ${mouseY}px, ${glowColor}, transparent 80%)`
        }}
      />
      {children}
    </div>
  );
}

/**
 * AppleReveal
 * Cinematic hardware reveal on scroll with gentle scale and velocity deceleration.
 */
export function AppleReveal({ children, className = '', delay = 0, scale = 0.97 }) {
  const shouldReduce = useReducedMotionSafe();

  if (shouldReduce) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 18, scale }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, margin: '-30px' }}
      transition={{ duration: 0.6, delay, ease: APPLE_EASE }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/**
 * AnimatedAccordion
 * Fluid spring height collapse and expansion for FAQ drawers.
 */
export function AnimatedAccordion({ isOpen, children, className = '' }) {
  const shouldReduce = useReducedMotionSafe();

  return (
    <AnimatePresence initial={false}>
      {isOpen && (
        <motion.div
          initial={shouldReduce ? { opacity: 0 } : { height: 0, opacity: 0 }}
          animate={shouldReduce ? { opacity: 1 } : { height: 'auto', opacity: 1 }}
          exit={shouldReduce ? { opacity: 0 } : { height: 0, opacity: 0 }}
          transition={{ duration: 0.35, ease: APPLE_EASE }}
          className={`overflow-hidden ${className}`}
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/**
 * AnimatedCheck
 * Clean SVG stroke-draw checkmark for form and transaction confirmations.
 */
export function AnimatedCheck({ size = 20, color = '#D4A24C', className = '' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
      <motion.path
        d="M5 13l4 4L19 7"
        stroke={color}
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 0.45, ease: 'easeOut' }}
      />
    </svg>
  );
}

/**
 * ExecutiveSuccessCard
 * Apple-style minimalist, high-trust order confirmation card (replaces toy confetti).
 */
export function ExecutiveSuccessCard({
  isOpen,
  title = 'Corporate Order Verified',
  referenceId = '',
  amount = '',
  onClose,
  viewOrderLink = '/dashboard/orders'
}) {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 16 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 16 }}
          transition={{ duration: 0.4, ease: APPLE_EASE }}
          className="relative max-w-md w-full bg-[#0D3B2A] border border-[#D4A24C]/40 rounded-3xl p-7 text-center shadow-2xl text-white space-y-5 overflow-hidden"
        >
          {/* Subtle Ambient Radial Lighting */}
          <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-48 h-48 bg-[#D4A24C]/20 rounded-full blur-3xl pointer-events-none" />

          {/* Luxury Animated Gold Seal */}
          <div className="w-16 h-16 mx-auto rounded-full bg-[#072117] border border-[#D4A24C]/60 flex items-center justify-center shadow-lg relative z-10">
            <AnimatedCheck size={28} color="#D4A24C" />
          </div>

          <div className="space-y-1.5 relative z-10">
            <h3 className="text-xl font-bold font-serif tracking-tight text-white">
              {title}
            </h3>
            <p className="text-xs text-[#90b09a] leading-relaxed">
              Your procurement transaction has been executed. A GST Tax Invoice has been generated and dispatched to your corporate email.
            </p>
          </div>

          {/* Reference & Amount Metadata Strip */}
          <div className="p-3.5 rounded-xl bg-[#072117]/80 border border-white/10 text-xs font-mono flex items-center justify-between text-slate-200 relative z-10">
            <span className="text-[#D4A24C] font-semibold">Ref: {referenceId || 'TXN-CONFIRMED'}</span>
            {amount && <span className="font-bold text-white">{amount}</span>}
          </div>

          {/* Action Button Suite */}
          <div className="flex items-center gap-3 pt-2 relative z-10">
            <Link
              to={viewOrderLink}
              onClick={onClose}
              className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-[#D4A24C] to-[#c5943b] text-[#072117] text-xs font-sans font-bold uppercase tracking-wider transition shadow hover:brightness-105 active:scale-95 text-center flex items-center justify-center gap-1.5"
            >
              <span>View In Orders</span>
              <ArrowRight className="w-3.5 h-3.5 text-[#072117]" />
            </Link>
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/15 text-xs font-semibold text-white transition cursor-pointer"
            >
              Close
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
