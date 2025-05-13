"use client";

import { useRouter } from "next/navigation";

export default function HeaderSeller() {
  const navigate = useRouter();
  return (
    <div className="bg-black-alpha-60 w-full h-3rem">
      <div className="h-full flex flex-column justify-content-center">
        <div
          className="flex flex-row align-content-center"
          onClick={() => {
            navigate.back();
          }}
        >
          <i className="pi pi-angle-left" style={{ fontSize: "1.2rem" }}></i>
          {/* <div className="p-1" /> */}
          <p className="mb-1">Voltar</p>
        </div>
      </div>
    </div>
  );
}
