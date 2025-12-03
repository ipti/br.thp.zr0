import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "primeflex/primeflex.css";
import "primeicons/primeicons.css";
import "../components/component.css";
import "./globals.css";
import Script from "next/script";

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
        <Script
          id="chatwoot-script"
          strategy="afterInteractive"
        >
          {`
        (function(d,t) {
          var BASE_URL="https://app.chatwoot.com";
          var g=d.createElement(t),s=d.getElementsByTagName(t)[0];
          g.src=BASE_URL+"/packs/js/sdk.js";
          g.async = true;
          s.parentNode.insertBefore(g,s);
          g.onload=function(){
            window.chatwootSDK.run({
              websiteToken: 'pKTvcMuXcCbKi3BxYXmAwb3g',
              baseUrl: BASE_URL
            })
          }
        })(document,"script");
      `}
        </Script>
        <div className="h-full home-container">
          {children}
        </div>
      </body>
    </html>
  );
}
