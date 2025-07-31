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
import { Providers } from "@/service/provider";
import bag from "../../assets/img/bag.svg";


export default function Header() {
  const useNavigate = useRouter();
  const [visibleCart, setVisibleCart] = useState(false)
  const [modalLogin, setModalLogin] = useState(false)
  const [menuUser, setMenuUser] = useState(false)
  const token = Cookies.get('access_token');


  const cart = useCartStore((state) => state.cart);
  return (
    <Providers>

      <div className="container">
        <div className="flex flex-column justify-content-center cursor-pointer" onClick={() => { useNavigate.push('/') }}>
          <Image alt="" src={logo} height={64} />
        </div>
        <div className="flex flex-column justify-content-center w-full md:w-29rem">
          <div className="flex flex-row align-items-center gap-3">

            <h3>
              SOBRE
            </h3>
             <h3>
              IMPACTO
            </h3>
             <h3>
              PRODUTOS
            </h3>
             <h3>
              CONTATO
            </h3>
            </div>
          {/* <div className="p-inputgroup flex-1 align-items-center">
            <ZInputText placeholder="Pesquisar" />
            <ZButton icon="pi pi-search" className="p-button-warning" />
          </div> */}
        </div>
        <div className="gap-3 flex flex-row align-items-center">
          <Popover
            isOpen={menuUser}
            transform={{ top: 32, }}
            transformMode='relative'
            onClickOutside={() =>  setMenuUser(!menuUser)}
            positions={['bottom']} // preferred positions by priority
            content={<MenuUser />}
          >
            <div onClick={() => token ? setMenuUser(!menuUser) : setModalLogin(!modalLogin)}>
              <i className="pi pi-user cursor-pointer" style={{ fontSize: '1.5rem' }} />
            </div>
          </Popover>
          <div className="cursor-pointer p-overlay-badge" style={{ fontSize: '1.5rem' }} onClick={() => setVisibleCart(!visibleCart)}>
            <Image alt="Bag Icon" src={bag} width={48} height={48} />
            <ZBadge value={cart.length}></ZBadge>
          </div>
        </div>
        <CartDialog visible={visibleCart} onHide={() => { setVisibleCart(!visibleCart) }} />
        <LoginModal visible={modalLogin} onHide={() => setModalLogin(!modalLogin)} />
      </div>
    </Providers>
  );
}
