"use client";
import { Providers } from "@/service/provider";
import { useCartStore } from "@/service/store/cart_store";
import Cookies from 'js-cookie';
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import zioLogo from '../../assets/img/ZR0_logotipo.png';
import "./header.css";
import Image from "next/image";
import { Popover } from "react-tiny-popover";
import MenuUser from "./menu_user/menu_user";



export default function Header() {
  const useNavigate = useRouter();
  const [modalLogin, setModalLogin] = useState(false)
  const [menuUser, setMenuUser] = useState(false)
  const token = Cookies.get('access_token');

  const [hydrated, setHydrated] = useState(false);
  useEffect(() => setHydrated(true), []);


  const cart = useCartStore((state) => state.cart);

  const total = cart.length
  return (
    <Providers>

      <header className="header">
  <div className="header-container">
    {/* Left - Navigation */}
    <div className="header-left">
      {true && (
        <button 
          // onClick={onNavigateToProducts}
          onClick={() => useNavigate.push('/product')}
          className="nav-button"
        >
          <p>
          Produtos
          </p>
        </button>
      )}
    </div>

    {/* Center - Logo */}
    <div className="header-logo">
      {true ? (
        <button className="logo-button" onClick={() => useNavigate.push('/')}>
          <Image height={32} src={zioLogo} alt="ZIo" />
        </button>
      ) : (
        <img src={zioLogo} alt="ZIo" />
      )}
    </div>
    <div className="header-right">
        <Popover
            isOpen={menuUser}
            transform={{ top: 30, }}
            transformMode='relative'
            onClickOutside={() =>  setMenuUser(!menuUser)}
            positions={['bottom']}
            containerStyle={{ zIndex: 1000 }}
            content={<MenuUser />}
          >
            <div className="cart-button" onClick={() => token ? setMenuUser(!menuUser) : setModalLogin(!modalLogin)}>
              <i className="cart-icon pi pi-user cursor-pointer"/>
            </div>
          </Popover>
      <button 
        className="cart-button"
        onClick={() => useNavigate.push('/cart')}
      >
        <div  className="cart-icon pi pi-shopping-cart" />
        <span className="cart-text">Carrinho ({total})</span>
        <span className="cart-text-mobile">({total})</span>
        {total > 0 && (
          <span className="cart-badge">{total}</span>
        )}
      </button>
    </div>
  </div>
</header>

    </Providers>
  );
}
