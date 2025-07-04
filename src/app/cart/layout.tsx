import Header from "@/components/header/header";
import { Suspense } from "react";

export default function CartLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="h-full">
      <Header />
      <main className="h-full">
        <Suspense>
          {children}
        </Suspense></main>
    </div>
  );
}