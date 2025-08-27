import Header from "@/components/header/header";
import http from "@/service/axios";
import About from "./components/about/about";
import Impact from "./components/impact/impact";
import Product from "./components/product/product";
import SplitterHome from "./components/splitter_home/splitter_home";
import VideoComponet from "./components/video/video";
import Footer from "./components/footer/footer";
import Gallery from "./components/gallery/gallery";



export default async function Home() {

  const product = await http.get("/product");


  return (
    <div>
      <Header />
      <SplitterHome
      />
      <About />

      <VideoComponet />
      <Impact />
      <div className="p-4">
        {product?.data?.map((item, index) => {
          return (
            <div key={index} >
              <Product item={item} />
            </div>
          )
        })}
      </div>
      <Gallery />
      <Footer />
    </div>

  );
}
