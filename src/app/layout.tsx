import type { Metadata } from 'next'
import 'primeflex/primeflex.css'
import 'primeicons/primeicons.css'
import '../components/component.css'
import './globals.css'
import Script from 'next/script'
import { ToastProvider } from '@/components/toast/context'
import { getSiteUrl } from '@/service/server_api'

export const metadata: Metadata = {
  metadataBase: new URL(getSiteUrl()),
  title: {
    default: 'ZR0',
    template: '%s',
  },
  description: 'Transformando plástico em oportunidades',
  robots: {
    index: true,
    follow: true,
  },
}

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="pt-BR">
      <body>
        <Script id="chatwoot-script" strategy="afterInteractive">
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
          <ToastProvider>{children}</ToastProvider>
        </div>
      </body>
    </html>
  )
}
