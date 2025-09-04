"use client";
import { useEffect, useState, useRef } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import type { Variants } from "framer-motion";
import LoginForm from "@/components/LoginForm/LoginForm";
import "@/(auth)/login/LoginPage.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHome } from "@fortawesome/free-solid-svg-icons";

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function LoginModal({ isOpen, onClose }: LoginModalProps) {
  const prefersReduced = useReducedMotion();
  // const [isShrinking, setIsShrinking] = useState(false); // controls the close morph
  const panelRef = useRef<HTMLDivElement | null>(null);
  const [isShrinking, setIsShrinking] = useState(false);
  const [shrinkTransform, setShrinkTransform] = useState<{
    x: number;
    y: number;
    scaleX: number;
    scaleY: number;
  } | null>(null);

  // --- EASING (typed tuples to keep TS happy) ---
  const EASE_OUT = [0.22, 1, 0.36, 1] as const;

  // --- OVERLAY: keep it simple; no blur; we leave it visible during shrink ---
  const overlayVariants: Variants = {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
  };

  // --- PANEL: subtle zoom on OPEN (no exit here; close uses the ghost morph) ---
  const panelVariants: Variants = prefersReduced
    ? { initial: { opacity: 0 }, animate: { opacity: 1 } }
    : {
        initial: { opacity: 0, scale: 0.92, y: 12 },
        animate: { opacity: 1, scale: 1, y: 0 },
      };

  // --- TOP-DOWN CURTAIN: used on OPEN only; hidden during shrink so you see the morph ---
  const curtainVariants: Variants = prefersReduced
    ? { initial: { opacity: 0 }, animate: { opacity: 0 } }
    : {
        initial: { scaleY: 1 },
        animate: { scaleY: 0, transition: { duration: 1.0, ease: EASE_OUT } }, // the slower feel comes from left/letter delays below
      };

  // --- CONTENT APPEAR: mild crossfade/slide for the whole inside stack ---
  const contentVariants: Variants = prefersReduced
    ? { initial: { opacity: 1 }, animate: { opacity: 1 } }
    : {
        initial: { opacity: 0, y: 12 },
        animate: { opacity: 1, y: 0, transition: { duration: 0.22 } }, // quick so children can stage their own timings
      };

  // --- LEFT / RIGHT variants (kept; with tuned timings) ---
  // Right (form) = quick
  const rightVariants: Variants = prefersReduced
    ? { initial: { opacity: 1 }, animate: { opacity: 1 } }
    : { initial: { x: 12, opacity: 1 }, animate: { x: 0, opacity: 1 } };

  // Left (trapezoid) = slower
  const leftVariants: Variants = prefersReduced
    ? { initial: { opacity: 1 }, animate: { opacity: 1 } }
    : { initial: { x: -12, opacity: 1 }, animate: { x: 0, opacity: 1 } };

  // --- Close handler: start the "shrink to button" sequence ---
  function handleRequestClose() {
    if (isShrinking) return;

    // measure panel and target (Login button)
    const panelEl = panelRef.current;
    const ctaEl = document.getElementById("login-cta");
    if (panelEl && ctaEl) {
      const p = panelEl.getBoundingClientRect();
      const t = ctaEl.getBoundingClientRect();

      // center-to-center delta
      const dx = t.left + t.width / 2 - (p.left + p.width / 2);
      const dy = t.top + t.height / 2 - (p.top + p.height / 2);

      setShrinkTransform({
        x: dx,
        y: dy,
        scaleX: t.width / p.width,
        scaleY: t.height / p.height,
      });
    }

    setIsShrinking(true);
  }

  // --- Escape to close + lock page scroll while open ---
  useEffect(() => {
    if (!isOpen) return;
    const onKeyDown = (e: KeyboardEvent) =>
      e.key === "Escape" && handleRequestClose();
    document.addEventListener("keydown", onKeyDown);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = prev;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center"
          variants={overlayVariants}
          initial="initial"
          animate="animate"
        >
          {/* Overlay (click outside to close) */}
          <motion.button
            aria-label="Close overlay"
            className="absolute inset-0 bg-black/60"
            variants={overlayVariants}
            onClick={handleRequestClose}
          />

          {/* ======================= MODAL PANEL ======================= */}
          <motion.div
            ref={panelRef}
            role="dialog"
            aria-modal="true"
            className={`relative flex items-center justify-center w-[90%] h-[85%] max-w-[1000px] rounded-lg overflow-hidden ${
              isShrinking
                ? "bg-transparent shadow-none"
                : "bg-[#d9d9d9] shadow-xl"
            }`}
            variants={panelVariants}
            initial="initial"
            animate="animate"
            // Note: no exit — close is driven by the ghost morph
          >
            {/* Close button */}
            <button
              onClick={handleRequestClose}
              aria-label="Close login"
              className="absolute right-4 top-2 z-30 w-8 h-8 flex items-center justify-center text-2xl leading-none text-gray-700 hover:text-black hover:bg-gray-200 rounded-full cursor-pointer"
              style={{ opacity: isShrinking ? 0 : 1 }}
            >
              ×
            </button>

            {/* --- TOP-DOWN CURTAIN MASK (OPEN ONLY) --- */}
            {!isShrinking && (
              <motion.div
                aria-hidden
                className="pointer-events-none absolute inset-0 z-20 bg-[#d9d9d9]"
                style={{ transformOrigin: "top", willChange: "transform" }}
                variants={curtainVariants}
                initial="initial"
                animate="animate"
              />
            )}

            {/* --- LIVE CONTENT (fades on shrink to avoid double-vision) --- */}
            <motion.div
              className="relative w-full h-full flex"
              variants={contentVariants}
              initial="initial"
              animate={isShrinking ? "initial" : "animate"}
              transition={{ duration: 0.16 }}
              style={{
                pointerEvents: isShrinking ? "none" : "auto",
                opacity: isShrinking ? 0 : 1, // hide when the ghost takes over
              }}
            >
              {/* Left trapezoidal black section */}
              <motion.div
                className="w-1/2 h-full bg-[#353535]"
                style={{
                  clipPath: "polygon(0% 0%, 100% 0%, 75% 100%, 0% 100%)",
                }}
                variants={leftVariants}
                // SLOWER open for the trapezoid
                transition={{ duration: 6.0, delay: 0.02, ease: "easeOut" }}
              />

              {/* Letter design overlay (final touch after ~1.0s) */}
              <motion.div
                id="letter-design-overlay"
                className="absolute top-1/2 -translate-y-1/2 left-[20%] min-[520px]:left-1/4 w-[25%] aspect-[4/3] bg-[#d9d9d9] border-2 border-[#bfbfbf] flex items-center justify-center"
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                // Deliberately late: adjust delay to 1.0–1.6s to taste
                transition={{ duration: 1.0, delay: 1.0, ease: "easeOut" }}
              >
                <div className="absolute w-full scale-x-[1.24] h-[3px] bg-[#808080] rotate-[36.5deg]" />
                <div className="absolute w-full scale-x-[1.24] h-[3px] bg-[#808080] -rotate-[36.5deg]" />
              </motion.div>

              {/* Right section with Login Form (quick) */}
              <motion.div
                className="z-10 w-[50%] h-[100%] mr-2 sm:mr-0 pr-10 xxs:pr-0 flex items-center justify-center sm:justify-start sm:pl-8 md:pl-12 lg:pl-16"
                variants={rightVariants}
                // QUICKER than left: small delay + short duration
                transition={{ duration: 0.01, delay: 0, ease: "easeOut" }}
              >
                <LoginForm onCloseModal={handleRequestClose} />
              </motion.div>
            </motion.div>

            {/* ====== GHOST CLONE (CLOSE ONLY): full design shrinks to the Login button ====== */}
            {isShrinking && shrinkTransform && (
              <motion.div
                // Start at the panel's current size/position
                initial={{ x: 0, y: 0, scaleX: 1, scaleY: 1 }}
                animate={{
                  x: shrinkTransform.x,
                  y: shrinkTransform.y,
                  scaleX: shrinkTransform.scaleX,
                  scaleY: shrinkTransform.scaleY,
                }}
                transition={{
                  duration: 0.7,
                  ease: [0.22, 1, 0.36, 1],
                }}
                onAnimationComplete={() => {
                  setIsShrinking(false);
                  setShrinkTransform(null);
                  onClose();
                }}
                className="absolute inset-0 z-40 overflow-hidden bg-[#d9d9d9] rounded-lg shadow-xl"
                style={{
                  transformOrigin: "center",
                  pointerEvents: "none",
                  width: "100%",
                  height: "100%",
                }}
              >
                {/* Left trapezoid clone */}
                <div
                  className="absolute left-0 top-0 h-full w-1/2 bg-[#353535]"
                  style={{
                    clipPath: "polygon(0% 0%, 100% 0%, 75% 100%, 0% 100%)",
                  }}
                />

                {/* Letter overlay clone */}
                <div className="absolute top-1/2 -translate-y-1/2 left-[20%] min-[520px]:left-1/4 w-[25%] aspect-[4/3] bg-[#d9d9d9] border-2 border-[#bfbfbf] flex items-center justify-center">
                  <div className="absolute w-full scale-x-[1.24] h-[3px] bg-[#808080] rotate-[36.5deg]" />
                  <div className="absolute w-full scale-x-[1.24] h-[3px] bg-[#808080] -rotate-[36.5deg]" />
                </div>

                {/* Right side (ghost) – give it its own positioning context */}
                <div className="absolute right-4 top-0 h-full w-1/2 flex items-center justify-center sm:justify-start sm:pl-8 md:pl-12 lg:pl-16">
                  <div className="relative mr-2 sm:mr-0 pr-10 xxs:pr-0 w-full">
                    {/* Use the form in ghost mode and suppress anchors that are absolute */}
                    <div className="opacity-95 pointer-events-none">
                      <LoginForm appearance="ghost" suppressAnchors />
                    </div>
                  </div>
                </div>

                {/* Static clone of "Back Home" pinned to the left dark section */}
                <div
                  className="absolute bottom-4 left-6 flex flex-col items-center p-2 rounded text-white bg-[#353535] border border-transparent"
                  style={{ pointerEvents: "none" }}
                >
                  <FontAwesomeIcon icon={faHome} className="text-4xl" />
                  <span className="text-sm mt-2">Back Home</span>
                </div>

                {/* Static clone of "Register now" pinned to bottom-right */}
                <div
                  className="absolute bottom-4 right-6 text-sm font-semibold text-blue-600"
                  style={{ pointerEvents: "none" }}
                >
                  Register now
                </div>
              </motion.div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
