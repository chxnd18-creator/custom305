"use client";
import { useState } from 'react';
import BirthdayThemePage from "@/app/components/BirthdayThemeSection";
import BirthdayMenuSection from "@/app/components/BirthdayMenuSection";
import BirthdayLetterSection from "@/app/components/BirthdayLetterSection";
import PhotoBoardSection from "@/app/components/PhotoBoardSection";
import GiftBoardSection from "@/app/components/GiftBoardSection"; 
import MusicWishBoard from "@/app/components/MakeAWishSection";

export default function Home() {
  const [step, setStep] = useState(1); // 1=เค้ก, 2=เมนู, 3=จดหมาย, 4=รูปภาพ, 5=ของขวัญดอกไม้, 6=เพลง/WishBoard

  return (
    <>
      {step === 1 && (
        <BirthdayThemePage onFinish={() => setStep(2)} />
      )}
      
      {step === 2 && (
        <BirthdayMenuSection onSelectMenu={(menuId) => {
          if (menuId === 'letter') setStep(3);
          if (menuId === 'photos' || menuId === 'photo' || menuId === 'gallery') setStep(4);
          if (menuId === 'gift' || menuId === 'present') setStep(5); 
          if (menuId === 'wish' || menuId === 'music' || menuId === 'song') setStep(6);
        }} />
      )}
      
      {step === 3 && (
        <BirthdayLetterSection onBackToMenu={() => setStep(2)} />
      )}

      {step === 4 && (
        <PhotoBoardSection onBackToMenu={() => setStep(2)} />
      )}

      {step === 5 && (
        <GiftBoardSection onBackToMenu={() => setStep(2)} /> 
      )}

      {step === 6 && (
        <MusicWishBoard onBackToMenu={() => setStep(2)} />
      )}
    </>
  );
}