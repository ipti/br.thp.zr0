import { ShippingGetType } from "@/app/product/service/type";
import { ZButton } from "@/components/button/button";
import { useEffect, useState } from "react";
import { useFetchAddressOneRequest } from "../../service/query";
import { ProductClientController } from "@/app/product/service/controller";
import { Address } from "@/app/profile/address/service/type";
import ZSkeleton from "@/components/skeleton/skeleton";
import { CardDelivery } from "./card_delivery";
import { DeliverySelectedType, useCartStepsStore } from "../../zustand/zustand";
import { CartController } from "../../service/controller";
import { useFetchUserToken } from "@/service/global_request/query";
import { UserGlobal } from "@/service/global_request/type";
import Swal from "sweetalert2";
import Link from "next/link";
import { isAxiosError } from 'axios';

export default function Delivery({
  handleActiveIndex,
}: {
  handleActiveIndex: (i: number) => void;
}) {
  const [shipping, setShipping] = useState<ShippingGetType[] | undefined>();
  const [shippingSelect, setShippingSelect] = useState<
    DeliverySelectedType[]
  >([]);
  const [loadingCep, setLoading] = useState(false);
  const [isReserving, setIsReserving] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const productClientController = ProductClientController({
    setShipping,
    setShippingSelect,
  });
  const cartController = CartController();

  const cartSteps = useCartStepsStore(state => state)
  const { data: userRequest } = useFetchUserToken();

  const { data } = useFetchAddressOneRequest(
    cartSteps?.cartSteps.address_selected ?? 0
  );
  const user: UserGlobal | undefined = userRequest;

  const handleShippingCalculate = (cep?: string) => {
    if (cep) {
      setLoading(true)
      productClientController.ShippingCalculateAction(
        {
          destinationZipCode: cep.replace(/[^a-zA-Z0-9 ]/g, ""),
          orderItems: cartSteps.productSelected() ?? [],
        },
        setLoading
      );
    }
  };

  const address: Address | undefined = data;
  useEffect(() => {
    if (address) handleShippingCalculate(address.cep);
    // Recalcular apenas quando o endereço muda; a função usa o estado atual da store.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [address]);

  useEffect(() => {
    setShippingSelect(cartSteps.cartSteps.deliverySelected ?? []);
  }, [cartSteps.cartSteps.deliverySelected]);

  const handleSelectOptions = (data: DeliverySelectedType) => {

    if (shippingSelect?.find((item) => item.productId === data.productId && item.workshopId === data.workshopId)) {
      const t = shippingSelect?.filter((item) => !(item.productId === data.productId && item.workshopId === data.workshopId))
      return ([...t, { productId: data.productId, workshopId: data.workshopId, validOptions: data.validOptions, productName: data.productName, workshopName: data.workshopName, quantity: data.quantity }])
    } else {
      return [...shippingSelect, { productId: data.productId, workshopId: data.workshopId, validOptions: data.validOptions, productName: data.productName, workshopName: data.workshopName, quantity: data.quantity }]
    }
  }

  const handleReserveStock = async () => {
    setErrorMessage(null);
    if (!user?.id) {
      Swal.fire({
        title: "Sessao expirada",
        text: "Faça login novamente para continuar o checkout.",
        icon: "warning",
      });
      return;
    }

    setIsReserving(true);
    try {
      await cartController.ReserveStock({
        userId: user.id,
        items: shippingSelect.map((item) => ({
          productId: item.productId,
          workshopId: item.workshopId,
          quantity: item.quantity,
        })),
      });

      cartSteps.updateCartSteps({
        ...cartSteps.cartSteps,
        deliverySelected: shippingSelect,
      });
      handleActiveIndex(3);
    } catch (error: unknown) {
      const message = isAxiosError<{ message?: string }>(error)
        ? error.response?.data?.message
        : undefined
      setErrorMessage(message ?? "Não foi possível reservar o estoque. Atualize a entrega e tente novamente.");
    } finally {
      setIsReserving(false);
    }
  }


  return (
    <div className="checkout-stage">
      {(
        <div>
          <div className="checkout-stage-heading">
            <div>
              <h2>Escolha a entrega</h2>
              <p>Selecione uma opção para cada remessa do pedido.</p>
            </div>
          </div>
          <>
            <div className="delivery-address">
              <i className="pi pi-map-marker" aria-hidden="true" />
              <span>{address?.address} · {address?.city.name}/{address?.state.acronym} · CEP {address?.cep}</span>
            </div>
          </>
          {errorMessage && (
            <div className="checkout-inline-error" role="alert">
              <span>{errorMessage}</span>
              {shippingSelect[0]?.productId && (
                <Link href={`/production-order?productId=${encodeURIComponent(shippingSelect[0].productId)}`}>
                  Encomendar separadamente
                </Link>
              )}
            </div>
          )}
          <div className="delivery-options" role="radiogroup" aria-label="Opções de entrega">
            {loadingCep ? (
              <div className="flex flex-column gap-2">
                <ZSkeleton height="32px" />
                <ZSkeleton height="32px" />
                <ZSkeleton height="32px" />
              </div>
            ) : (
              <>
                {shipping?.map((shippingItem, key) => {
                  return (<div key={key}>
                    <CardDelivery handleSelectOptions={handleSelectOptions} setShippingSelect={setShippingSelect} shippingItem={shippingItem} shippingSelect={shippingSelect} />
                  </div>)
                })}
              </>

            )}
          </div>
        </div>
      )}
      <div className="checkout-actions">
        <ZButton
          label="Voltar"
          security="secondary"
          onClick={() => {
            handleActiveIndex(1);
          }}
        />
        <ZButton
          label="Continuar para revisão"
          disabled={shippingSelect.length !== shipping?.length}
          loading={isReserving}
          onClick={() => {
            void handleReserveStock();
          }}
        />
      </div>
    </div>
  );
}
