import type { Metadata } from "next";
import { Itim, Mitr } from "next/font/google";
import "./globals.css";

// ฟอนต์หลัก: Itim — ลายมือสวย ดูน่ารัก วัยรุ่น รองรับภาษาไทย
const itim = Itim({
  variable: "--font-itim",
  subsets: ["latin", "thai"],
  weight: "400",
});

// ฟอนต์รอง: Mitr — หัวกลม อ่านง่าย มีหลาย weight รองรับภาษาไทย
const mitr = Mitr({
  variable: "--font-mitr",
  subsets: ["latin", "thai"],
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Happy Birthday 🎂",
  description: "A special birthday surprise just for you 💖",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="th"
      className={`${itim.variable} ${mitr.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
