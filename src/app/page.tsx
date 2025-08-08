import CardProduct from "@/components/card_product/card_product";
import Header from "@/components/header/header";
import http from "@/service/axios";
import SplitterHome from "./components/splitter_home/splitter_home";
import About from "./components/about/about";
import Contact from "./components/contact/contact";


export default async function Home() {

  const product = await http.get("/product");

  return (
    <div>
      <Header />
      <SplitterHome />
      <About />
      <div className="p-4">
        <div className="grid">
          {product?.data?.map((item, index) => {
            return (
              <div className="col-12 md:col-4" key={index} >
                <CardProduct item={item} />
              </div>
            )
          })}
        </div>
      </div>
    </div>

  );
}
