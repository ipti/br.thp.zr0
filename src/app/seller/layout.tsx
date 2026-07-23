import HeaderSeller from "@/components/header/header_seller/header_seller";
import { ConditionalSlideBar } from "@/components/slider_bar/conditional";
import { SlideBarProvider } from "@/components/slider_bar/slide_bar_context";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import { Providers } from "../../service/provider";
import { getProfile } from '../middleware/profile_server'
import { AccessPage } from "./components/access_page";
import { ProfileProvider } from "./context/profile.context";

export default async function Seller({ children }: { children: React.ReactNode }) {


  const cookieStore = await cookies()
  const token = cookieStore.get('access_token')

  if (!token) {
    redirect('/auth/login'); // Redireciona para login se não houver token
  }

  const profile = await getProfile(token.value)


  return (
    <SlideBarProvider>
      <Providers>
        <ProfileProvider profile={profile}>
          <div className="h-full">
            {/* <HeaderSeller /> */}
            <div className="flex flex-row h-full">
              <ConditionalSlideBar itens={profile?.menu ?? []} />
              <div className="flex flex-column w-full">
                <HeaderSeller />
                <main className="h-full w-full overflow-auto p-4 md:p-8 ">
                  <Suspense>
                    <AccessPage profile={profile} >{children}</AccessPage>
                  </Suspense>
                </main>
              </div>
              {/* <TabBar /> */}
            </div>
          </div>
        </ProfileProvider>
      </Providers>
    </SlideBarProvider >
  );
}
