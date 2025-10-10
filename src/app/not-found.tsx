// File: src/app/not-found.tsx

"use client";
import { usePathname, useRouter } from "next/navigation";
// ...existing code...

export default function NotFoundRedirect() {
  const pathname = usePathname();
  const router = useRouter();

  const handleRedirect = () => {
    if (pathname.includes("/seller")) {
      router.replace("/seller/home");
    } else {
      router.replace("/");
    }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "100vh" }}>
      <h1>Página não encontrada</h1>
      <button onClick={handleRedirect} style={{ padding: "10px 20px", fontSize: "16px", marginTop: "20px" }}>
        Voltar para página inicial
      </button>
    </div>
  );
}