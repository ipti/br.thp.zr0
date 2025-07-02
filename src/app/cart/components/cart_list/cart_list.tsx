"use client";
import { useEffect, useState } from "react";
// import { CartItem } from "@/types/cart";
// import {
//   getCart,
//   removeFromCart,
//   saveCart,
// } from "@/utils/cartStorage";
import { Button } from "primereact/button";
import { Divider } from "primereact/divider";
import { useCartStore } from "@/service/store/cart_store";
import { Form, Formik } from "formik";
import ZDropdown from "@/components/dropdown/dropdown";
import ZInputMask from "@/components/input_mask/input_mask";
import { ZButton } from "@/components/button/button";
import { ProductClientController } from "@/app/product/service/controller";
import "./cart_list.css"
import ZDivider from "@/components/divider/divider";


export default function CartList({handleActiveIndex}: {handleActiveIndex: (i: number) => void}) {
  const cart = useCartStore((state) => state.cart);
  const removeItem = useCartStore((state) => state.removeItem);
  const updateItem = useCartStore((state) => state.updateQuantity)

  const productClientController = ProductClientController();

  const handleShippingCalculate = (
    cep: string
  ) => {
    productClientController.ShippingCalculateAction({
      destinationZipCode: cep.replace(/[^a-zA-Z0-9 ]/g, ""),
      orderItems: cart.map((item) => { return { productId: parseInt(item.id), quantity: item.quantity } }),
    });
  };

  const total = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Seu Carrinho</h2>
      <div className="grid">
        <div className="col-12 md:col-8">
          {cart.length === 0 ? (
            <p>Seu carrinho está vazio.</p>
          ) : (
            <>
              <div className="flex flex-column gap-4">
                {cart.map((item) => (
                  <div
                    key={item.id}
                    className="card_list_item"
                  >
                    <div className="flex flex-row align-items-center gap-4 flex-wrap md:flex-nowrap">
                      <div style={{  position: "relative",  }}>
                        <img
                          src={item.image}
                          alt={item.name}
                          width={100}
                          height={100}
                          className="border-round object-contain"
                        />
                      </div>
                      <div className="flex-1 min-w-min">
                        <div className="flex justify-content-between align-items-start flex-wrap">
                          <div>
                            <h3 className="m-0">{item.name}</h3>
                            <div className="p-1"/>
                            <div className="flex flex-row">

                            <p className="text-sm m-0 text-600">
                              R${item.price.toFixed(2)} x {item.quantity}
                            </p>
                            <p className="text-sm text-pink-600 font-bold ml-1">
                             {" "} R${(item.price * item.quantity).toFixed(2)}
                            </p>
                            </div>
                          </div>
                          <Button
                            icon="pi pi-times"
                            className="p-button-text p-button-sm p-button-danger"
                            onClick={() => removeItem(item.id)}
                          />
                        </div>
                        <div>
                          <div className="p-1" />
                          <ZDropdown
                            value={item.quantity}
                            name="quantity"
                            onChange={(e) => updateItem(item.id, e.target.value)}
                            options={[1, 2, 3, 4, 5, 6, 7, 8,9]}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
        <div className="col-12 md:col-4">
          <div className="card_total">
            <div className="flex flex-row justify-content-between mb-1"><h4>Subtotal:</h4> <h3>R${total.toFixed(2)}</h3></div>
            <div className="flex flex-row justify-content-between"><h4>Frete:</h4> <h3>R${total.toFixed(2)}</h3></div>
            <ZDivider />
            <div className="flex flex-row justify-content-end">
            <h1>R${total}</h1>
            </div>
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
                        />
                        <ZButton label="Ok" />
                      </div>
                    </div>
                  </Form>
                );
              }}
            </Formik>
            <div className="p-3" />
            <ZButton label="Continuar" style={{width: "100%"}} onClick={() => { handleActiveIndex(1) }} />
          </div>
        </div>
      </div>

    </div>
  );
}
