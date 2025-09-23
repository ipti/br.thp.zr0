import { apiUrl } from "@/service/url_api";

export async function getProducts() {
  const res = await fetch(`${apiUrl}/product`, {
      cache: "no-store", // força a rodar em runtime, não no build
  });
  return res.json();
}