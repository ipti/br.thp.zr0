import Header from "@/components/header/header";
import About from "./components/about/about";
import Footer from "./components/footer/footer";
import Gallery from "./components/gallery/gallery";
import Impact from "./components/impact/impact";
import Product from "./components/product/product";
import SplitterHome from "./components/splitter_home/splitter_home";
import VideoComponet from "./components/video/video";
import { getProducts } from "./middleware/producs_list";

export const revalidate = 60;

export default async function Home() {
  const product = await getProducts();

  console.log(product);

  return (
    <div>
      <Header />
      <SplitterHome />
      <About />
      <VideoComponet />
      <Impact />
      {product?.map((item: any, index: number) => (
        <div key={index}>
          <Product item={item} />
        </div>
      ))}
      {/* <Gallery /> */}
      <Footer />
    </div>
  );
}
