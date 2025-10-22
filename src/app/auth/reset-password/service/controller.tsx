"use client";

import { Dispatch, SetStateAction } from "react";
import { ResetPasswordRequest } from "./request";
import { ResetPasswordTypes } from "./types";
import { useNavigation } from "@/utils/navigation";
import Swal from "sweetalert2";

export function ResetPasswordController(setErros: Dispatch<SetStateAction<string>>) {
  const history = useNavigation();

  function ResetPasswordAction(body: ResetPasswordTypes, token?: string, setLoading?: Dispatch<SetStateAction<boolean>>) {
    ResetPasswordRequest(body, token)
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      .then((data) => {
        setLoading!(false)
        history.history.push("/auth/login");
      })
      .catch((erros) => {
        console.log(erros.response);
        setLoading!(false)
        if(erros?.response?.status === 401){
          setErros('Tempo expirado!');
        }else {
          setErros(erros.response.data.message ?? '');
        }
        
      });
  }
  return {
    ResetPasswordAction,
  };
}
