import { Address } from "@/app/profile/address/service/type";
import "./card_address.css";
import ZRadioButton from "@/components/radio_button/radio_button";
import ZCard from "@/components/card/card";
import ZDivider from "@/components/divider/divider";
import { useCartStepsStore } from "../../zustand/zustand";

export default function CardAddress({
  item,
  isView,
  isEdit,
  setFieldValue
}: {
  item: Address;
  isView?: boolean;
  isEdit?: boolean;
  setFieldValue?: (field: string, value: number) => void
  
}) {
    const cartSteps = useCartStepsStore(state => state)


  return (
    <ZCard
      className={`checkout-selectable-card${item.id === cartSteps.cartSteps.address_selected && !isEdit ? ' is-selected' : ''}`}
      role={!isView ? 'radio' : undefined}
      aria-checked={!isView ? item.id === cartSteps.cartSteps.address_selected : undefined}
      tabIndex={!isView ? 0 : undefined}
      onClick={() =>{

        cartSteps.updateCartSteps({
          ...cartSteps.cartSteps,
          address_selected: item.id,
          deliverySelected: undefined,
        })
        if(setFieldValue) setFieldValue("address_selected", item.id)
      }
      }
      onKeyDown={event => {
        if (!isView && (event.key === 'Enter' || event.key === ' ')) {
          event.preventDefault()
          cartSteps.updateCartSteps({ ...cartSteps.cartSteps, address_selected: item.id, deliverySelected: undefined })
          if (setFieldValue) void setFieldValue('address_selected', item.id)
        }
      }}
    >
      <div className=" card-style flex flex-row">
        {!isView && (
          <>
            <div className="flex flex-column justify-content-center">
              <ZRadioButton
                value={item.id}
                checked={item.id === cartSteps.cartSteps.address_selected}
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
