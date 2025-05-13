"use client";
import { primeFlex } from "@/utils/prime_flex";
import { useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { VerifyEmailController } from "../service/controller";

export default function VerifyEmailComponent() {
  const prime = primeFlex();
const searchParams = useSearchParams()
  const token = searchParams.get('token')

  const { VerifyEmailAction } = VerifyEmailController();

  useEffect(() => {
    VerifyEmailAction(token ?? "");
  }, []);

  return (
    <div
      className={prime.flex + prime.column + prime.justify_center + "h-full"}
    >
      Email Verificado...
    </div>
  );
}
