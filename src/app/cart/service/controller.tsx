"use client";

import { LoginRequest } from "@/app/auth/login/service/request";
import { login } from "@/service/localstorage";
import Cookies from "js-cookie";
import { Dispatch, SetStateAction, useReducer } from "react";
import { CreateAddressCustomerRequest, VerifyEmailRequest } from "./request";
import {
  CreateAdressCustomer,
  LoginTypes,
  SignUpTypes,
  VerifyEmailReturn,
  VerifyEmailTypes,
} from "./types";
import { SignUpRequest } from "@/app/auth/sign-up/service/request";
import { useRouter } from "next/navigation";

export function CartController(setErros: Dispatch<SetStateAction<string>>) {
  const exp90 = new Date();
  exp90.setMinutes(exp90.getMinutes() + 90);

  const history = useRouter();

  function VerifyEmailAction(
    body: VerifyEmailTypes,
    handleStatusEmail: (value: VerifyEmailReturn) => void
  ) {
    VerifyEmailRequest(body)
      .then((data) => {
        setErros("");
        handleStatusEmail(data.data);
      })
      .catch((erros) => {
        console.log(erros.response.data.message);
        setErros(erros.response.data.message);
      });
  }

  function LoginCartAction(
    body: LoginTypes,
    handleActiveIndex: (i: number) => void
  ) {
    LoginRequest(body)
      .then((data) => {
        setErros("");
        Cookies.set("access_token", data.data.access_token, { expires: exp90 });
        login(data.data.access_token);
        handleActiveIndex(2);
        // if (data.data.userRegistered.role === PerfisEnum.CUSTOMER) {
        //     history.history.push("/")
        // } else {
        //     history.history.push("/seller/home")
        // }
        // window.location.reload()
        // history.history.push("/")
      })
      .catch((erros) => {
        console.log(erros.response.data.message);
        setErros(erros.response.data.message);
      });
  }

  function SignUpCartAction(
    body: SignUpTypes,
    handleStatusEmail: (value: VerifyEmailReturn | undefined) => void
  ) {
    SignUpRequest(body)
      .then((data) => {
        setErros("");
        handleStatusEmail(undefined);
        // if (data.data.userRegistered.role === PerfisEnum.CUSTOMER) {
        //     history.history.push("/")
        // } else {
        //     history.history.push("/seller/home")
        // }
        // window.location.reload()
        // history.history.push("/")
      })
      .catch((erros) => {
        handleStatusEmail(undefined);

        console.log(erros.response.data.message);
        setErros(erros.response.data.message);
      });
  }

  function CreateAddressCustomer(body: CreateAdressCustomer) {
    CreateAddressCustomerRequest(body)
      .then((data) => {
        setErros("");
        // if (data.data.userRegistered.role === PerfisEnum.CUSTOMER) {
        //     history.history.push("/")
        // } else {
        //     history.history.push("/seller/home")
        // }
        // window.location.reload()
        // history.history.push("/")
      })
      .catch((erros) => {

        console.log(erros.response.data.message);
        setErros(erros.response.data.message);
      });
  }
  return {
    VerifyEmailAction,
    LoginCartAction,
    SignUpCartAction,
    CreateAddressCustomer
  };
}
