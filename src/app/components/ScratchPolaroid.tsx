"use client";
import { useEffect, useRef, useState } from 'react';

interface ScratchPolaroidProps {
  imgSrc: string;
  altText: string;
}

export default function ScratchPolaroid({ imgSrc, altText }: ScratchPolaroidProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const isDrawingRef = useRef(false);
  const [isScratched, setIsScratched] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // ตั้งค่าขนาด Canvas ให้เท่ากับขนาดจริงของ Element
    const resizeCanvas = () => {
      canvas.width = canvas.parentElement?.clientWidth || 120;
      canvas.height = canvas.parentElement?.clientHeight || 120;

      // เทพื้นหลังสีขาวนวลๆ (หรือเปลี่ยนเป็นเทาสลัวๆ ให้รู้ว่าขูดได้)
      ctx.fillStyle = '#f3f4f6'; 
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // เพิ่มข้อความ Guide เล็กๆ บนชั้นผิวที่จะขูด
      ctx.font = 'bold 11px sans-serif';
      ctx.fillStyle = '#9ca3af';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('SCRATCH ME! ✨', canvas.width / 2, canvas.height / 2);
    };

    resizeCanvas();

    // ฟังก์ชันคำนวณพื้นที่ที่ถูกขูดไปแล้ว
    const checkScratchPercentage = () => {
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const pixels = imageData.data;
      let clearedPixels = 0;

      // ดึงค่า Alpha Channel (พิกเซลที่ถูกลบโปร่งใส)
      for (let i = 3; i < pixels.length; i += 4) {
        if (pixels[i] === 0) clearedPixels++;
      }

      const percentage = (clearedPixels / (pixels.length / 4)) * 100;
      
      // ถ้าขูดไปมากกว่า 45% ให้ถือว่าเปิดเผยรูปทั้งหมดเลย
      if (percentage > 45) {
        setIsScratched(true);
      }
    };

    // Logic การลากเส้นลบสี (ใช้ globalCompositeOperation = 'destination-out')
    const scratch = (x: number, y: number) => {
      ctx.globalCompositeOperation = 'destination-out';
      ctx.beginPath();
      ctx.arc(x, y, 16, 0, Math.PI * 2); // 16 คือขนาดหัวแปรงขูด
      ctx.fill();
      checkScratchPercentage();
    };

    // ดักจับ Event จาก เมาส์
    const handleMouseDown = () => { isDrawingRef.current = true; };
    const handleMouseUp = () => { isDrawingRef.current = false; };
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDrawingRef.current) return;
      const rect = canvas.getBoundingClientRect();
      scratch(e.clientX - rect.left, e.clientY - rect.top);
    };

    // ดักจับ Event จาก นิ้วสัมผัสบนมือถือ (Touch Events)
    const handleTouchStart = () => { isDrawingRef.current = true; };
    const handleTouchEnd = () => { isDrawingRef.current = false; };
    const handleTouchMove = (e: TouchEvent) => {
      if (!isDrawingRef.current || e.touches.length === 0) return;
      const rect = canvas.getBoundingClientRect();
      const touch = e.touches[0];
      scratch(touch.clientX - rect.left, touch.clientY - rect.top);
    };

    // ผูก Event Listeners
    canvas.addEventListener('mousedown', handleMouseDown);
    canvas.addEventListener('mouseup', handleMouseUp);
    canvas.addEventListener('mouseleave', handleMouseUp);
    canvas.addEventListener('mousemove', handleMouseMove);

    canvas.addEventListener('touchstart', handleTouchStart);
    canvas.addEventListener('touchend', handleTouchEnd);
    canvas.addEventListener('touchmove', handleTouchMove, { passive: true });

    return () => {
      canvas.removeEventListener('mousedown', handleMouseDown);
      canvas.removeEventListener('mouseup', handleMouseUp);
      canvas.removeEventListener('mouseleave', handleMouseUp);
      canvas.removeEventListener('mousemove', handleMouseMove);
      canvas.removeEventListener('touchstart', handleTouchStart);
      canvas.removeEventListener('touchend', handleTouchEnd);
      canvas.removeEventListener('touchmove', handleTouchMove);
    };
  }, []);

  return (
    <div className="w-full aspect-square bg-[#222] overflow-hidden rounded-sm relative select-none touch-none">
      {/* 1. รูปภาพด้านหลังสุด */}
      <img 
        src={imgSrc} 
        alt={altText} 
        className="w-full h-full object-cover pointer-events-none"
        onError={(e) => {
          e.currentTarget.src = "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 100 100'><rect width='100' height='100' fill='%232a2625'/></svg>";
        }}
      />

      {/* 2. ผืนผ้าใบสีขาวที่อยู่ข้างบนไว้ให้ขูด (จะหายไปเมื่อขูดครบกำหนด) */}
      {!isScratched && (
        <canvas 
          ref={canvasRef} 
          className="absolute inset-0 w-full h-full cursor-pointer z-10 transition-opacity duration-500"
        />
      )}
    </div>
  );
}