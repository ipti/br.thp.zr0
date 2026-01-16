"use client";
import { Address } from "@/app/profile/address/service/type";
import { ZButton } from "@/components/button/button";
import ZDivider from "@/components/divider/divider";
import ZSkeleton from "@/components/skeleton/skeleton";
import { useFetchUserToken } from "@/service/global_request/query";
import { UserGlobal } from "@/service/global_request/type";
import { useCartStore } from "@/service/store/cart_store";
import { useContext, useState } from "react";
import Swal from "sweetalert2";
import { CartController } from "../../service/controller";
import { useFetchAddressOneRequest } from "../../service/query";
import CardAddress from "../card_address/card_address";
import CardPerson from "../card_person/card_person";
import ToggleButtonComponent from "@/components/toggle_button/toggle_button";
import { useCartStepsStore } from "../../zustand/zustand";

export default function Finish({
  handleActiveIndex,
}: {
  handleActiveIndex: (i: number) => void;
}) {

  const [isLoadingFinish, setIsLoadingFinish] = useState(false);

  const [checked, setChecked] = useState(false);

  const controllerCart = CartController();

  const cart = useCartStore((state) => state.cart);

      const cartSteps = useCartStepsStore(state => state)
  


  const { data, isLoading } = useFetchAddressOneRequest(
    cartSteps?.cartSteps.address_selected ?? 0
  );

  const { data: userRequest, isLoadingUser } = useFetchUserToken();

  const user: UserGlobal | undefined = userRequest;

  const total = cart.reduce(
    (sum, item) =>
      sum +
      (cartSteps?.cartSteps.product_selected?.find(
        (props) => props === item.id
      )
        ? item.price * item.quantity
        : 0),
    0
  );

  var address: Address | undefined = data;

  const handleReturn = (value: any) => {
    setIsLoadingFinish(false);
  }

  const handleCreateOrder = () => {
    setIsLoadingFinish(true);
  
    controllerCart.CreateOrder({
      address: {
        address: address?.address ?? "",
        cep: address?.cep ?? "",
        number: address?.number ?? "",
        complement: address?.complement ?? "",
        neighborhood: address?.neighborhood ?? "",
        cityId: address?.city.id ?? 0,
        stateId: address?.state.id ?? 0,
        name: address?.name ?? "",
        phone: address?.phone ?? "",
      },
      userId: user?.id ?? 0,
      items: cartSteps?.cartSteps.deliverySelected?.map((item) => {
        const product = cart.find((cartItem) =>
          cartSteps?.cartSteps.product_selected?.find(
            (prop) => prop === cartItem.id
          )
        );
        if (product) {
          return {
            productId: item.productId,
            quantity: item.quantity,
            delivery_estimate: item?.validOptions,
            workshopId: item?.workshopId ?? 0,
          };
        }
      }) || [],
      observation: "",
    }, handleReturn);
  };

  return (
    <div>
      <h1>Revise e confirme</h1>
      <div className="p-2" />
      <p>Confirme os detalhes do seu pedido antes de finalizar.</p>
      <div className="p-2" />
      <div className="grid">
        <div className="col-12 md:col-8">
          {!isLoading && <CardPerson item={user!} cep={address?.cep} isEdit />}
          <div className="p-2" />
          <h4>Endereço selecionado</h4>
          <div className="p-2" />
          {!isLoading && <CardAddress item={address!} isView isEdit />}
          <div className="p-2" />
          <h4>Produtos selecionados</h4>
          <div className="p-2" />
          {cart.map((item) => {
            const isSelect = !!cartSteps?.cartSteps.product_selected?.find(
              (prop) => prop === item.id
            );
            return (
              <div key={item.id} className="card_list_item">
                <div className="flex flex-row align-items-center w-full gap-4 flex-wrap md:flex-nowrap">
                  <div style={{ position: "relative" }}>
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
                        <div className="p-1" />
                        <div className="flex flex-row">
                          <p className="text-sm m-0 text-600">
                            R${item.price.toFixed(2)} x {item.quantity}
                          </p>
                          <p className="text-sm text-pink-600 font-bold ml-1">
                            {" "}
                            R${(item.price * item.quantity).toFixed(2)}
                          </p>
                        </div>
                      </div>
                    </div>
                    <div>
                      <div className="p-1" />
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        <div className="col-12 md:col-4">
          <div className="card_total">
            <div className="flex flex-row justify-content-between mb-1">
              <h4>Subtotal:</h4> <h3>R${total.toFixed(2)}</h3>
            </div>
            <div className="flex flex-row justify-content-between">
              <h4>Frete:</h4>{" "}
              {!(
                (cartSteps?.cartSteps.deliverySelected?.length ?? 0) > 0
              ) ? (
                <div className="flex flex-column justify-content-center">
                  <ZSkeleton width="64px" />
                </div>
              ) : (
                <h3>
                  R$
                  {cartSteps?.cartSteps.deliverySelected
                    ?.reduce((sum, item) => sum + item.validOptions.cost, 0)
                    .toFixed(2)}
                </h3>
              )}
            </div>

            <ZDivider />
            <div className="flex flex-row justify-content-end">
              <h1>
                R$
                {
                  (total +
                    (cartSteps?.cartSteps.deliverySelected?.reduce(
                      (sum, item) => sum + item.validOptions.cost,
                      0
                    ) ?? 0)).toFixed(2) +
                    ""
                  // (shippingSelect?.cost ?? 0)).toFixed(2)
                }
              </h1>
            </div>
            <div className="p-2" />
            <div className="flex flex-row align-items-center gap-2">
              <i
                className="pi pi-truck"
                style={{ fontSize: "1rem", color: "var(--primary-color)" }}
              />
              <h3>Envio</h3>
            </div>
            <div className="p-1" />
            {cartSteps?.cartSteps.deliverySelected?.map((item, index) => {
              return (
                <div key={index} className="mb-1">
                  <h5>
                    {item.productName} - {item.workshopName}
                  </h5>
                  <p>
                    {item.validOptions.carrier} {item.validOptions.service} -{" "}
                    {item.validOptions.deliveryTime} Dias úteis
                  </p>
                </div>
              ); 
            })}
            <div className="p-3" />
            <ZButton
              label="Conitnuar e finalizar pedido"
              style={{ width: "100%" }}
              loading={isLoadingFinish}
              onClick={() => {
                if(!user?.customer?.phone && !checked){
                  Swal.fire({
                    icon: 'warning',
                    title: 'Atenção',
                    text: 'Seus dados pessoais estão incompletas. Por favor, atualize suas informações de faturamento antes de finalizar o pedido.',
                })
              } else {
                handleCreateOrder();
              }}}
            />
          </div>
        </div>
      </div>
      <div className="p-2" />
      <ZButton onClick={() => handleActiveIndex(2)}>Voltar</ZButton>
    </div>
  );
}
