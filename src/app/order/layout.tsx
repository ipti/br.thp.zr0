import Header from "@/components/header/header";
import { Providers } from "@/service/provider";
import { Suspense } from "react";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function OrderLayout({ children }: { children: React.ReactNode }) {

     const cookieStore = cookies();
      const token = await cookieStore.get('access_token');
    
      if (!token) {
        redirect('/auth/login'); // Redireciona para login se não houver token
      }
    
    
    return (
        <Providers>
            <div className="h-full">
                <main className="h-full">
                    <Header />
                    <Suspense>
                        {children}
                    </Suspense></main>
            </div>
        </Providers>
    );
}