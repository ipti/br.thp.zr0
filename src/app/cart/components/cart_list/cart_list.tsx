"use client";
import { ProductClientController } from "@/app/product/service/controller";
import { ShippingGetType, ValidOption } from "@/app/product/service/type";
import { ZButton } from "@/components/button/button";
import LoginModal from "@/components/header/login/login_modal";
import ZInputMask from "@/components/input_mask/input_mask";
import ZSkeleton from "@/components/skeleton/skeleton";
import { useCartStore } from "@/service/store/cart_store";
import { Form, Formik } from "formik";
import Cookies from 'js-cookie';
import { useContext, useEffect, useState } from "react";
import { CartContext } from "../../context/context";
import "./cart_list.css";
import Item from "./item/item";
import Shipping from "@/components/shipping/shipping";



export default function CartList({ handleActiveIndex }: { handleActiveIndex: (i: number) => void }) {
  const [modalLogin, setModalLogin] = useState(false)
  const [hydrated, setHydrated] = useState(false);
  const [token, setToken] = useState<string | undefined>(undefined);

  useEffect(() => {
    setHydrated(true);
    setToken(Cookies.get("access_token"));
  }, []);



  const cart = useCartStore((state) => state.cart);
  const cartContext = useContext(CartContext)

  useEffect(() => {
    cartContext?.setInitialValue(prev => ({ ...prev, product_selected: cart.map(item => { return item.id }) }))
  }, [])

  const total = cart.reduce(
    (sum, item) => sum + (cartContext?.initialValue.product_selected?.find(props => props === item.id) ? item.price * item.quantity : 0),
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
            <div className="flex flex-row justify-content-between mb-1"><h4>Total:</h4> <h3>R${total.toFixed(2)}</h3></div>
            {/* <div className="flex flex-row justify-content-between"><h4>Frete:</h4> {isLoadingCep ? <div className="flex flex-column justify-content-center"><ZSkeleton width="64px" /></div> : <h3>R${shippingSelect?.cost?.toFixed(2)}</h3>}</div> */}
            {/* <ZDivider />
            <div className="flex flex-row justify-content-end">
              <h1>R${(total + (shippingSelect?.cost ?? 0)).toFixed(2)}</h1>
            </div>
            <div className="p-2" /> */}
           <Shipping orderItems={cartContext?.productSelected() ?? []} cart={cart} />
            <div className="p-3" />
            <ZButton label="Continuar" style={{ width: "100%" }} onClick={() => { token ? handleActiveIndex(1) : setModalLogin(!modalLogin) }} />
          </div>
        </div>
      </div>
      <LoginModal visible={modalLogin} onHide={() => setModalLogin(!modalLogin)} />

    </div>
  );
}
