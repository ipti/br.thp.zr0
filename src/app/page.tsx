import Header from "@/components/header/header";
import About from "./components/about/about";
import Impact from "./components/impact/impact";
import Product from "./components/product/product";
import VideoComponet from "./components/video/video";
import Footer from "./components/footer/footer";
import Gallery from "./components/gallery/gallery";
import SplitterHome from "./components/splitter_home/splitter_home";

export const revalidate = 60; 
// a cada 60s revalida, mas serve página estática no meio tempo (ISR)
// ou use "false" para estático 100% no build

export default async function Home() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/product`, {
    next: { revalidate: 60 }, // tira cache: "no-store"
  });

  if (!res.ok) {
    throw new Error("Erro ao buscar produtos");
  }

  const product = await res.json();

  return (
    <div>
      <Header />
      <SplitterHome />
      <About />
      <VideoComponet />
      <Impact />
      <div className="p-4">
        {product?.data?.map((item: any, index: number) => (
          <div key={index}>
            <Product item={item} />
          </div>
        ))}
      </div>
      <Gallery />
      <Footer />
    </div>
  );
}
