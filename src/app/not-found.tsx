// File: src/app/not-found.tsx

"use client";
import { ZButton } from "@/components/button/button";
import { usePathname, useRouter } from "next/navigation";
import notFound from '../assets/img/not_found.png'
import Image from "next/image";
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
      <Image src={notFound} alt="" />
      <h1 style={{color: "#BABFC2"}}>Página não encontrada</h1>
      <ZButton onClick={handleRedirect} style={{ padding: "10px 20px", fontSize: "16px", marginTop: "20px" }}>
        Voltar para página inicial
      </ZButton>
    </div>
  );
}