import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CopyGuard from "@/components/CopyGuard";
import WhatsAppFab from "@/components/WhatsAppFab";
import { SITE } from "@/lib/site";

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: { default: `${SITE.name} · Aile ve Öğrenci Koçluğu`, template: `%s · ${SITE.name}` },
  description: "Öğrenci koçluğu, ebeveyn davranış eğitimi, mizaç ve öğrenme stili testleri. Çocuğun mutluluğunu ve aileyle iletişimini merkeze alan koçluk.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="tr">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        {/* eslint-disable-next-line @next/next/no-page-custom-font */}
        <link href="https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,500;12..96,700;12..96,800&family=Figtree:ital,wght@0,400;0,500;0,600;0,700;0,800;1,400&display=swap" rel="stylesheet" />
      </head>
      <body>
        <Header />
        <main>{children}</main>
        <Footer />
        <WhatsAppFab />
        <CopyGuard />
      </body>
    </html>
  );
}
