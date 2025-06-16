import HeaderSeller from "@/components/header/header_seller/header_seller";
import { ConditionalSlideBar } from "@/components/slider_bar/conditional";
import { SlideBarProvider } from "@/components/slider_bar/slide_bar_context";
import { SliderBarType } from "@/components/slider_bar/type";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { Providers } from "./provider";

export default function Seller({ children }: { children: React.ReactNode }) {

  const cookieStore = cookies();
  const token = cookieStore.get('access_token');

  if (!token) {
    redirect('/auth/login'); // Redireciona para login se não houver token
  }
  const itensListManager: SliderBarType = {
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

  const itensListSeller: SliderBarType = {
    itens: [
      {
        label: "Pedidos da OT",
        icon: <i className="pi pi-receipt"></i>,
        link: "/seller/product",
      },
      {
        label: "Produtos da OT",
        icon: <i className="pi pi-th-large"></i>,
        link: "/seller/product/tw",
      },
      {
        label: "Membros da OT",
        icon: <i className="pi pi-users"></i>,
        link: "/seller/product",
      },
      
    ],
  };




  return (
    <SlideBarProvider>
      <Providers>

        <div className="h-full">
          {/* <HeaderSeller /> */}
          <div className="flex flex-row h-full">
            <ConditionalSlideBar itens={itensListManager.itens} />
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
