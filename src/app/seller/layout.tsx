import HeaderSeller from "@/components/header/header_seller/header_seller";
import SlideBar from "@/components/slider_bar/slider_bar";
import { SliderBarType } from "@/components/slider_bar/type";

export default function Seller({ children }: { children: React.ReactNode }) {
  const itensList: SliderBarType = {
    itens: [
      {
        label: "Oficinas de Transformações",
        icon: <i className="pi pi-warehouse"></i>,
        link: "/seller/transformation-workshop",
      },
      {
        label: "Categorias",
        icon: <i className="pi pi-sitemap"></i>,
        link: "/seller/transformation-workshop",
      },
      {
        label: "Produtos",
        icon: <i className="pi pi-th-large"></i>,
        link: "/seller/product",
      },
    ],
  };
  return (
    <div className="h-full">
      {/* <HeaderSeller /> */}
      <div className="flex flex-row h-full">
        <SlideBar itens={itensList.itens} />
        <div className="flex flex-column w-full">
          <HeaderSeller />
          <main className="h-full w-full p-8">{children}</main>
        </div>
        {/* <TabBar /> */}
      </div>
    </div>
  );
}
