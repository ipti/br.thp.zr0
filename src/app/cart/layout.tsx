import Header from "@/components/header/header";
import { Providers } from "@/service/provider";
import { Suspense } from "react";

export default function CartLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="h-full">
      <div className="flex flex-column h-full w-full">
        <Header />
        <Providers>
          <main className="h-full w-full overflow-auto p-4 md:p-8 ">
            <Suspense>{children}</Suspense>
          </main>
        </Providers>
      </div>
    </div>
  );
}
