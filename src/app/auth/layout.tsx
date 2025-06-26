import { Suspense } from "react";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="h-full">
      <main className="h-full">
        <Suspense>
          {children}
        </Suspense></main>
    </div>
  );
}