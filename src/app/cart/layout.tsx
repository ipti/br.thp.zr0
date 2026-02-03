import Header from '@/components/header/header'
import { Providers } from '@/service/provider'
import { Suspense } from 'react'
import Footer from '../components/footer/footer'

export default function CartLayout({
  children
}: {
  children: React.ReactNode
}) {
  return (
    <div className="h-full">
      <div className="flex flex-column h-full w-full">
        <Header />
        <Providers>
          <main className="h-full w-full overflow-auto  ">
            <Suspense>{children}</Suspense>
          {/* <Footer /> */}
          </main>
        </Providers>
      </div>
    </div>
  )
}
