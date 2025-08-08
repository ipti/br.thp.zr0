import { ShippingGetType, ValidOption } from "@/app/product/service/type";
import { ZButton } from "@/components/button/button";
import ZRadioButton from "@/components/radio_button/radio_button";
import { useContext, useEffect, useState } from "react";
import { useFetchAddressOneRequest } from "../../service/query";
import { CartContext } from "../../context/context";
import { ProductClientController } from "@/app/product/service/controller";
import { Address } from "@/app/profile/address/service/type";
import ZSkeleton from "@/components/skeleton/skeleton";

export default function Delivery({
  handleActiveIndex,
}: {
  handleActiveIndex: (i: number) => void;
}) {
  const [shipping, setShipping] = useState<ShippingGetType | undefined>();
  const [shippingSelect, setShippingSelect] = useState<
    ValidOption | undefined
  >();
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
      // setLoading(true)
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

  return (
    <div>
      {shipping && (
        <div className="bg-black-alpha-10 p-3" style={{ borderRadius: "8px" }}>
          <h3>Frete</h3>
          <div className="p-1" />
          <div className="gap-3">
            {loadingCep ? (
              <div className="flex flex-column gap-2">
                <ZSkeleton />
                <ZSkeleton />
                <ZSkeleton />
              </div>
            ) : (
              <>
                {shipping?.shipments[0]?.result?.validOptions?.map(
                  (item, index) => {
                    return (
                      <div key={index} className="my-2">
                        {
                          <div className="flex flex-row justify-content-between m-1">
                            <div className="flex flex-row align-items-center">
                              <ZRadioButton
                                value={item}
                                checked={item.cost === shippingSelect?.cost}
                                onChange={(e) => {
                                  setShippingSelect(e.target.value);
                                  cartContext?.setInitialValue((prev) => ({
                                    ...prev,
                                    deliverySelected: e.target.value,
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
              </>
            )}
          </div>
        </div>
      )}
      <div className="m-4 flex flex-row justify-content-end gap-1">
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
