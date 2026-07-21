"use client";
import { useState, useEffect } from 'react';
import { motion, useMotionValue, useTransform, useAnimation, AnimatePresence } from 'framer-motion';

const INITIAL_PHOTOS = [
  // 🎯 จุดแก้ไข: นำ useContain: true ออก เพื่อให้กลับไปจัดวางด้วยสัดส่วนเต็มกรอบปกติเหมือนรูปอื่น ๆ ครับ
  { id: 1, src: "/images/couple5.jpeg", caption: "หนูรักพี่ 🫶🏻" },
  { id: 2, src: "/images/couple4.jpeg", caption: "อยากไปเที่ยวกับพี่อีกเยอะๆเลย" },
  { id: 3, src: "/images/couple3.jpeg", caption: "หนูขอเป็นคนซ้อนท้ายตลอดไป 🛵💨 5555", objectTop: true }, 
  { id: 4, src: "/images/couple2.jpeg", caption: "ไว้ไปกินของอร่อยๆด้วยกันอีกนะ 🍻🍱" },
  { id: 5, src: "/images/couple1.jpeg", caption: "สุขสันต์วันเกิดครับ ✨🌻" },
];

interface HeartParticle {
  id: number;
  angle: number;
  delay: number;
  scale: number;
  duration: number;
}

function SwipeCard({ photo, index, total, onSwipe }: { photo: any; index: number; total: number; onSwipe: () => void }) {
  const x = useMotionValue(0);
  const controls = useAnimation();
  
  const rotate = useTransform(x, [-150, 150], [-15, 15]);
  const opacity = useTransform(x, [-200, -150, 0, 150, 200], [0, 1, 1, 1, 0]);

  const isFront = index === total - 1;
  const isNext = index === total - 2;
  
  const cardScale = isFront ? 1 : isNext ? 0.95 : 0.90;
  const cardY = isFront ? 0 : isNext ? 12 : 24;

  const handleDragEnd = async (_: any, info: any) => {
    if (info.offset.x > 120) {
      await controls.start({ x: 450, opacity: 0, rotate: 20, transition: { duration: 0.25, ease: "easeOut" } });
      onSwipe();
    } else if (info.offset.x < -120) {
      await controls.start({ x: -450, opacity: 0, rotate: -20, transition: { duration: 0.25, ease: "easeOut" } });
      onSwipe();
    } else {
      controls.start({ x: 0, transition: { type: "spring", stiffness: 250, damping: 22 } });
    }
  };

  return (
    <motion.div
      drag={isFront ? "x" : false}
      dragConstraints={{ left: 0, right: 0 }}
      style={{ x, rotate, opacity, zIndex: index }}
      animate={{
        y: cardY,
        scale: cardScale,
      }}
      transition={{ type: "spring", stiffness: 300, damping: 26 }}
      onDragEnd={handleDragEnd}
      whileDrag={{ scale: 1.01 }}
      className={`absolute w-72 h-[400px] md:w-80 md:h-[450px] bg-white p-4 pb-6 rounded-sm border border-[#f4a7be]/20 flex flex-col items-center justify-between cursor-grab active:cursor-grabbing transition-shadow duration-300 ${
        isFront 
          ? 'shadow-[0_20px_40px_rgba(194,84,122,0.15)] opacity-100' 
          : isNext 
            ? 'pointer-events-none shadow-[0_10px_25px_rgba(194,84,122,0.06)] opacity-100'
            : 'pointer-events-none opacity-0'
      }`}
    >
      <div className="w-full h-[82%] overflow-hidden bg-[#fafafa] border border-black/5 rounded-none pointer-events-none select-none flex items-center justify-center">
        <img 
          src={photo.src} 
          alt="Birthday Memory" 
          className={`w-full h-full ${
            photo.useContain 
              ? "object-contain bg-black" 
              : photo.objectTop 
                ? "object-cover object-top" 
                : "object-cover object-center"
          }`} 
        />
      </div>

      <div className="w-full text-center font-medium text-[#c2547a] text-xs md:text-sm tracking-wide mt-3 select-none pointer-events-none" style={{ fontFamily: "var(--font-mitr), 'Mitr', sans-serif" }}>
        {photo.caption.split('\n').map((line: string, i: number) => (
          <span key={i} className="block w-full text-center">
            {line}
          </span>
        ))}
      </div>
    </motion.div>
  );
}

