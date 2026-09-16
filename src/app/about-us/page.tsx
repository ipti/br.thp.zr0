import type { Metadata } from 'next'
import Header from '@/components/header/header'
import pingos from '@/assets/img/home/pingos.svg'
import { getProducts } from '../middleware/producs_list'
import AboutClosing from './components/about_closing/about_closing'
import AboutHero from './components/about_hero/about_hero'
import AboutProducts from './components/about_products/about_products'
import FeaturedProduct from './components/featured_product/featured_product'
import Footer from '../components/footer/footer'
import './about_us.css'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Sobre nós | ZR0',
}

export default async function AboutUsPage() {
  const products = await getProducts()
  const referenceOrder = ['cadeira', 'mesa de centro', 'mesa rostarte', 'mesa alta']
  const featuredProducts = [...products]
    .sort((first, second) => {
      const firstIndex = referenceOrder.indexOf(first.name.toLocaleLowerCase('pt-BR'))
      const secondIndex = referenceOrder.indexOf(second.name.toLocaleLowerCase('pt-BR'))

      return (
        (firstIndex === -1 ? referenceOrder.length : firstIndex) -
        (secondIndex === -1 ? referenceOrder.length : secondIndex)
      )
    })
    .slice(0, 4)

  return (
    <div className="about-us">
      <Header />
      <main>
        <AboutHero />
        <div className="about-us__body">
          <div className="about-us__decor" aria-hidden="true">
            <svg
              className="about-us__decor-image"
              viewBox="0 0 1920 1980"
              preserveAspectRatio="none"
              aria-hidden="true"
            >
              <defs>
                <filter
                  id="about-us-palette"
                  x="0"
                  y="0"
                  width="1920"
                  height="1980"
                  filterUnits="userSpaceOnUse"
                  colorInterpolationFilters="sRGB"
                >
                  <feColorMatrix
                    type="matrix"
                    values="0.2126 0.7152 0.0722 0 0 0.2126 0.7152 0.0722 0 0 0.2126 0.7152 0.0722 0 0 0 0 0 1 0"
                  />
                  <feComponentTransfer>
                    <feFuncR type="linear" slope="0.716" intercept="0.293" />
                    <feFuncG type="linear" slope="0.574" intercept="0.378" />
                    <feFuncB type="linear" slope="0.503" intercept="0.342" />
                  </feComponentTransfer>
                </filter>
              </defs>
              <image
                href={pingos.src}
                width="1920"
                height="1980"
                preserveAspectRatio="none"
                filter="url(#about-us-palette)"
              />
            </svg>
          </div>

          <AboutProducts products={featuredProducts} />
          <FeaturedProduct products={featuredProducts} />
          <AboutClosing />
        </div>
      </main>
      <Footer />
    </div>
  )
}
