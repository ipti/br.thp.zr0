import { ShippingGetType, ValidOption } from "@/app/product/service/type";
import { ZButton } from "@/components/button/button";
import ZRadioButton from "@/components/radio_button/radio_button";
import { useContext, useEffect, useState } from "react";
import { useFetchAddressOneRequest } from "../../service/query";
import { CartContext, DeliverySelectedType } from "../../context/context";
import { ProductClientController } from "@/app/product/service/controller";
import { Address } from "@/app/profile/address/service/type";
import ZSkeleton from "@/components/skeleton/skeleton";

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

  console.log(cartContext?.initialValue)
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

  console.log(shippingSelect)

  return (
    <div>
      {(
        <div className="bg-black-alpha-10 p-3" style={{ borderRadius: "8px" }}>
          <h3>Frete</h3>
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
                {shipping?.map((shippingItem) => {
                  return (<>
                    <h3>{shippingItem.productName} - {shippingItem.workshopName}</h3>
                    <h5>Quantidade - {shippingItem.quantity}</h5>
                    {shippingItem.result?.validOptions?.map(
                      (item, index) => {
                        return (
                          <div key={index} className="my-2">
                            {
                              <div className="flex flex-row justify-content-between m-1">
                                <div className="flex flex-row align-items-center">
                                  <ZRadioButton
                                    value={item}
                                    checked={!!shippingSelect?.find((select) => (select.productId === shippingItem.productId && select.workshopId === shippingItem.workshopId && select.validOptions.cost === item?.cost))}
                                    onChange={(e) => {
                                     const newState =  handleSelectOptions({ productId: shippingItem.productId, workshopId: shippingItem.workshopId, validOptions: item, productName: shippingItem.productName, workshopName: shippingItem.workshopName, quantity: shippingItem.quantity })
                                     setShippingSelect(newState) 
                                     cartContext?.setInitialValue((prev) => ({
                                        ...prev,
                                        deliverySelected: newState,
                                      }));
                                    }}
                                  />
                                  <div className="p-1" />
                                  <label>{item.carrier}</label>
                                </div>
                                <div>
                                  <h5>R${item.cost.toFixed(2)}</h5>
                                  <p>{item.deliveryTime} Dias úteis</p>
                                </div>
                              </div>
                            }
                          </div>
                        );
                      }
                    )}
                  </>)
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
          onClick={() => {
            handleActiveIndex(3);
          }}
        />
      </div>
    </div>
  );
}
