import HeaderSeller from "@/components/header/header_seller/header_seller";
import SlideBar from "@/components/slider_bar/slider_bar";
import { SliderBarType } from "@/components/slider_bar/type";
import { Providers } from "./provider";

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
        link: "/seller/category",
      },
      {
        label: "Produtos",
        icon: <i className="pi pi-th-large"></i>,
        link: "/seller/product",
      },

      {
        label: "Usuários",
        icon: <i className="pi pi-users"></i>,
        link: "/seller/user",
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
          <main className="h-full w-full p-8">
            <Providers>{children}</Providers>
          </main>
        </div>
        {/* <TabBar /> */}
      </div>
    </div>
  );
}
