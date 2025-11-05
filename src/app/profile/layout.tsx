import Header from "@/components/header/header";
import { Providers } from "@/service/provider";
import { Suspense } from "react";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import BackButton from "@/components/back_button/back_button";
import { primeFlex } from "@/utils/prime_flex";

export default async function Layout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
     const prime = primeFlex();

    const cookieStore = cookies();
    const token = await cookieStore.get('access_token');

    if (!token) {
        redirect('/auth/login'); // Redireciona para login se não houver token
    }

    return (
        <div className="h-full">
            <div className="flex flex-column h-full w-full">
                <Header />
                <Providers>
                    <main className="h-full w-full overflow-auto p-4 md:p-8 ">
                        <BackButton />
                        <div className="mb-4"/>
                        <Suspense>
                            <div  className={ "h-full p-2 md:p-4"}>
                            {children}
                            </div>
                        </Suspense>
                    </main>
                </Providers>
            </div>
        </div>
    );
}