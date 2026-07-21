"use client";
import { motion, Variants } from 'framer-motion';

interface BirthdayMenuProps {
  onSelectMenu: (menuId: string) => void;
}

export default function BirthdayMenuSection({ onSelectMenu }: BirthdayMenuProps) {
  
  // 📋 ปรับเปลี่ยนรายการเมนู: ใช้รูปภาพ/Emoji ตัวใหญ่ ๆ สื่ออารมณ์แทนตัวหนังสือรก ๆ ครับเพื่อน
  const menuItems = [
    { id: 'letter', icon: '💌', label: 'Secret Letter', color: 'from-[#fff0f5] to-[#ffe0ec]', border: 'border-[#f4a7be]/40' },
    { id: 'gallery', icon: '📸', label: 'Memory Gallery', color: 'from-[#fdf0f5] to-[#fce4ef]', border: 'border-[#f4a7be]/30' },
    { id: 'gift', icon: '🎁', label: 'Gift Quest', color: 'from-[#fff5f8] to-[#ffdde9]', border: 'border-[#f4c2d3]/40' },
    { id: 'wish', icon: '🎉', label: 'Wish Board', color: 'from-[#fef0f7] to-[#fce0f0]', border: 'border-[#f4a7be]/30' }
  ];

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, scale: 0.9, y: 15 },
    show: { 
      opacity: 1, 
      scale: 1, 
      y: 0, 
      transition: { type: "spring", stiffness: 120, damping: 14 } 
    }
  };

  return (
    <section className="relative min-h-screen w-full overflow-hidden bg-[#fff0f5] flex flex-col items-center justify-center p-6" style={{ fontFamily: "var(--font-mitr), 'Mitr', sans-serif" }}>
      
      {/* เอฟเฟกต์ตกแต่ง แบ็คกราวด์ลอยละล่อง */}
      <div className="absolute inset-0 pointer-events-none opacity-25">
        <motion.span animate={{ y: [-10, 10, -10] }} transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }} className="absolute top-12 left-8 text-4xl">🎈</motion.span>
        <motion.span animate={{ y: [10, -10, 10] }} transition={{ repeat: Infinity, duration: 5, ease: "easeInOut" }} className="absolute bottom-16 right-8 text-5xl">🎁</motion.span>
        <motion.span animate={{ scale: [1, 1.2, 1] }} transition={{ repeat: Infinity, duration: 3 }} className="absolute top-24 right-12 text-4xl">✨</motion.span>
      </div>

      {/* บล็อกคอนเทนเนอร์การ์ดหลัก */}
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="bg-white w-full max-w-[360px] rounded-[32px] p-8 shadow-[0_12px_40px_rgba(194,84,122,0.1)] border border-[#f4a7be]/20 flex flex-col items-center relative z-10"
      >
        <span className="text-[#e8a0bb] font-bold tracking-[0.25em] text-[10px] uppercase mb-1" style={{ fontFamily: "var(--font-mitr), 'Mitr', sans-serif" }}>Open Your Gift</span>
        <h2 className="text-[#c2547a] text-xl font-bold tracking-tight mb-8 leading-none" style={{ fontFamily: "var(--font-itim), 'Itim', cursive" }}>
          Choose a Surprise ✨
        </h2>

        {/* 🔘 ZONE GRID 2*2: ปรับสิทธิ์เรียงสองฝั่งซ้ายขวา ลงล็อกสี่เหลี่ยมจัตุรัสน่ารักแบบไอโฟน */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="w-full grid grid-cols-2 gap-4"
        >
          {menuItems.map((item) => (
            <motion.button
              key={item.id}
              variants={itemVariants}
              whileHover={{ scale: 1.04, y: -3 }}
              whileTap={{ scale: 0.96 }}
              onClick={() => onSelectMenu(item.id)}
              className={`aspect-square w-full rounded-2xl bg-gradient-to-br ${item.color} border ${item.border} flex flex-col items-center justify-center relative overflow-hidden shadow-sm hover:shadow-md transition-all cursor-pointer outline-none group`}
            >
              {/* แสงวิบวับเวลาเอามือไปชี้หรือ Hover โดนปุ่ม */}
              <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              
              {/* 📸 รูปไอคอนภาพลักษณ์โดดเด่นตรงกลางบล็อก */}
              <span className="text-4xl filter drop-shadow-sm group-hover:scale-110 transition-transform duration-300 select-none">
                {item.icon}
              </span>
              
              {/* ชื่อกำกับตัวจิ๋วมินิมอลด้านล่างรูปภาพ เพื่อให้ผู้ใช้งานไม่งงสิทธิ์ */}
              <span className="mt-3 text-[10px] font-bold tracking-wider text-[#c2547a]/60 uppercase select-none"
                style={{ fontFamily: "var(--font-mitr), 'Mitr', sans-serif" }}>
                {item.label}
              </span>
            </motion.button>
          ))}
        </motion.div>
      </motion.div>

    </section>
  );
}