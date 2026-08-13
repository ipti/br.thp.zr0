import Header from '@/components/header/header'
import Footer from '@/app/components/footer/footer'

export default function ProductionOrderLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="production-order-layout">
      <Header />
      <main>{children}</main>
      <Footer />
    </div>
  )
}
