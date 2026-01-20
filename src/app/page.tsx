import Header from '@/components/header/header'
import About from './components/about/about'
import Footer from './components/footer/footer'
import Impact from './components/impact/impact'
import Product from './components/product/product'
import SplitterHome from './components/splitter_home/splitter_home'
import VideoComponet from './components/video/video'
import { getProducts } from './middleware/producs_list'

export const revalidate = 60

export default async function Home() {
  const product = await getProducts()

  return (
    <div>
      <Header />
      <SplitterHome />
      <About />
      <VideoComponet />
      <Impact />
      {product?.slice(0, 1).map(item => (
        <div key={item.uid}>
          <Product item={item} listProduct={product} />
        </div>
      ))}
      {/* <Gallery /> */}
      <Footer />
    </div>
  )
}