export default function PhotoBoardSection({ onBackToMenu }: { onBackToMenu: () => void }) {
  const [photos, setPhotos] = useState(INITIAL_PHOTOS);
  const [isFinished, setIsFinished] = useState(false);
  const [particles, setParticles] = useState<HeartParticle[]>([]);

  const handleSwipe = () => {
    setPhotos((prev) => {
      const updated = [...prev];
      updated.pop(); 
      if (updated.length === 0) {
        setIsFinished(true);
      }
      return updated;
    });
  };

  useEffect(() => {
    if (isFinished) {
      const generatedParticles = Array.from({ length: 40 }).map((_, i) => ({
        id: i,
        angle: Math.random() * 360,
        delay: Math.random() * 1.5,
        scale: Math.random() * 0.6 + 0.4,
        duration: Math.random() * 2 + 1.5,
      }));
      setParticles(generatedParticles);
    }
  }, [isFinished]);

  return (
    <section className="relative min-h-screen w-full bg-[#fff0f5] overflow-hidden p-6 flex flex-col items-center justify-center" style={{ fontFamily: "var(--font-mitr), 'Mitr', sans-serif" }}>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,240,245,0.6)_0%,rgba(255,245,248,1)_100%)] pointer-events-none fixed" />

      <div className="absolute top-6 left-6 z-50">
        <button 
          onClick={onBackToMenu}
          className="px-5 py-2.5 rounded-full bg-white shadow-sm hover:shadow-md border border-[#f4a7be]/30 text-[#c2547a] text-xs font-bold tracking-widest cursor-pointer outline-none transition-all"
          style={{ fontFamily: "var(--font-mitr), 'Mitr', sans-serif" }}
        >
          BACK TO MENU
        </button>
      </div>

      <div className="relative w-72 h-[400px] md:w-80 md:h-[450px] flex items-center justify-center z-10">
        <AnimatePresence>
          {!isFinished ? (
            photos.map((photo, index) => (
              <SwipeCard
                key={photo.id}
                photo={photo}
                index={index}
                total={photos.length}
                onSwipe={handleSwipe}
              />
            ))
          ) : (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              {particles.map((p) => {
                const rad = (p.angle * Math.PI) / 180;
                const targetX = Math.cos(rad) * 350;
                const targetY = Math.sin(rad) * 350;

                return (
                  <motion.div
                    key={p.id}
                    initial={{ x: 0, y: 0, opacity: 0, scale: 0 }}
                    animate={{ 
                      x: targetX, 
                      y: targetY, 
                      opacity: [0, 1, 1, 0], 
                      scale: [0, p.scale, p.scale, 0],
                      rotate: p.angle + 45
                    }}
                    transition={{
                      duration: p.duration,
                      repeat: Infinity, 
                      delay: p.delay,
                      ease: "easeOut"
                    }}
                    className="absolute text-2xl md:text-3xl filter drop-shadow-[0_2px_5px_rgba(232,120,154,0.3)]"
                  >
                    ❤️
                  </motion.div>
                );
              })}

              <motion.div
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: [1, 1.12, 1], opacity: 1 }}
                transition={{
                  scale: { repeat: Infinity, duration: 1.0, ease: "easeInOut" },
                  opacity: { duration: 0.4 }
                }}
                className="text-8xl md:text-9xl filter drop-shadow-[0_10px_30px_rgba(232,120,154,0.45)] select-none"
              >
                ❤️
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </div>

      <motion.div 
        animate={{ opacity: [0.4, 0.8, 0.4] }}
        transition={{ repeat: Infinity, duration: 2.5, ease: "easeInOut" }}
        className="text-shadow-[0_2px_5px_rgba(232,120,154,0.3)] text-[10px] font-bold tracking-[0.2em] text-[#c2547a] uppercase select-none mt-10 text-center z-10"
        style={{ fontFamily: "var(--font-mitr), 'Mitr', sans-serif" }}
      >
        {!isFinished ? "👈 SWIPE LEFT OR RIGHT TO SEE NEXT MOMENT 👉" : "✨ EXPLOSION OF LOVE! ✨"}
      </motion.div>
    </section>
  );
}