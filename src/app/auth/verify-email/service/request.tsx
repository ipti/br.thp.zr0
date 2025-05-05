import http from "@/service/axios";

export const VerifyEmailRequest = async (token?: string) => {
  return await http.put(
    "/aux-user/verify-email",
    {},
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
};
