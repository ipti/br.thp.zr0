"use client";
import { ZButton } from "@/components/button/button";
import LoginModal from "@/components/header/login/login_modal";
import Shipping from "@/components/shipping/shipping";
import ZSkeleton from "@/components/skeleton/skeleton";
import { useCartStore } from "@/service/store/cart_store";
import Cookies from 'js-cookie';
import { useEffect, useState } from "react";
import { useCartStepsStore } from "../../zustand/zustand";
import "./cart_list.css";
import Item from "./item/item";



export default function CartList({ handleActiveIndex }: { handleActiveIndex: (i: number) => void }) {
  const [modalLogin, setModalLogin] = useState(false)
  const [hydrated, setHydrated] = useState(false);
  const [token, setToken] = useState<string | undefined>(undefined);

  useEffect(() => {
    setHydrated(true);
    setToken(Cookies.get("access_token"));
  }, []);



  const cart = useCartStore((state) => state.cart);
  const cartSteps = useCartStepsStore(state => state)

  useEffect(() => {
    cartSteps.updateCartSteps({...cartSteps.cartSteps,product_selected: cart.map(item => { return item.id }) })
  }, [])

  const total = cart.reduce(
    (sum, item) => sum + (cartSteps.cartSteps.product_selected?.find(props => props === item.id) ? item.price * item.quantity : 0),
    0
  );


  if (!hydrated) {
    return <div className="p-4"><ZSkeleton width="100%" /></div>;
  }

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Seu Carrinho</h2>
      <div className="grid">
        <div className="col-12 md:col-8">
          {hydrated && cart?.length === 0 ? (
            <p>Seu carrinho está vazio.</p>
          ) : (
            <>
              <div className="flex flex-column gap-4">
                {hydrated && cart?.map((item, index) => {
                  return item ? (
                    <Item item={item} key={index} />
                  ) : (<div key={index}></div>);
                })}
              </div>
            </>
          )}
        </div>
        <div className="col-12 md:col-4">
          <div className="card_total">
            <h1 className="mb-3">Resumo do pedido</h1>
            <div className="flex flex-row justify-content-between mb-1"><h4>Valor total dos produtos:</h4> <h2>R${total.toFixed(2)}</h2></div>
            {/* <div className="flex flex-row justify-content-between"><h4>Frete:</h4> {isLoadingCep ? <div className="flex flex-column justify-content-center"><ZSkeleton width="64px" /></div> : <h3>R${shippingSelect?.cost?.toFixed(2)}</h3>}</div> */}
            {/* <ZDivider />
            <div className="flex flex-row justify-content-end">
              <h1>R${(total + (shippingSelect?.cost ?? 0)).toFixed(2)}</h1>
            </div>
            <div className="p-2" /> */}
          {(token && cart.length > 0) && <Shipping orderItems={cartSteps?.productSelected() ?? []} cart={cart} />}
           <div className="p-3" />
           <ZButton label="Continuar" style={{ width: "100%" }} onClick={() => { token ? handleActiveIndex(1) : setModalLogin(!modalLogin) }} />
          </div>
        </div>
      </div>
      <LoginModal visible={modalLogin} onHide={() => setModalLogin(!modalLogin)} />

    </div>
  );
}
