import Header from "@/components/header/header";
import { Providers } from "@/service/provider";
import { Suspense } from "react";

export default function Layout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <div className="h-full">
            <Header />
            <main className="h-full w-full overflow-auto p-4 md:p-8 ">
                <Providers>
                    <Suspense>
                        {children}
                    </Suspense>
                </Providers>
            </main>
        </div>
    );
}