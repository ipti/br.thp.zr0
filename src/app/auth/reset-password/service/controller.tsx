"use client";

import { Dispatch, SetStateAction } from "react";
import { ResetPasswordRequest } from "./request";
import { ResetPasswordTypes } from "./types";
import { useNavigation } from "@/utils/navigation";

export function ResetPasswordController(setErros: Dispatch<SetStateAction<string>>) {
  const history = useNavigation();

  function ResetPasswordAction(body: ResetPasswordTypes, token?: string) {
    ResetPasswordRequest(body, token)
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      .then((data) => {
        history.history.push("/auth/login");
      })
      .catch((erros) => {
        console.log(erros.response.data.message);
        setErros(erros.response.data.message);
      });
  }
  return {
    ResetPasswordAction,
  };
}
