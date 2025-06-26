"use client";
import { useRouter } from "next/navigation";
import "./header.css";
import { IconField } from "primereact/iconfield";
import { InputIcon } from "primereact/inputicon";
import { InputText } from "primereact/inputtext";
import ZSliderBarDialog from "../sidebar/sidebar";
import { useState } from "react";
import CartDialog from "./cart_dialog/cart_dialog";

export default function Header() {
  const useNavigate = useRouter();
  const [visibleCart, setVisibleCart] = useState(false)

  return (
    <div className="container">
      <div className="flex flex-column justify-content-center"><h3>Logo</h3></div>
      <div>
        <IconField iconPosition="left">
          <InputIcon className="pi pi-search"> </InputIcon>
          <InputText placeholder="Search" />
        </IconField>
      </div>
      <div className="gap-3 flex flex-row align-items-center">
        <i className="pi pi-user" />
        <i className="cursor-pointer pi pi-shopping-cart"  onClick={() => setVisibleCart(!visibleCart)} />
      </div>
      <CartDialog visible={visibleCart} onHide={() => {setVisibleCart(!visibleCart)}} />
    </div>
  );
}
