"use client";
// import { CartItem } from "@/types/cart";
// import {
//   getCart,
//   removeFromCart,
//   saveCart,
// } from "@/utils/cartStorage";
import { ProductClientController } from "@/app/product/service/controller";
import { ShippingGetType, ValidOption } from "@/app/product/service/type";
import { ZButton } from "@/components/button/button";
import ZDivider from "@/components/divider/divider";
import LoginModal from "@/components/header/login/login_modal";
import ZInputMask from "@/components/input_mask/input_mask";
import ZRadioButton from "@/components/radio_button/radio_button";
import ZSkeleton from "@/components/skeleton/skeleton";
import { useCartStore } from "@/service/store/cart_store";
import { Form, Formik } from "formik";
import Cookies from 'js-cookie';
import { useContext, useEffect, useState } from "react";
import { CartContext } from "../../context/context";
import "./cart_list.css";
import Item from "./item/item";



export default function CartList({ handleActiveIndex }: { handleActiveIndex: (i: number) => void }) {
  const [modalLogin, setModalLogin] = useState(false)
  const token = Cookies.get('access_token');
   
  const [hydrated, setHydrated] = useState(false);
  useEffect(() => setHydrated(true), []);

  const [shipping, setShipping] = useState<ShippingGetType[] | undefined>();
  const [shippingSelect, setShippingSelect] = useState<ValidOption | undefined>()
  const [isLoadingCep, setLoading] = useState(false)
  const [cep, setCep] = useState<string | undefined>()
  const cart = useCartStore((state) => state.cart);
 const cartContext = useContext(CartContext)

  const productClientController = ProductClientController({ setShipping, setShippingSelect });

  const handleShippingCalculate = (
    cep?: string,
  ) => {
    if (cep) {
      setLoading(true)
      productClientController.ShippingCalculateAction({
        destinationZipCode: cep.replace(/[^a-zA-Z0-9 ]/g, ""),
        orderItems: cartContext?.productSelected() ?? []
      }, setLoading);
      setCep(cep)
    }
  };

  useEffect(() => {
    if (cep) handleShippingCalculate(cep)
  }, [cart, cartContext?.initialValue.product_selected])

  useEffect(() => {
    cartContext?.setInitialValue(prev => ({ ...prev, product_selected: cart.map(item => { return item.id }) }))
  }, [])

  const total = cart.reduce(
    (sum, item) => sum + (cartContext?.initialValue.product_selected?.find(props => props === item.id) ? item.price * item.quantity : 0),
    0
  );

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
                  
                  
                  return (
                    <Item item={item} key={index}/>
                  )
                })}
              </div>
            </>
          )}
        </div>
        <div className="col-12 md:col-4">
          <div className="card_total">
            <div className="flex flex-row justify-content-between mb-1"><h4>Subtotal:</h4> <h3>R${total.toFixed(2)}</h3></div>
            <div className="flex flex-row justify-content-between"><h4>Frete:</h4> {isLoadingCep ? <div className="flex flex-column justify-content-center"><ZSkeleton width="64px" /></div> : <h3>R${shippingSelect?.cost?.toFixed(2)}</h3>}</div>
            <ZDivider />
            <div className="flex flex-row justify-content-end">
              <h1>R${(total + (shippingSelect?.cost ?? 0)).toFixed(2)}</h1>
            </div>
            <div className="p-2" />
            {shipping && <div className="bg-black-alpha-10 p-3" style={{ borderRadius: "8px" }}>
              <h3>Frete</h3>
              <div className="p-1" />
              <div className="gap-3">
                {isLoadingCep ? <div className="flex flex-column gap-2"><ZSkeleton /><ZSkeleton /><ZSkeleton /></div> : <>
                  {shipping.map((shippingItem, index) => {
                    return (<div key={index}>
                      <h3>{shippingItem.productName} - {shippingItem.workshopName}</h3>
                      <h5>Quantidade - {shippingItem.quantity}</h5>
                      {shippingItem?.result?.validOptions?.map((item, index) => {
                        return (
                          <div key={index} className="my-2">
                            {<div className="flex flex-row justify-content-between m-1">
                              <div className="flex flex-row align-items-center">
                                <label>{item.carrier}</label>
                              </div>
                              <div>
                                <h5>R${item.cost.toFixed(2)}</h5>
                                <p>{item.deliveryTime} Dias úteis</p>
                              </div>
                            </div>}
                          </div>
                        )
                      })}
                    </div>)
                  })}

                </>}
              </div></div>}
            <div className="p-2" />
            <Formik
              initialValues={{ cep: "", quantity: 1 }}
              onSubmit={(values) => {
                handleShippingCalculate(
                  values.cep
                );
              }}
            >
              {({ values, handleChange }) => {
                return (
                  <Form>
                    <div className="flex flex-column">
                      <label>Calcular frete</label>
                      <div className="p-1" />
                      <div className="flex flex-row gap-2">
                        <ZInputMask
                          mask="99999-999"
                          value={values.cep}
                          name="cep"
                          onChange={handleChange}
                          placeholder="Digite o seu CEP"
                          className="w-full"
                        />
                        <ZButton label="Ok" />
                      </div>
                    </div>
                  </Form>
                );
              }}
            </Formik>
            <div className="p-3" />
            <ZButton label="Continuar" style={{ width: "100%" }} onClick={() => { token ? handleActiveIndex(1) : setModalLogin(!modalLogin) }} />
          </div>
        </div>
      </div>
      <LoginModal visible={modalLogin} onHide={() => setModalLogin(!modalLogin)} />

    </div>
  );
}
