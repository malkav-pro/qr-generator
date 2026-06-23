import type { Metadata } from "next";
import {
  Hanken_Grotesk,
  Bricolage_Grotesque,
  Lora,
  Spline_Sans_Mono,
} from "next/font/google";
import { HashCleanup } from "@/components/HashCleanup";
import "./globals.css";

const hanken = Hanken_Grotesk({
  variable: "--font-hanken",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
});

const bricolage = Bricolage_Grotesque({
  variable: "--font-bricolage",
  subsets: ["latin"],
  weight: ["400", "600", "700", "800"],
  display: "swap",
});

const lora = Lora({
  variable: "--font-lora",
  subsets: ["latin"],
  style: ["italic", "normal"],
  weight: ["400", "500", "600"],
  display: "swap",
});

const spline = Spline_Sans_Mono({
  variable: "--font-spline",
  subsets: ["latin"],
  weight: ["400", "500"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "QR Code Generator",
  description: "Generate QR codes with high contrast for reliable scanning",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${hanken.variable} ${bricolage.variable} ${lora.variable} ${spline.variable}`}
    >
      <body className="antialiased">
        <HashCleanup />
        {children}
      </body>
    </html>
  );
}
