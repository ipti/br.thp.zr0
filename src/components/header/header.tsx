"use client";
import { useCartStore } from "@/service/store/cart_store";
import Cookies from 'js-cookie';
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Popover } from "react-tiny-popover";
import logo from "../../assets/img/ZR0_logotipo.png";
import ZBadge from "../badge/badge";
import { ZButton } from "../button/button";
import ZInputText from "../input/input";
import CartDialog from "./cart_dialog/cart_dialog";
import "./header.css";
import MenuUser from "./menu_user/menu_user";
import LoginModal from "./login/login_modal";


export default function Header() {
  const useNavigate = useRouter();
  const [visibleCart, setVisibleCart] = useState(false)
  const [menuUser, setMenuUser] = useState(false)
  const token = Cookies.get('access_token');


  const cart = useCartStore((state) => state.cart);
  return (
    <div className="container">
      <div className="flex flex-column justify-content-center cursor-pointer" onClick={() => { useNavigate.push('/') }}>
        <Image alt="" src={logo} height={64} />
      </div>
      <div className="flex flex-column justify-content-center w-full md:w-29rem">
        <div className="p-inputgroup flex-1 align-items-center">
          <ZInputText placeholder="Pesquisar" />
          <ZButton icon="pi pi-search" className="p-button-warning" />
        </div>
      </div>
      <div className="gap-3 flex flex-row align-items-center">
        <Popover
          isOpen={menuUser}
          positions={['bottom']} // preferred positions by priority
          content={<MenuUser />}
        >
          <div onClick={() => setMenuUser(!menuUser)}>
            <i className="pi pi-user" style={{ fontSize: '1.5rem' }} />
          </div>
        </Popover>
        <i className="cursor-pointer pi pi-shopping-cart p-overlay-badge" style={{ fontSize: '1.5rem' }} onClick={() => setVisibleCart(!visibleCart)}>
          <ZBadge value={cart.length}></ZBadge>
        </i>
      </div>
      <CartDialog visible={visibleCart} onHide={() => { setVisibleCart(!visibleCart) }} />
      <LoginModal />
    </div>
  );
}
