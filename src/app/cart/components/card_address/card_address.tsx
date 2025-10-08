import { Address } from "@/app/profile/address/service/type";
import "./card_address.css";
import ZRadioButton from "@/components/radio_button/radio_button";
import { useContext } from "react";
import { CardContextType, CartContext } from "../../context/context";
import ZCard from "@/components/card/card";
import ZDivider from "@/components/divider/divider";
import { FormikErrors } from "formik";

export default function CardAddress({
  item,
  isView,
  isEdit,
  setFieldValue
}: {
  item: Address;
  isView?: boolean;
  isEdit?: boolean;
  setFieldValue?: (field: string, value: any, shouldValidate?: boolean) => Promise<void | FormikErrors<{
    address_selected: string;
}>>
  
}) {
  const { initialValue, setInitialValue } = useContext(
    CartContext
  ) as CardContextType;

  return (
    <ZCard
      onClick={() =>{

        setInitialValue((prev) => ({
          ...prev,
          address_selected: item.id,
        }))
        if(setFieldValue) setFieldValue("address_selected", item.id)
      }
      }
    >
      <div className=" card-style flex flex-row">
        {!isView && (
          <>
            <div className="flex flex-column justify-content-center">
              <ZRadioButton
                value={item.id}
                checked={item.id === initialValue.address_selected}
              />
            </div>
            <div className="p-2" />
          </>
        )}

        <div className="flex flex-column">
          <h5>
            {item?.address}, {item?.number}
          </h5>
          <div className="p-1" />
          <p>
            {item?.cep} - {item?.city?.name} - {item?.state?.acronym}
          </p>
          <div className="p-1" />
          <p>
            {item?.name} - {item?.phone}
            {}{" "}
          </p>
        </div>
      </div>
      {isEdit && (
        <>
          <ZDivider />
          <div className="card-style">
            <div className="text-blue">
              <p>Modificar endereço de entrega</p>
            </div>
          </div>
        </>
      )}
    </ZCard>
  );
}
