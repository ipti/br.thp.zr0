import { Providers } from '../../service/provider'
import Header from '@/components/header/header'
import Footer from '../components/footer/footer'
import ProductScrollReset from './product_scroll_reset'

export default function ProductLayout({
  children
}: {
  children: React.ReactNode
}) {
  return (
    <div className="h-full">
      <ProductScrollReset />
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
