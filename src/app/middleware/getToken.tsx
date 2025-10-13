// Server Component
import { cookies } from "next/headers";

export const ProfileServer = () => {
  const cookieStore = cookies(); // Funciona no lado do servidor
  const userToken = cookieStore.get("userToken");

  return { userToken };
};