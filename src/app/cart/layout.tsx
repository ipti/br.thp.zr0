import Header from "@/components/header/header";
import { Suspense } from "react";

export default function CartLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="h-full">
      <div className="flex flex-column h-full w-full" >

      <Header />
      
      <main className="h-full w-full overflow-auto p-4 md:p-8 ">
        <Suspense>
          {children}
        </Suspense></main>
      </div>
    </div>
  );
}