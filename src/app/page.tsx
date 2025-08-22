import Header from "@/components/header/header";
import http from "@/service/axios";
import About from "./components/about/about";
import Impact from "./components/impact/impact";
import Product from "./components/product/product";
import SplitterHome from "./components/splitter_home/splitter_home";
import VideoComponet from "./components/video/video";



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
        <div className="grid">
          {product?.data?.map((item, index) => {
            return (
              <div className="col-12 md:col-4" key={index} >
                <Product item={item} />
              </div>
            )
          })}
        </div>
      </div>
    </div>

  );
}
