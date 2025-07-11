"use client";
import { useCartStore } from "@/service/store/cart_store";
import { useRouter } from "next/navigation";
import { IconField } from "primereact/iconfield";
import { InputIcon } from "primereact/inputicon";
import { InputText } from "primereact/inputtext";
import { useState } from "react";
import ZBadge from "../badge/badge";
import CartDialog from "./cart_dialog/cart_dialog";
import "./header.css";
import logo from"../../assets/img/ZR0_logotipo.png"
import Image from "next/image";

export default function Header() {
  const useNavigate = useRouter();
  const [visibleCart, setVisibleCart] = useState(false)
  
   const cart = useCartStore((state) => state.cart);
  return (
    <div className="container">
      <div className="flex flex-column justify-content-center" onClick={() => {useNavigate.push('/')}}>
        <Image alt="" src={logo} height={64} />
      </div>
      <div className="flex flex-column justify-content-center">
        <IconField iconPosition="left">
          <InputIcon className="pi pi-search"> </InputIcon>
          <InputText placeholder="Search" />
        </IconField>
      </div>
      <div className="gap-3 flex flex-row align-items-center">
        <i className="pi pi-user" style={{ fontSize: '1.5rem' }}  />
        <i className="cursor-pointer pi pi-shopping-cart p-overlay-badge" style={{ fontSize: '1.5rem' }}  onClick={() => setVisibleCart(!visibleCart)}>
           <ZBadge value={cart.length}></ZBadge>
        </i>
      </div>
      <CartDialog visible={visibleCart} onHide={() => {setVisibleCart(!visibleCart)}} />
    </div>
  );
}
