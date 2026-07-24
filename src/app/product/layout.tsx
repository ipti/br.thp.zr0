import { Providers } from '../../service/provider'
import Header from '@/components/header/header'
import Footer from '../components/footer/footer'

export default function ProductLayout({
  children
}: {
  children: React.ReactNode
}) {
  return (
    <div className="h-full">
      <Header />
      <main className="h-full">
        <Providers>
          {children}
        </Providers>
        <Footer />
      </main>
    </div>
  )
}
