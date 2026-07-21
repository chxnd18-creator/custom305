"use client";
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';

// 🎯 ล็อกสเปก Interface ให้รองรับทั้งคู่อย่างเป็นทางการ
interface BirthdaySectionProps {
  onFinish: () => void;
  onBackToMenu?: () => void; 
}

// 🎯 เปลี่ยนชื่อฟังก์ชันเป็น BirthdayThemeSection ให้ตรงกับชื่อไฟล์เป๊ะ ๆ ป้องกัน TS สับสน!
export default function BirthdayThemeSection({ onFinish, onBackToMenu }: BirthdaySectionProps) {
  const [isBlownOut, setIsBlownOut] = useState(false);
  const [isExploding, setIsExploding] = useState(false);

  const handleBlowCandle = () => {
    setIsBlownOut(true);
    // รอเปลวไฟดับ (0.9s) แล้วค่อยระเบิด confetti
    setTimeout(() => setIsExploding(true), 900);
    setTimeout(() => {
      onFinish();
      setIsExploding(false);
    }, 900 + 2200);
  };

  return (
    <section className="relative min-h-screen w-full overflow-hidden bg-[#fff0f5] flex flex-col items-center justify-center p-6" style={{ fontFamily: "var(--font-mitr), 'Mitr', sans-serif" }}>
      
      {/* Background Decor */}
      <div className="absolute inset-0 pointer-events-none opacity-25">
        <motion.span animate={{ y: [-10, 10, -10] }} transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }} className="absolute top-12 left-8 text-4xl">🎈</motion.span>
        <motion.span animate={{ y: [10, -10, 10] }} transition={{ repeat: Infinity, duration: 5, ease: "easeInOut" }} className="absolute top-24 right-8 text-5xl">🎁</motion.span>
        <motion.span animate={{ scale: [1, 1.2, 1] }} transition={{ repeat: Infinity, duration: 3 }} className="absolute bottom-20 left-12 text-4xl">✨</motion.span>
      </div>

      {/* 🎯 ปุ่มกดกลับหน้าเมนูหลัก */}
      {onBackToMenu && (
        <div className="absolute top-6 left-6 z-50">
          <button 
            onClick={onBackToMenu}
            className="px-5 py-2.5 rounded-full bg-white shadow-sm hover:shadow-md border border-[#f4a7be]/30 text-[#c2547a] text-xs font-bold tracking-widest cursor-pointer outline-none transition-all"
            style={{ fontFamily: "var(--font-mitr), 'Mitr', sans-serif" }}
          >
            BACK TO MENU
          </button>
        </div>
      )}

      {/* Birthday Card Container */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="bg-white w-full max-w-[380px] rounded-[32px] p-8 shadow-[0_12px_40px_rgba(194,84,122,0.12)] border border-[#f4a7be]/30 flex flex-col items-center text-center relative z-10"
      >
        <span className="text-[#e8a0bb] font-bold tracking-[0.25em] text-[11px] uppercase mb-1" style={{ fontFamily: "var(--font-mitr), 'Mitr', sans-serif" }}>Special Day</span>
        
        <h1 className="text-[#c2547a] text-3xl font-bold tracking-tight mb-6 leading-tight" style={{ fontFamily: "var(--font-itim), 'Itim', cursive" }}>
          Happy Birthday ✨
        </h1>

        {/* 🎂 ZONE: ตัวเค้กวันเกิดสุดคลาสสิกของเล่นครบระบบ */}
        <div className="relative w-52 h-52 flex items-center justify-center mb-8 select-none">
          
          {/* เปลวไฟเทียนระยิบระยับ */}
          <div className="absolute top-[20px] z-30 flex flex-col items-center">
            <AnimatePresence>
              {!isBlownOut && (
                <motion.div
                  key="flame"
                  animate={{ 
                    scale: [1, 1.12, 0.96, 1.08, 1],
                    y: [0, -0.8, 0, -0.4, 0]
                  }}
                  exit={{
                    scale: [1, 1.4, 0.6, 0],
                    y: [0, -6, -2, 4],
                    opacity: [1, 1, 0.5, 0],
                    transition: { duration: 0.9, ease: "easeOut" }
                  }}
                  transition={{ repeat: Infinity, duration: 0.5, ease: "easeInOut" }}
                  className="w-4 h-6 bg-gradient-to-t from-[#e67e22] via-[#f1c40f] to-[#fff3bf] rounded-full blur-[0.5px] shadow-[0_0_15px_rgba(230,126,34,0.8)]"
                />
              )}
            </AnimatePresence>
          </div>

          <svg viewBox="0 0 200 200" className="w-full h-full drop-shadow-md">
            <defs>
              <clipPath id="cake-base-clip">
                <rect x="40" y="115" width="120" height="50" rx="8" />
              </clipPath>
            </defs>

            {/* แท่งเทียน */}
            <rect x="97" y="45" width="6" height="22" rx="2" fill="#e74c3c" />
            <rect x="97" y="50" width="6" height="4" fill="#ffffff" />
            <rect x="97" y="58" width="6" height="4" fill="#ffffff" />

            {/* ครีมและสตรอว์เบอร์รี่ */}
            <circle cx="75" cy="74" r="7" fill="#e74c3c" />
            <circle cx="100" cy="70" r="9" fill="#e74c3c" />
            <circle cx="125" cy="74" r="7" fill="#e74c3c" />

            {/* เค้กชั้นบนสุด */}
            <rect x="60" y="75" width="80" height="40" rx="6" fill="#fdedec" />
            <path d="M60 85 c5 0, 5 7, 10 7 s5 -7, 10 -7 s5 7, 10 7 s5 -7, 10 -7 s5 7, 10 7 s5 -7, 10 -7 s5 7, 10 7 s5 -7, 10 -7 v10 h-80 z" fill="#f1948a" />

            {/* เค้กชั้นล่างฐานใหญ่ */}
            <rect x="40" y="115" width="120" height="50" rx="8" fill="#fdfefe" stroke="#f1f3f5" strokeWidth="1" />
            
            {/* ซอสช็อกโกแลตหน้านิ่มเยิ้ม ๆ */}
            <g clipPath="url(#cake-base-clip)">
              <path d="M30 123 c8 0, 8 8, 16 8 s8 -8, 16 -8 s8 8, 16 8 s8 -8, 16 -8 s8 8, 16 8 s8 -8, 16 -8 s8 8, 16 8 s8 -8, 16 -8 v22 h-140 z" fill="#5c3a21" />
              
              {/* เกล็ดน้ำตาล */}
              <rect x="55" y="145" width="6" height="2" rx="1" fill="#f1c40f" transform="rotate(15 55 145)" />
              <rect x="85" y="140" width="6" height="2" rx="1" fill="#2ecc71" transform="rotate(-20 85 140)" />
              <rect x="115" y="146" width="6" height="2" rx="1" fill="#e84393" transform="rotate(45 115 146)" />
              <rect x="140" y="142" width="6" height="2" rx="1" fill="#9b59b6" transform="rotate(-15 140 142)" />
            </g>

            {/* ขอบปิดฐานล่างสุด */}
            <rect x="40" y="162" width="120" height="3" fill="#5c3a21" />

            {/* ถาดรองเค้ก */}
            <rect x="25" y="165" width="150" height="8" rx="4" fill="#bdc3c7" />
          </svg>
        </div>

        {/* 🔘 ปุ่มกดเป่าเค้ก */}
        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          onClick={handleBlowCandle}
          disabled={isBlownOut}
          className={`w-full py-4 rounded-full font-bold text-sm uppercase tracking-wider shadow-md transition-all cursor-pointer outline-none ${
            isBlownOut 
              ? 'bg-gray-100 text-gray-400 cursor-not-allowed shadow-none' 
              : 'bg-gradient-to-r from-[#f4a7be] to-[#e8799a] text-white hover:from-[#e8799a] hover:to-[#f4a7be] shadow-[0_6px_20px_rgba(194,84,122,0.3)]'
          }`}
          style={{ fontFamily: "var(--font-mitr), 'Mitr', sans-serif" }}
        >
          {isBlownOut ? "🕯️ Your wish has come true!" : "MAKE A WISH & BLOW"}
        </motion.button>
      </motion.div>

      {/* PARTY EFFECT LAYER */}
      <AnimatePresence>
        {isExploding && (
          <div className="fixed inset-0 z-[500] flex items-center justify-center pointer-events-none">
            <motion.div 
              initial={{ scale: 0, opacity: 1 }}
              animate={{ scale: 65, opacity: 0 }}
              transition={{ duration: 1.5, ease: "easeOut" }}
              className="w-16 h-16 rounded-full border-2 border-[#f4a7be] absolute"
            />

            {Array.from({ length: 40 }).map((_, i) => {
              const items = ['🎈', '✨', '🎉', '🍰', '🍫', '💖'];
              const randomItem = items[i % items.length];
              return (
                <motion.span
                  key={i}
                  initial={{ x: 0, y: 0, opacity: 0, scale: 0.3 }}
                  animate={{ 
                    x: (Math.random() - 0.5) * 1300, 
                    y: (Math.random() - 0.5) * -1200, 
                    opacity: [0, 1, 1, 0],
                    scale: Math.random() * 1.6 + 1,
                    rotate: Math.random() * 360
                  }}
                  transition={{ delay: 0.02, duration: 1.6, ease: "easeOut" }}
                  className="absolute text-2xl"
                >
                  {randomItem}
                </motion.span>
              );
            })}
          </div>
        )}
      </AnimatePresence>

    </section>
  );
}