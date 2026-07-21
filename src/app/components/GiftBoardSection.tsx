"use client";
import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface FlowerParticle {
  id: number;
  imageSrc: string;
  targetX: number;
  targetY: number;
  scale: number;
  delay: number;
  duration: number;
}

const FLOWER_IMAGES = [
  "/images/flower1.png",
  "/images/flower2.png",
  "/images/flower3.png",
  "/images/flower4.png",
  "/images/flower5.png",
  "/images/flower6.png"
];

function generateParticles(): FlowerParticle[] {
  const generated: FlowerParticle[] = [];
  let idCounter = 0;

  const isMobile = window.innerWidth < 768;
  const rows = isMobile ? 7 : 12;
  const cols = isMobile ? 9 : 16;

  const vp = window.visualViewport;
  const vpW = vp ? vp.width : window.innerWidth;
  const vpH = vp ? vp.height : window.innerHeight;
  const maxRadius = Math.sqrt(vpW * vpW + vpH * vpH) * 0.52;

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const baseX = (c / (cols - 1)) * 150 - 75;
      const baseY = (r / (rows - 1)) * 150 - 75;
      const jitterX = Math.random() * 12 - 6;
      const jitterY = Math.random() * 12 - 6;
      const finalX = baseX + jitterX;
      const finalY = baseY + jitterY;
      const distance = Math.sqrt(finalX * finalX + finalY * finalY);

      const rawX = (finalX / 75) * (vpW * 0.52);
      const rawY = (finalY / 75) * (vpH * 0.52);
      const mag = Math.sqrt(rawX * rawX + rawY * rawY);
      const ratio = mag > maxRadius ? maxRadius / mag : 1;

      generated.push({
        id: idCounter++,
        imageSrc: FLOWER_IMAGES[Math.floor(Math.random() * FLOWER_IMAGES.length)],
        targetX: rawX * ratio,
        targetY: rawY * ratio,
        scale: Math.random() * 1.0 + 1.8,
        delay: distance * 0.016 + Math.random() * 0.25,
        duration: isMobile ? 0.38 : 0.45,
      });
    }
  }
  return generated.sort(() => Math.random() - 0.5);
}

// CSS keyframe ฝังตรง — particle animate ด้วย CSS ล้วน ไม่ผ่าน JS main thread เลย
function FlowerParticleEl({ f }: { f: FlowerParticle }) {
  return (
    <div
      aria-hidden="true"
      style={{
        position: "absolute",
        // CSS custom property ส่ง target ให้ keyframe ใช้
        ["--tx" as string]: `${f.targetX}px`,
        ["--ty" as string]: `${f.targetY}px`,
        ["--sc" as string]: f.scale,
        animationDuration: `${f.duration}s`,
        animationDelay: `${f.delay}s`,
        animationFillMode: "both",
        animationTimingFunction: "cubic-bezier(0.2, 0.8, 0.4, 1)",
        animationName: "flowerBurst",
        willChange: "transform, opacity",
        width: "5rem",
        height: "5rem",
      }}
      className="md:w-28 md:h-28 -translate-x-1/2 -translate-y-1/2 select-none pointer-events-none"
    >
      <img
        src={f.imageSrc}
        alt=""
        className="w-full h-full object-contain"
      />
    </div>
  );
}

