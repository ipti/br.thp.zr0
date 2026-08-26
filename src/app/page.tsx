import Header from '@/components/header/header'
import About from './components/about/about'
import Footer from './components/footer/footer'
import Impact from './components/impact/impact'
import ClosingStatement from './components/landing/closing_statement/closing_statement'
import Hero from './components/landing/hero/hero'
import HowItWorks from './components/landing/how_it_works/how_it_works'
import Manifesto from './components/landing/manifesto/manifesto'
import Presence from './components/landing/presence/presence'
import ProductsShowcase from './components/landing/products_showcase/products_showcase'
import WorkshopShowcase from './components/landing/workshop_showcase/workshop_showcase'
import Product from './components/product/product'
import SplitterHome from './components/splitter_home/splitter_home'
import VideoComponet from './components/video/video'
import { getProducts } from './middleware/producs_list'

export const dynamic = 'force-dynamic'

const isNewLandingEnabled = process.env.NEW_LANDING_PAGE_ENABLED === 'true'

export default async function Home() {
  const product = await getProducts()

  return (
    <div>
      <Header />
      {isNewLandingEnabled ? (
        <>
          <Hero />
          <Manifesto />
          <WorkshopShowcase />
          <HowItWorks />
          <Presence />
          <ProductsShowcase products={product} />
          <ClosingStatement />
        </>
      ) : (
        <>
          <SplitterHome />
          <About />
          <VideoComponet />
          <Impact />
          <Product listProduct={product} />
        </>
      )}
      <Footer />
    </div>
  )
}
