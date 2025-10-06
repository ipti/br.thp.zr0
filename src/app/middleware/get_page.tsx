import { headers } from "next/headers";

export async function getServerPath() {
  const h = await headers();
  return h.get("x-path") ?? "/";
}
