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

  var address: Address | undefined = data;
  useEffect(() => {
    if (address) handleShippingCalculate(address.cep);
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
    } catch (error: any) {
      Swal.fire({
        title: "Nao foi possivel reservar o estoque",
        text:
          error?.response?.data?.message ??
          "Atualize o frete e tente novamente.",
        icon: "error",
      });
    } finally {
      setIsReserving(false);
    }
  }


  return (
    <div>
      {(
        <div className="p-3" style={{ borderRadius: "8px" }}>
          <h1>Frete</h1>
          <div className="p-1" />
          <>
            <h4>{address?.address} - {address?.city.name}/{address?.state.acronym}</h4>
            <div className="flex flex-row gap-2">

              <h4>CEP: {address?.cep}
              </h4>
              <div className="flex flex-column justify-content-center cursor-pointer">
              </div>
            </div>
          </>
          <div className="gap-3">
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
      <div className="mt-4 flex flex-row justify-content-end gap-1">
        <ZButton
          label="Voltar"
          security="secondary"
          onClick={() => {
            handleActiveIndex(1);
          }}
        />
        <ZButton
          label="Continuar"
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
