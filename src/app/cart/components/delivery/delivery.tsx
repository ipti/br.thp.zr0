import { ShippingGetType, ValidOption } from "@/app/product/service/type";
import { ZButton } from "@/components/button/button";
import ZRadioButton from "@/components/radio_button/radio_button";
import { useContext, useEffect, useState } from "react";
import { useFetchAddressOneRequest } from "../../service/query";
import { CartContext, DeliverySelectedType } from "../../context/context";
import { ProductClientController } from "@/app/product/service/controller";
import { Address } from "@/app/profile/address/service/type";
import ZSkeleton from "@/components/skeleton/skeleton";
import { CardDelivery } from "./card_delivery";

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

  const productClientController = ProductClientController({
    setShipping,
    setShippingSelect,
  });

  const cartContext = useContext(CartContext);

  const { data, isLoading } = useFetchAddressOneRequest(
    cartContext?.initialValue.address_selected ?? 0
  );

  const handleShippingCalculate = (cep?: string) => {
    if (cep) {
      setLoading(true)
      productClientController.ShippingCalculateAction(
        {
          destinationZipCode: cep.replace(/[^a-zA-Z0-9 ]/g, ""),
          orderItems: cartContext?.productSelected() ?? [],
        },
        setLoading
      );
    }
  };

  var address: Address | undefined = data;
  useEffect(() => {
    if (address) handleShippingCalculate(address.cep);
  }, [address]);

  const handleSelectOptions = (data: DeliverySelectedType) => {

    if (shippingSelect?.find((item) => item.productId === data.productId && item.workshopId === data.workshopId)) {
      const t = shippingSelect?.filter((item) => !(item.productId === data.productId && item.workshopId === data.workshopId))
      return ([...t, { productId: data.productId, workshopId: data.workshopId, validOptions: data.validOptions, productName: data.productName, workshopName: data.workshopName, quantity: data.quantity  }])
    } else {
      return [...shippingSelect, { productId: data.productId, workshopId: data.workshopId, validOptions: data.validOptions, productName: data.productName, workshopName: data.workshopName, quantity: data.quantity }]
    }
  }


  return (
    <div>
      {(
        <div className="p-3" style={{ borderRadius: "8px" }}>
          <h1>Frete</h1>
          <div className="p-1" />
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
                    <CardDelivery cartContext={cartContext} handleSelectOptions={handleSelectOptions} setShippingSelect={setShippingSelect} shippingItem={shippingItem} shippingSelect={shippingSelect} />
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
          onClick={() => {
            handleActiveIndex(3);
          }}
        />
      </div>
    </div>
  );
}
