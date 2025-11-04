import Header from "@/components/header/header";
import { Providers } from "@/service/provider";
import { Suspense } from "react";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import BackButton from "@/components/back_button/back_button";

export default async function Layout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {

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
                            {children}
                        </Suspense>
                    </main>
                </Providers>
            </div>
        </div>
    );
}