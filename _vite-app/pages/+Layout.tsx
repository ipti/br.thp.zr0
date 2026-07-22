import "primeflex/primeflex.css";
import "primeicons/primeicons.css";
// TODO(fase-3f): component.css importa CSS de vários componentes
// (button, input, card...) que ainda não foram portados — reativar junto
// com eles.
// import "@/components/component.css";
import "./globals.css";

import { useEffect, type ReactNode } from "react";
import { QueryClientProvider } from "@tanstack/react-query";
import queryClient from "@/service/react-query";
import { ToastProvider } from "@/components/toast/context";

function ChatwootScript() {
  useEffect(() => {
    if (document.getElementById("chatwoot-script")) return;

    const script = document.createElement("script");
    script.id = "chatwoot-script";
    script.async = true;
    script.src = "https://app.chatwoot.com/packs/js/sdk.js";
    script.onload = () => {
      // @ts-expect-error - SDK global injetado pelo script do Chatwoot
      window.chatwootSDK?.run({
        websiteToken: "pKTvcMuXcCbKi3BxYXmAwb3g",
        baseUrl: "https://app.chatwoot.com",
      });
    };
    document.body.appendChild(script);
  }, []);

  return null;
}

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <div className="h-full home-container">
      <QueryClientProvider client={queryClient}>
        <ToastProvider>{children}</ToastProvider>
      </QueryClientProvider>
      <ChatwootScript />
    </div>
  );
}
