"use client";
import { motion, AnimatePresence, useDragControls } from 'framer-motion';
import { useState, useEffect, useRef } from 'react';

interface BirthdayLetterProps {
  onBackToMenu?: () => void;
}

export default function BirthdayLetterSection({ onBackToMenu }: BirthdayLetterProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isScratched, setIsScratched] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const isDrawingRef = useRef(false);
  const dragControls = useDragControls();

  // เอฟเฟกต์การสร้างและควบคุมการขูดรูปโพลารอยด์ด้วย Canvas
  useEffect(() => {
    if (!isOpen) return;

    // หน่วงเวลาเล็กน้อยเพื่อให้แอนิเมชันกางกระดาษโพลารอยด์รันเสร็จก่อนดึงค่า Element
    const timer = setTimeout(() => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      // ตั้งขนาด Canvas ให้พอดีกับกรอบรูปโพลารอยด์
      canvas.width = canvas.parentElement?.clientWidth || 120;
      canvas.height = canvas.parentElement?.clientHeight || 120;

      // เคลือบผิวหน้าโพลารอยด์ด้วยสีขาวพาสเทลนวลๆ
      ctx.fillStyle = '#fbfbfc';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // เขียนข้อความบอกใบ้แฟนให้ลองขูดดู
      ctx.font = 'normal 11px font-sans, sans-serif';
      ctx.fillStyle = '#f4a7be';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('SCRATCH ME! ✨', canvas.width / 2, canvas.height / 2);

      // ฟังก์ชันเช็คเปอร์เซ็นต์การขูด
      const checkScratchPercentage = () => {
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const pixels = imageData.data;
        let clearedPixels = 0;

        for (let i = 3; i < pixels.length; i += 4) {
          if (pixels[i] === 0) clearedPixels++;
        }

        const percentage = (clearedPixels / (pixels.length / 4)) * 100;
        // ถ้าขูดเกิน 45% ให้แอนิเมชันเฟดสีขาวที่เหลือออกทั้งหมดเพื่อแสดงรูปชัดๆ
        if (percentage > 45) {
          setIsScratched(true);
        }
      };

      // ฟังก์ชันลบสีขาวออกตามตำแหน่งเมาส์/นิ้ว
      const scratch = (clientX: number, clientY: number) => {
        const rect = canvas.getBoundingClientRect();
        const x = clientX - rect.left;
        const y = clientY - rect.top;

        ctx.globalCompositeOperation = 'destination-out';
        ctx.beginPath();
        ctx.arc(x, y, 16, 0, Math.PI * 2); // รัศมีแปรงขูด 16px
        ctx.fill();
        checkScratchPercentage();
      };

      // Desktop Mouse Events
      const handleMouseDown = () => { isDrawingRef.current = true; };
      const handleMouseUp = () => { isDrawingRef.current = false; };
      const handleMouseMove = (e: MouseEvent) => {
        if (!isDrawingRef.current) return;
        scratch(e.clientX, e.clientY);
      };

      // Mobile Touch Events
      const handleTouchStart = () => { isDrawingRef.current = true; };
      const handleTouchEnd = () => { isDrawingRef.current = false; };
      const handleTouchMove = (e: TouchEvent) => {
        if (!isDrawingRef.current || e.touches.length === 0) return;
        scratch(e.touches[0].clientX, e.touches[0].clientY);
      };

      canvas.addEventListener('mousedown', handleMouseDown);
      canvas.addEventListener('mouseup', handleMouseUp);
      canvas.addEventListener('mouseleave', handleMouseUp);
      canvas.addEventListener('mousemove', handleMouseMove);

      canvas.addEventListener('touchstart', handleTouchStart);
      canvas.addEventListener('touchend', handleTouchEnd);
      canvas.addEventListener('touchmove', handleTouchMove, { passive: true });

    }, 600); // รอจังหวะสปริงตัวของโพลารอยด์เสร็จสิ้น

    return () => clearTimeout(timer);
  }, [isOpen]);

  return (
    <section className="relative min-h-screen w-full overflow-hidden bg-[#fff0f5] flex flex-col items-center justify-center p-6" style={{ fontFamily: "var(--font-mitr), 'Mitr', sans-serif" }}>
      
      {/* 🎈 เอฟเฟกต์ตกแต่ง แบ็คกราวด์พาสเทลลอยละล่องเซ็ตเดิม */}
      <div className="absolute inset-0 pointer-events-none opacity-20">
        <motion.span animate={{ y: [-10, 10, -10] }} transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }} className="absolute top-12 left-8 text-4xl">🎈</motion.span>
        <motion.span animate={{ scale: [1, 1.2, 1] }} transition={{ repeat: Infinity, duration: 3 }} className="absolute bottom-20 left-12 text-4xl">✨</motion.span>
        <motion.span animate={{ y: [10, -10, 10] }} transition={{ repeat: Infinity, duration: 5 }} className="absolute top-24 right-8 text-3xl">🌸</motion.span>
      </div>

      {/* ✕ ปุ่มกดกลับหน้าเมนู */}
      {onBackToMenu && (
        <button
          onClick={onBackToMenu}
          className="absolute top-6 left-6 px-5 py-2.5 rounded-full bg-white shadow-sm hover:shadow-md border border-[#f4a7be]/30 text-[#c2547a] text-xs tracking-widest cursor-pointer outline-none transition-all z-50"
          style={{ fontFamily: "var(--font-mitr), 'Mitr', sans-serif" }}
        >
          BACK TO MENU
        </button>
      )}

      {/* ปรับความสูงพื้นที่ครอบให้บาลานซ์กับจดหมายขนาดกะทัดรัดพอดีข้อความ */}
      <div className="w-full max-w-[640px] flex flex-col items-center justify-center relative min-h-[480px]">
        
        <AnimatePresence mode="wait">
          {!isOpen ? (
            /* 📬 ฉากที่ 1: หน้าซองจดหมายปิดสนิท รอให้กดเปิด */
            <motion.div
              key="closed-envelope"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.05, y: -20, transition: { duration: 0.4, ease: "easeIn" } }}
              onClick={() => setIsOpen(true)}
              className="relative w-72 h-48 flex items-center justify-center cursor-pointer hover:scale-[1.03] transition-transform duration-350"
              style={{ perspective: "1000px" }}
            >
              {/* บอดี้ซองจดหมายหลักสีชมพูพาสเทล */}
              <div className="absolute inset-0 bg-gradient-to-br from-[#ffe3ec] to-[#ffccd8] rounded-[32px] shadow-[0_12px_35px_rgba(232,120,154,0.18)] border-2 border-white p-0 z-10 overflow-hidden">
                <svg viewBox="0 0 100 66" className="absolute inset-0 w-full h-full opacity-35" preserveAspectRatio="none">
                  <path d="M0,66 L38,30 M100,66 L62,30" fill="none" stroke="#c2547a" strokeWidth="0.8" strokeLinecap="round" />
                  <path d="M0,66 L50,32 L100,66" fill="#ffccd8" opacity="0.4" stroke="#c2547a" strokeWidth="0.5" />
                </svg>
              </div>

              {/* ฝากล่องสามเหลี่ยมด้านบน */}
              <div 
                className="absolute top-0 inset-x-0 h-1/2 bg-[#f4a7be] border-t-2 border-x-2 border-white opacity-95 pointer-events-none z-20"
                style={{ 
                  transformOrigin: "top", 
                  clipPath: 'polygon(0 0, 100% 0, 50% 100%)',
                  borderRadius: '32px 32px 0 0'
                }}
              />

              {/* ❤️ หัวใจดวงโตตรงกลาง */}
              <motion.div 
                animate={{ scale: [1, 1.08, 1] }}
                transition={{ repeat: Infinity, duration: 1.8, ease: "easeInOut" }}
                className="absolute z-30 text-5xl drop-shadow-[0_4px_12px_rgba(232,120,154,0.35)] select-none pointer-events-none"
                style={{ top: 'calc(50% - 24px)' }}
              >
                ❤️
              </motion.div>

              {/* ตัวอักษรไกด์ด้านล่างซองจดหมาย */}
              <div className="absolute -bottom-12 inset-x-0 text-[10px] tracking-[0.25em] text-[#c2547a] uppercase text-center animate-pulse" style={{ fontFamily: "var(--font-mitr), 'Mitr', sans-serif" }}>
                ... TAP THE HEART TO OPEN LETTER ...
              </div>
            </motion.div>
          ) : (
            /* 📜 ฉากที่ 2: ฉากแสดงตัวจดหมายและพร็อพตกแต่งหลังเปิดซอง */
            <motion.div
              key="opened-contents"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, staggerChildren: 0.15 }}
              className="relative w-full flex flex-col items-center justify-center p-4"
            >
              {/* 1. แผ่นกระดาษจดหมายหลัก */}
              <motion.div
                initial={{ opacity: 0, scale: 0.9, rotate: 0, y: 30 }}
                animate={{ opacity: 1, scale: 1, rotate: -4, y: 0 }}
                transition={{ type: "spring", stiffness: 80, damping: 15 }}
                className="relative bg-[#fffdf6] w-full max-w-[420px] min-h-[220px] rounded-sm p-6 md:p-8 border border-[#e2d9c5] shadow-[0_15px_35px_rgba(194,84,122,0.12)] z-20 flex flex-col items-center justify-center"
              >
                {/* 🎀 ลายเส้นโบว์ตรงกลางหัวจดหมาย */}
                <div className="absolute top-5 left-1/2 -translate-x-1/2 select-none opacity-75">
                  <svg width="45" height="25" viewBox="0 0 45 25" fill="none" stroke="#6893a7" strokeWidth="1.5">
                    <path d="M22.5,12.5 C15,2 8,6 15,12.5 C22,19 22.5,12.5 22.5,12.5 Z" />
                    <path d="M22.5,12.5 C30,2 37,6 30,12.5 C23,19 22.5,12.5 22.5,12.5 Z" />
                    <path d="M22.5,12.5 C20,18 16,23 18,24" />
                    <path d="M22.5,12.5 C25,18 29,23 27,24" />
                  </svg>
                </div>

                {/* เนื้อความจดหมายปรับขนาดตัวอักษรให้เล็กลง */}
                <h3 className="text-[#c2547a] text-xs md:text-sm mb-3 tracking-wide text-center select-none" style={{ fontFamily: "var(--font-itim), 'Itim', cursive" }}>

                </h3>
                <p className="text-[#7a3050] text-xs md:text-sm leading-relaxed text-center font-normal whitespace-pre-line mt-4" style={{ fontFamily: "var(--font-mitr), 'Mitr', sans-serif" }}>
                  HAPPY BIRTHDAY TO MY FAVORITE PERSON. 🌻🫶🏻
                  หนูขอให้พี่เต้ยเอนจอยกับการใช้ชีวิตในแต่ละวัน
                  มีความสุขมากกกกกในทุกๆวัน กินอิ่ม นอนหลับ ตื่นมามีแต่รอยยิ้ม และขอให้พี่หลงรักหนูมากกกในทุกๆวันด้วย 555555555 {"\n"}
                </p>
              </motion.div>

              {/* 2. กรอบรูปโพลารอยด์คู่ — ลากเลื่อนออกจากจดหมายได้ */}
              <motion.div
                drag
                dragControls={dragControls}
                dragListener={false}
                dragMomentum={false}
                dragElastic={0.1}
                onDragStart={() => setIsDragging(true)}
                onDragEnd={() => setIsDragging(false)}
                initial={{ opacity: 0, scale: 0.8, rotate: 15, x: 100 }}
                animate={{ opacity: 1, scale: 1, rotate: 6, x: 45 }}
                transition={{ type: "spring", stiffness: 70, damping: 13, delay: 0.2 }}
                className="absolute right-2 md:right-10 bottom-12 bg-white p-2.5 pb-0 shadow-[5px_12px_30px_rgba(0,0,0,0.15)] border border-slate-100 z-30 w-32 md:w-36 rounded-sm rotate-[6deg] select-none"
                style={{ touchAction: 'none' }}
              >
                <div className="w-full aspect-square bg-[#222] overflow-hidden rounded-sm relative touch-none">
                  {/* รูปภาพจริงที่ซ่อนอยู่ด้านหลัง */}
                  <img 
                    src="/images/couple.jpeg" 
                    alt="Our Special Memory" 
                    className="w-full h-full object-cover pointer-events-none"
                    onError={(e) => {
                      e.currentTarget.src = "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 100 100'><rect width='100' height='100' fill='%232a2625'/></svg>";
                    }}
                  />
                  {/* ชั้นเคลือบสีขาวนวลสำหรับขูด */}
                  {!isScratched && (
                    <canvas 
                      ref={canvasRef} 
                      className="absolute inset-0 w-full h-full cursor-pointer z-10 transition-opacity duration-500"
                      style={{ touchAction: 'none' }}
                    />
                  )}
                </div>

                {/* แถบ DRAG ME ด้านล่าง — กดตรงนี้เท่านั้นถึงจะลากได้ */}
                <div
                  onPointerDown={(e) => {
                    e.stopPropagation();
                    dragControls.start(e);
                  }}
                  className="w-full py-1.5 flex items-center justify-center gap-1 cursor-grab active:cursor-grabbing"
                >
                  <span className="text-[10px] tracking-widest text-[#c2547a]/80 select-none" style={{ fontFamily: "var(--font-mitr), 'Mitr', sans-serif" }}>
                    {isDragging ? '✦ dragging ✦' : '⠿ DRAG ME'}
                  </span>
                </div>
              </motion.div>

              {/* 3. 🌸 รูปภาพดอกไม้ flower3.png ที่มุมล่างซ้ายตามเดิม */}
              <motion.div
                initial={{ opacity: 0, scale: 0.7, rotate: -25 }}
                animate={{ opacity: 1, scale: 1, rotate: -12 }}
                transition={{ type: "spring", stiffness: 60, damping: 14, delay: 0.3 }}
                className="absolute -left-6 md:left-2 -bottom-6 w-28 md:w-36 aspect-square z-40 select-none pointer-events-none"
              >
                <img 
                  src="/images/flower7.png" 
                  alt="White Lily flower3" 
                  className="w-full h-full object-contain filter drop-shadow-[0_8px_15px_rgba(194,84,122,0.15)]"
                />
              </motion.div>

              {/* 4. 🧸 น้องหมีตัวใหญ่ พิกัดตำแหน่ง x: 45 ล็อกคู่กันสวยงามตามเดิม */}
              <motion.div
                initial={{ opacity: 0, scale: 0.5, y: 20 }}
                animate={{ opacity: 1, scale: 1, x: 45, y: 0 }}
                transition={{ type: "spring", stiffness: 90, damping: 12, delay: 0.4 }}
                className="absolute right-[76px] md:right-[92px] -bottom-5 w-24 h-24 z-40 flex flex-col items-center select-none pointer-events-none filter drop-shadow-[0_5px_12px_rgba(0,0,0,0.15)]"
              >
                {/* หมวกปาร์ตี้ดุ๊กดิ๊กด้านบนหัวน้องหมี */}
                <motion.span 
                  animate={{ y: [-2, 2, -2], rotate: [-5, 5, -5] }}
                  transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
                  className="text-2xl z-10 -mb-2"
                >
                </motion.span>
                <img 
                  src="/images/bear.png" 
                  alt="Birthday Big Bear" 
                  className="w-full h-full object-contain"
                />
              </motion.div>

            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </section>
  );
}