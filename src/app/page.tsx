import Header from "@/components/header/header";
import About from "./components/about/about";
import Impact from "./components/impact/impact";
import Product from "./components/product/product";
import VideoComponet from "./components/video/video";
import Footer from "./components/footer/footer";
import Gallery from "./components/gallery/gallery";
import SplitterHome from "./components/splitter_home/splitter_home";



export default async function Home() {

  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}product`, {
    cache: "no-store", // se não quiser cache
  });

  console.log(res)

  // if (!res.ok) {
  //   throw new Error("Erro ao buscar produtos");
  // }

  const product = await res.json();

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
