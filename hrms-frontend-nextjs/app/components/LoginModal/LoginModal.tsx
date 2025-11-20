"use client";
import { useEffect, useState, useRef } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import type { Variants } from "framer-motion";
import LoginForm from "@/components/LoginForm/LoginForm";
import "@/(auth)/login/LoginPage.css";
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import { faHome } from "@fortawesome/free-solid-svg-icons";

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
  const OVERLAY_ACTIVE_OPACITY = 0.8;

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

  const DnaLogo = ({ className }: { className?: string }) => (
    <svg
      className={className}
      width="300"
      height="305"
      viewBox="0 0 300 305"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g filter="url(#filter0_d_4325_16976)">
        <path
          d="M45 82.5L177.5 10V57.5L45 132.5L135 182.5V230L45 185V132.5V82.5Z"
          fill="#E97128"
        />
        <path
          d="M45 132.5V185L135 230V182.5L45 132.5ZM45 132.5V82.5L177.5 10V57.5L45 132.5Z"
          stroke="#E97128"
          strokeWidth="6.66667"
        />
      </g>
      <g filter="url(#filter1_d_4325_16976)">
        <path
          d="M105 160L157.5 72.5L52.5 132.5L105 160Z"
          fill="#008EC7"
          stroke="#008EC7"
          strokeWidth="6.66667"
        />
      </g>
      <g filter="url(#filter2_d_4325_16976)">
        <path
          d="M247.869 173.895L138.911 233.581L193.602 144.974L247.869 173.895Z"
          fill="#008EC7"
          stroke="#008EC7"
          strokeWidth="6.66667"
        />
      </g>
      <g filter="url(#filter3_d_4325_16976)">
        <path
          d="M162.5 70L252.5 115V172.5V177.5V225L122.5 287.5V245L252.5 177.5V172.5L162.5 127.5V70Z"
          fill="#0C3E66"
        />
        <path
          d="M252.5 172.5V115L162.5 70V127.5L252.5 172.5ZM252.5 172.5V177.5M252.5 177.5V225L122.5 287.5V245L252.5 177.5Z"
          stroke="#0C3E66"
          strokeWidth="6.66667"
        />
      </g>
      <defs>
        <filter
          id="filter0_d_4325_16976"
          x="37.2665"
          y="1.97598"
          width="151.967"
          height="243.818"
          filterUnits="userSpaceOnUse"
          colorInterpolationFilters="sRGB"
        >
          <feFlood floodOpacity="0" result="BackgroundImageFix" />
          <feColorMatrix
            in="SourceAlpha"
            type="matrix"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
            result="hardAlpha"
          />
          <feOffset dx="2" dy="4" />
          <feGaussianBlur stdDeviation="3.2" />
          <feComposite in2="hardAlpha" operator="out" />
          <feColorMatrix
            type="matrix"
            values="0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 1 0"
          />
          <feBlend
            mode="normal"
            in2="BackgroundImageFix"
            result="effect1_dropShadow_4325_16976"
          />
          <feBlend
            mode="normal"
            in="SourceGraphic"
            in2="effect1_dropShadow_4325_16976"
            result="shape"
          />
        </filter>
        <filter
          id="filter1_d_4325_16976"
          x="41.5591"
          y="63.2773"
          width="129.362"
          height="109.135"
          filterUnits="userSpaceOnUse"
          colorInterpolationFilters="sRGB"
        >
          <feFlood floodOpacity="0" result="BackgroundImageFix" />
          <feColorMatrix
            in="SourceAlpha"
            type="matrix"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
            result="hardAlpha"
          />
          <feOffset dy="4" />
          <feGaussianBlur stdDeviation="2" />
          <feComposite in2="hardAlpha" operator="out" />
          <feColorMatrix
            type="matrix"
            values="0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 0.25 0"
          />
          <feBlend
            mode="normal"
            in2="BackgroundImageFix"
            result="effect1_dropShadow_4325_16976"
          />
          <feBlend
            mode="normal"
            in="SourceGraphic"
            in2="effect1_dropShadow_4325_16976"
            result="shape"
          />
        </filter>
        <filter
          id="filter2_d_4325_16976"
          x="125.448"
          y="140.562"
          width="133.433"
          height="110.004"
          filterUnits="userSpaceOnUse"
          colorInterpolationFilters="sRGB"
        >
          <feFlood floodOpacity="0" result="BackgroundImageFix" />
          <feColorMatrix
            in="SourceAlpha"
            type="matrix"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
            result="hardAlpha"
          />
          <feOffset dy="4" />
          <feGaussianBlur stdDeviation="2" />
          <feComposite in2="hardAlpha" operator="out" />
          <feColorMatrix
            type="matrix"
            values="0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 0.25 0"
          />
          <feBlend
            mode="normal"
            in2="BackgroundImageFix"
            result="effect1_dropShadow_4325_16976"
          />
          <feBlend
            mode="normal"
            in="SourceGraphic"
            in2="effect1_dropShadow_4325_16976"
            result="shape"
          />
        </filter>
        <filter
          id="filter3_d_4325_16976"
          x="113.767"
          y="61.2064"
          width="151.467"
          height="242.994"
          filterUnits="userSpaceOnUse"
          colorInterpolationFilters="sRGB"
        >
          <feFlood floodOpacity="0" result="BackgroundImageFix" />
          <feColorMatrix
            in="SourceAlpha"
            type="matrix"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
            result="hardAlpha"
          />
          <feOffset dx="2" dy="4" />
          <feGaussianBlur stdDeviation="3.7" />
          <feComposite in2="hardAlpha" operator="out" />
          <feColorMatrix
            type="matrix"
            values="0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 1 0"
          />
          <feBlend
            mode="normal"
            in2="BackgroundImageFix"
            result="effect1_dropShadow_4325_16976"
          />
          <feBlend
            mode="normal"
            in="SourceGraphic"
            in2="effect1_dropShadow_4325_16976"
            result="shape"
          />
        </filter>
      </defs>
    </svg>
  );

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
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{
              backgroundImage: "url('/images/loginModal.png')",
              filter: "blur(32px)",
              transform: "scale(1.15)",
            }} // initial blur
            variants={{
              initial: { opacity: 0, backdropFilter: "blur(0px)" },
              animate: {
                opacity: OVERLAY_ACTIVE_OPACITY,
                backdropFilter: "blur(8px)",
              },
            }}
            initial="initial"
            animate="animate"
            exit={{ opacity: 0, backdropFilter: "blur(0px)" }} // fade out
            transition={{ duration: 0.3, ease: "easeOut" }}
            onClick={handleRequestClose}
          />

          {/* ======================= MODAL PANEL ======================= */}
          <motion.div
            ref={panelRef}
            role="dialog"
            aria-modal="true"
            className={`relative flex items-center justify-center w-[85%] md:w-[80%] h-[83%] max-w-[1200px] xl:max-w-[75vw]  rounded-lg overflow-hidden ${
              isShrinking
                ? "bg-transparent shadow-none"
                : "bg-darkblue-50 shadow-xl"
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
              className="absolute right-4 top-2 z-30 w-8 h-8 flex items-center justify-center text-4xl leading-none text-[#1C1B1F] hover:text-black hover:bg-gray-200 rounded-full cursor-pointer transition"
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
              {/* Left trapezoidal black section + logo */}
              <div className="relative w-1/2 h-full">
                <motion.div
                  className="absolute inset-0"
                  style={{
                    clipPath: "polygon(0% 0%, 100% 0%, 60% 100%, 0% 100%)",
                    backgroundImage: "url('/images/blueBackground.png')",
                    backgroundSize: "cover",
                  }}
                  variants={leftVariants}
                  transition={{ duration: 6.0, delay: 0.02, ease: "easeOut" }}
                />

                {/* DNA Logo design overlay (final touch after ~1.0s) */}
                <motion.div
                  id="letter-design-overlay"
                  className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60%] min-[441px]:w-[52%] sm:w-[50%] md:w-[48%] lg:w-[44%] xl:w-[42%] 2xl:w-[40%] "
                  initial={{ opacity: 0, scale: 0.96 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 1.0, delay: 1.0, ease: "easeOut" }}
                >
                  <DnaLogo className="w-full h-full" />
                </motion.div>
              </div>

              {/* Right section with Login Form (quick) */}
              <motion.div
                className="z-10 w-[50%] h-[100%] mr-2 sm:mr-0 pr-10 xxs:pr-0 flex items-center justify-center sm:justify-start "
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
                className="absolute inset-0 z-40 overflow-hidden bg-darkblue-50 rounded-lg shadow-xl"
                style={{
                  transformOrigin: "center",
                  pointerEvents: "none",
                  width: "100%",
                  height: "100%",
                }}
              >
                {/* Left trapezoid clone */}
                <div className="absolute inset-y-0 left-0 h-full w-1/2">
                  <div
                    className="absolute inset-0 bg-[#353535]"
                    style={{
                      clipPath: "polygon(0% 0%, 100% 0%, 60% 100%, 0% 100%)",
                      backgroundImage: "url('/images/blueBackground.png')",
                      backgroundSize: "cover",
                    }}
                  />

                  {/* Letter overlay clone */}
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 md:-translate-x-[45%] lg:-translate-x-[42%] xl:-translate-x-[40%] 2xl:-translate-x-[38%] -translate-y-1/2 w-[60%] min-[520px]:w-[52%] sm:w-[48%] md:w-[44%] lg:w-[40%] xl:w-[36%] 2xl:w-[32%] max-w-[260px] aspect-[4/3] flex items-center justify-center">
                    <DnaLogo className="w-full h-full" />
                  </div>
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
                  className="absolute bottom-4 left-6 flex flex-col items-center p-2 rounded text-white border border-transparent"
                  style={{ pointerEvents: "none" }}
                >
                  <svg
                    width="20"
                    height="23"
                    viewBox="0 0 20 23"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M2.5 20H6.25V12.5H13.75V20H17.5V8.75L10 3.125L2.5 8.75V20ZM0 22.5V7.5L10 0L20 7.5V22.5H11.25V15H8.75V22.5H0Z"
                      fill="white"
                    />
                  </svg>
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
