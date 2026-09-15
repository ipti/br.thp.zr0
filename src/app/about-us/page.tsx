import type { Metadata } from 'next'
import Header from '@/components/header/header'
import { getProducts } from '../middleware/producs_list'
import AboutClosing from './components/about_closing/about_closing'
import AboutHero from './components/about_hero/about_hero'
import AboutProducts from './components/about_products/about_products'
import FeaturedProduct from './components/featured_product/featured_product'
import './about_us.css'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Sobre nós | ZR0',
}

export default async function AboutUsPage() {
  const products = await getProducts()
  const featuredProducts = products.slice(0, 4)

  return (
    <div className="about-us">
      <Header />
      <main>
        <AboutHero />
        <AboutProducts products={featuredProducts} />
        <FeaturedProduct products={featuredProducts} />
        <AboutClosing />
      </main>
    </div>
  )
}
