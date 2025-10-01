import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "primeflex/primeflex.css";
import "primeicons/primeicons.css";
import "../components/component.css";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Zr0",
  description: "Transformando plástico em oportunidades",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        {/* <Header /> */} 
        <div className="h-full home-container">
        {children}
        </div>
      </body>
    </html>
  );
}
