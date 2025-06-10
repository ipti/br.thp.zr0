import { ConditionalSlideBar } from "@/components/slider_bar/conditional";
import HeaderSeller from "@/components/header/header_seller/header_seller";
import { SliderBarType } from "@/components/slider_bar/type";
import { Providers } from "./provider";
import { SlideBarProvider } from "@/components/slider_bar/slide_bar_context";

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
    <SlideBarProvider>
      <Providers>

        <div className="h-full">
          {/* <HeaderSeller /> */}
          <div className="flex flex-row h-full">
            <ConditionalSlideBar itens={itensList.itens} />
            <div className="flex flex-column w-full">
              <HeaderSeller />
              <main className="h-full w-full overflow-auto p-4 md:p-8 ">
                {children}
              </main>
            </div>
            {/* <TabBar /> */}
          </div>
        </div>
      </Providers>
    </SlideBarProvider>
  );
}