export default function GiftBoardSection({ onBackToMenu }: { onBackToMenu: () => void }) {
  const [isOpened, setIsOpened] = useState(false);
  const [showBouquet, setShowBouquet] = useState(false);
  const [flowers, setFlowers] = useState<FlowerParticle[]>([]);
  const imagesPreloaded = useRef(false);

  useEffect(() => {
    if (imagesPreloaded.current) return;
    imagesPreloaded.current = true;
    FLOWER_IMAGES.forEach((src) => {
      const img = new Image();
      img.src = src;
    });
  }, []);

  useEffect(() => {
    if (!isOpened) return;
    // หน่วง 1 frame ก่อน generate — ให้ browser paint animation กล่องเปิดก่อน แล้วค่อย mount particles
    const raf = requestAnimationFrame(() => {
      setFlowers(generateParticles());
    });
    const timer = setTimeout(() => setShowBouquet(true), 2500);
    return () => {
      cancelAnimationFrame(raf);
      clearTimeout(timer);
    };
  }, [isOpened]);

  return (
    <>
      {/* CSS keyframe สำหรับ flower particle — ฝังใน style tag เพื่อให้ browser จัดการเองบน compositor */}
      <style>{`
        @keyframes flowerBurst {
          0%   { transform: translate(-50%, -50%) translate(0px, 0px) scale(0); opacity: 0; }
          15%  { opacity: 1; }
          100% { transform: translate(-50%, -50%) translate(var(--tx), var(--ty)) scale(var(--sc)); opacity: 1; }
        }
      `}</style>

      <section
        className="relative min-h-screen w-full bg-[#fff0f5] overflow-hidden flex flex-col items-center justify-center p-6"
        style={{ fontFamily: "var(--font-mitr), 'Mitr', sans-serif" }}
      >
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.7)_0%,rgba(255,240,245,1)_100%)] pointer-events-none fixed" />

        <div className="absolute top-6 left-6 z-50">
          <button
            onClick={onBackToMenu}
            className="px-5 py-2.5 rounded-full bg-white shadow-sm hover:shadow-md border border-[#f4a7be]/30 text-[#c2547a] text-xs font-bold tracking-widest cursor-pointer outline-none transition-all"
            style={{ fontFamily: "var(--font-mitr), 'Mitr', sans-serif" }}
          >
            BACK TO MENU
          </button>
        </div>

        <div className="flex flex-col items-center justify-center w-full max-w-[460px] -mt-12">
          <div className="relative w-full aspect-square max-w-[420px] flex items-center justify-center z-10 select-none">
            <AnimatePresence mode="wait">
              {!showBouquet ? (
                <motion.div
                  key="gift-stage"
                  initial={{ opacity: 1 }}
                  exit={{ opacity: 0, transition: { duration: 0.6, ease: "easeInOut" } }}
                  className="absolute inset-0 flex items-center justify-center"
                >
                  {/* CSS-animated particles — zero JS per frame */}
                  {isOpened && flowers.length > 0 && (
                    <div
                      className="fixed inset-0 pointer-events-none z-40 overflow-hidden"
                      style={{ contain: "strict" }}
                    >
                      <div
                        className="absolute top-1/2 left-1/2"
                        style={{ transform: "translate(-50%, -50%)" }}
                      >
                        {flowers.map((f) => (
                          <FlowerParticleEl key={f.id} f={f} />
                        ))}
                      </div>
                    </div>
                  )}

                  {/* กล่องของขวัญ */}
                  <div
                    onClick={() => !isOpened && setIsOpened(true)}
                    className={`relative w-full h-full flex flex-col items-center justify-center ${
                      !isOpened ? "cursor-pointer hover:scale-[1.025] active:scale-[0.98]" : ""
                    } transition-transform duration-300 z-10`}
                  >
                    <svg
                      viewBox="0 0 400 400"
                      className="w-full h-full drop-shadow-[0_22px_45px_rgba(224,142,162,0.38)]"
                    >
                      {!isOpened && (
                        <ellipse cx="200" cy="325" rx="110" ry="24" fill="rgba(0,0,0,0.05)" />
                      )}
                      <motion.g
                        animate={isOpened ? { scaleY: [1, 0.88, 1.03, 1], scaleX: [1, 1.03, 0.97, 1] } : {}}
                        transition={{ duration: 0.5, ease: "easeOut" }}
                      >
                        {isOpened && (
                          <g>
                            <path d="M 75 205 L 200 255 L 200 335 L 75 285 Z" fill="#9e566a" />
                            <path d="M 200 255 L 325 205 L 325 285 L 200 335 Z" fill="#b8687d" />
                            <path d="M 75 205 L 200 155 L 325 205 L 200 255 Z" fill="#803f50" />
                          </g>
                        )}
                        <path d="M 75 205 L 200 255 L 200 335 L 75 285 Z" fill="#fcaec5" />
                        <path d="M 127 226 L 148 234 L 148 314 L 127 306 Z" fill="#e28fa5" />
                        <path d="M 200 255 L 325 205 L 325 285 L 200 335 Z" fill="#f097b0" />
                        <path d="M 252 234 L 273 226 L 273 306 L 252 314 Z" fill="#cc768e" />
                      </motion.g>
                      <motion.g
                        animate={
                          isOpened
                            ? { y: -230, x: 50, rotate: 22, scale: 0.78, opacity: [1, 1, 0] }
                            : { y: [-3, 3, -3] }
                        }
                        transition={
                          isOpened
                            ? { duration: 0.62, ease: [0.25, 1, 0.5, 1] }
                            : { repeat: Infinity, duration: 2.2, ease: "easeInOut" }
                        }
                      >
                        <path d="M 71 203 L 200 255 L 200 270 L 71 218 Z" fill="#fa9cb5" />
                        <path d="M 127 226 L 148 234 L 148 249 L 127 241 Z" fill="#e28fa5" />
                        <path d="M 200 255 L 329 203 L 329 218 L 200 270 Z" fill="#e38ea5" />
                        <path d="M 252 234 L 273 226 L 273 241 L 252 249 Z" fill="#cc768e" />
                        <path d="M 200 151 L 329 203 L 200 255 L 71 203 Z" fill="#fcaec5" />
                        <path d="M 127 226 L 252 172 L 273 181 L 148 234 Z" fill="#e28fa5" />
                        <path d="M 252 234 L 127 172 L 148 163 L 273 226 Z" fill="#e28fa5" />
                        <path d="M 200 203 C 150 163, 140 130, 175 135 C 198 139, 200 180, 200 203" fill="none" stroke="#e28fa5" strokeWidth="14" strokeLinecap="round" />
                        <path d="M 200 203 C 250 163, 260 130, 225 135 C 202 139, 200 180, 200 203" fill="none" stroke="#e28fa5" strokeWidth="14" strokeLinecap="round" />
                        <ellipse cx="200" cy="203" rx="11" ry="9" fill="#d47991" />
                      </motion.g>
                    </svg>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="final-bouquet"
                  initial={{ scale: 0, opacity: 0, y: 30 }}
                  animate={{ scale: 1, opacity: 1, y: 0 }}
                  transition={{ type: "spring", stiffness: 160, damping: 17 }}
                  className="absolute flex flex-col items-center justify-center z-50 pointer-events-none"
                >
                  <div className="w-72 md:w-80 h-auto flex items-center justify-center">
                    <img
                      src="/images/flower.jpg"
                      alt="A Special Flower"
                      className="w-full h-auto object-contain select-none pointer-events-none"
                    />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <motion.div
            animate={{ opacity: [0.4, 0.8, 0.4] }}
            transition={{ repeat: Infinity, duration: 2.2, ease: "easeInOut" }}
            className="text-[10px] font-bold tracking-[0.2em] text-[#c2547a] uppercase select-none mt-6 text-center z-10"
            style={{ fontFamily: "var(--font-mitr), 'Mitr', sans-serif" }}
          >
            {!isOpened
              ? "TAP THE GIFT TO OPEN SURPRISE"
              : !showBouquet
              ? "SURPRISE IS BLOOMING..."
              : "A SPECIAL BOUQUET FOR YOU"}
          </motion.div>
        </div>
      </section>
    </>
  );
}
