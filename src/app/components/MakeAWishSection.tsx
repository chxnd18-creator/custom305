"use client";
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface MakeAWishProps {
  onBackToMenu?: () => void;
}

interface StarParticle {
  id: number;
  x: number;
  y: number;
  scale: number;
  duration: number;
  delay: number;
  rotate: number; // เก็บค่า random ไว้ใน data ไม่ให้เรียกตอน render
  starType: string;
}

const BACKGROUND_STARS = Array.from({ length: 20 }).map((_, i) => ({
  id: i,
  top: `${Math.random() * 80 + 10}%`,
  left: `${Math.random() * 90 + 5}%`,
  scale: Math.random() * 0.6 + 0.4,
  duration: Math.random() * 2 + 1.5,
  char: ["✨", "⭐", "💫"][Math.floor(Math.random() * 3)]
}));

export default function WishInputCard({ onBackToMenu }: MakeAWishProps) {
  const [wishText, setWishText] = useState('');
  const [isSent, setIsSent] = useState(false);
  const [stars, setStars] = useState<StarParticle[]>([]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!wishText.trim()) return;
    setIsSent(true);

    const generatedStars = Array.from({ length: 45 }).map((_, i) => ({
      id: i,
      x: Math.random() * 280 - 140,
      y: Math.random() * -320 - 260,
      scale: Math.random() * 0.8 + 0.4,
      duration: Math.random() * 1.4 + 0.8,
      delay: Math.random() * 0.1,
      rotate: Math.random() * 360 + 180, // เก็บไว้ใน data ไม่เรียกตอน render
      starType: ["✨", "⭐", "💫", "🌟"][Math.floor(Math.random() * 4)]
    }));
    setStars(generatedStars);
  };

  return (
    /* 🌟 จัด Layout ใหญ่: ใช้ h-screen ล็อกความสูงพอดีจอ และให้ flex-col items-center justify-center ทำงานร่วมกันแบบไม่มีอะไรขัด ดึงทุกอย่างรวมกันตรงกลาง */
    <section className="relative h-screen w-full bg-[#fff0f5] overflow-hidden p-6 flex flex-col items-center justify-center" style={{ fontFamily: "var(--font-mitr), 'Mitr', sans-serif" }}>
      
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,235,245,0.6)_0%,rgba(255,240,245,1)_100%)] pointer-events-none fixed" />

      {/* ดวงดาวกระพริบบนท้องฟ้าเบื้องหลัง */}
      <div className="absolute inset-0 pointer-events-none opacity-25">
        {BACKGROUND_STARS.map((star) => (
          <motion.span
            key={star.id}
            animate={{ opacity: [0.3, 1, 0.3] }}
            transition={{ repeat: Infinity, duration: star.duration, ease: "easeInOut" }}
            className="absolute text-lg select-none"
            style={{ top: star.top, left: star.left, fontSize: `${star.scale * 1.2}rem` }}
          >
            {star.char}
          </motion.span>
        ))}
      </div>

      {/* ✕ ปุ่มกดกลับหน้าเมนู ดีไซน์ดั้งเดิมลอยตำแหน่งสัมบูรณ์ไม่กวนใจใคร */}
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

      {/* 📦 กล่องคอนเทนต์หลัก: เคลียร์ค่า margin แปลกๆ ออกทั้งหมด ปล่อยให้ระบบ Flexbox ดึงอยู่ศูนย์กลางหน้าจอแบบธรรมชาติพอดีสายตา */}
      <div className="w-full max-w-[380px] flex flex-col items-center relative z-10">
        
        {/* หัวข้อ New Message ขยายขนาดชัดเจนเด่นตาแตก */}
        <div className="text-center mb-6 select-none">
          <h2 className="text-[#c2547a] font-bold text-2xl md:text-3xl tracking-widest uppercase mb-1.5" style={{ fontFamily: "var(--font-itim), 'Itim', cursive" }}>
            {!isSent ? "New Message ✉️" : "Message Sent! ⭐"}
          </h2>
          <p className="text-slate-400 text-xs font-medium tracking-wide">
            {!isSent ? "Type your wish and drop it into the box." : "Your wish has flown straight to the stars!"}
          </p>
        </div>

        {/* เอฟเฟกต์กลุ่มดวงดาวพุ่งทะยานจากกล่องข้อความ */}
        {isSent && (
          <div className="absolute inset-x-0 bottom-1/2 pointer-events-none flex items-center justify-center z-50">
            {stars.map((star) => (
              <motion.div
                key={star.id}
                initial={{ x: 0, y: 0, opacity: 0, scale: 0, rotate: 0 }}
                animate={{ 
                  x: star.x, 
                  y: star.y, 
                  opacity: [0, 1, 1, 0],
                  scale: [0, star.scale, star.scale * 0.6, 0],
                  rotate: star.rotate
                }}
                transition={{ 
                  duration: star.duration, 
                  delay: star.delay, 
                  ease: "easeOut" 
                }}
                style={{ willChange: "transform, opacity" }}
                className="absolute text-xl md:text-2xl select-none"
              >
                {star.starType}
              </motion.div>
            ))}
          </div>
        )}

        {/* 💌 โซนกล่องข้อความดีไซน์กล่องเมลมินิมอลเกาหลี */}
        <div className="w-full flex items-center justify-center">
          <AnimatePresence mode="wait">
            {!isSent ? (
              <motion.form
                key="mail-form"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                onSubmit={handleSubmit}
                className="w-full flex flex-col items-center"
              >
                {/* 💻 ตัวกล่องเมลทรงเหลี่ยมคมสไตล์แอปหน้าต่างเบราว์เซอร์ */}
                <div className="w-full bg-white border border-slate-200 shadow-[0_15px_40px_rgba(194,84,122,0.04)] rounded-none overflow-hidden">
                  
                  {/* หัวหน้าต่างเบราว์เซอร์พร้อมปุ่ม 3 จุด */}
                  <div className="w-full bg-slate-50/80 border-b border-slate-100 px-4 py-2.5 flex items-center justify-between select-none">
                    <div className="flex items-center gap-1.5">
                      <div className="w-2 h-2 rounded-full bg-[#f4a7be]" />
                      <div className="w-2 h-2 rounded-full bg-[#ffccd8]" />
                      <div className="w-2 h-2 rounded-full bg-slate-200" />
                    </div>
                    <span className="text-[9px] font-bold text-slate-400 tracking-wider" style={{ fontFamily: "var(--font-mitr), 'Mitr', sans-serif" }}>MOMENT_INBOX</span>
                    <div className="w-9" />
                  </div>

                  {/* รายละเอียดผู้ส่ง-ผู้รับ */}
                  <div className="px-4 py-2 border-b border-slate-100 flex flex-col gap-1 text-[10px] font-medium text-slate-400 text-left select-none bg-white">
                    <div><span className="font-bold text-[#c2547a]">From :</span> My special one 💖</div>
                    <div><span className="font-bold text-slate-500">To :</span> My Universe ✨</div>
                  </div>
                  
                  {/* พื้นที่สำหรับพิมพ์ข้อความ */}
                  <div className="p-4 bg-white">
                    <textarea
                      value={wishText}
                      onChange={(e) => setWishText(e.target.value)}
                      placeholder="Write your birthday wish in the message box right here..."
                      maxLength={200}
                      rows={4}
                      className="w-full text-xs md:text-sm text-[#5c4a3c] bg-transparent outline-none border-none resize-none placeholder:text-slate-300 font-medium leading-relaxed"
                    />
                  </div>
                </div>
                
                {/* ปุ่มกดส่งแบบโปร่งเส้นบางเฉียบ Outline */}
                <button
                  type="submit"
                  disabled={!wishText.trim()}
                  className={`mt-8 px-8 py-3 rounded-none text-[10px] font-black tracking-[0.3em] uppercase border active:scale-[0.97] transition-all outline-none cursor-pointer ${
                    wishText.trim()
                      ? 'bg-transparent text-[#c2547a] border-[#c2547a] hover:bg-[#c2547a] hover:text-white hover:shadow-[0_8px_20px_rgba(194,84,122,0.15)]'
                      : 'bg-transparent text-slate-300 border-slate-200 cursor-not-allowed'
                  }`}
                >
                  ✉ SEND WISH ✉
                </button>
              </motion.form>
            ) : (
              /* 💌 ตัวแสดงผลลัพธ์เมลเมื่อกดส่งเสร็จ คลีน เรียบหรู คุมเหลี่ยม */
              <motion.div
                key="mail-display"
                initial={{ opacity: 0, scale: 0.96, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ type: "spring", stiffness: 100, damping: 15 }}
                className="w-full bg-white border border-[#f4a7be]/30 shadow-[0_20px_45px_rgba(194,84,122,0.06)] rounded-none overflow-hidden relative"
              >
                <div className="w-full bg-[#fff5f8] border-b border-[#f4a7be]/10 px-4 py-2.5 flex items-center justify-between select-none">
                  <div className="flex items-center gap-1.5">
                    <div className="w-2 h-2 rounded-full bg-emerald-300" />
                    <div className="w-2 h-2 rounded-full bg-slate-200" />
                    <div className="w-2 h-2 rounded-full bg-slate-200" />
                  </div>
                  <span className="text-[9px] font-black text-[#c2547a] tracking-widest">WISH_DELIVERED ✓</span>
                  <div className="w-9" />
                </div>

                <div className="p-6 text-center">
                  <p className="text-[#5c4a3c] font-semibold text-xs md:text-sm leading-relaxed whitespace-pre-line select-none italic px-2">
                    "{wishText}"
                  </p>
                </div>
                
                <div className="absolute bottom-2 right-3 text-2xl opacity-15 select-none">🌟</div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

      </div>

      {/* 🎯 แก้ไขตรงนี้: ปลุกตำแหน่ง Absolute ตัวปิดท้ายหน้าจอ ให้อยู่ล่างสุดแบบคงที่พอดีๆ ไม่โดน Layout หลักดันลงไปชนตบขอบด้านล่าง */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-[9px] font-bold tracking-[0.25em] text-[#c2547a]/70 uppercase select-none border-t border-[#f4a7be]/15 pt-3 w-44 text-center z-10">
      </div>
    </section>
  );
}