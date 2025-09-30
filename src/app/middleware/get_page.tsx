import { headers } from "next/headers";

export async function getServerPath() {
  const h = await headers();
  const url = h.get("x-url") || h.get("referer");

  if (!url) return "/";

  try {
    return new URL(url).pathname;
  } catch {
    return "/";
  }
}
