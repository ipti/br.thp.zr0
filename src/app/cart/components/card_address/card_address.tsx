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
  setFieldValue,
  onEdit
}: {
  item: Address;
  isView?: boolean;
  isEdit?: boolean;
  setFieldValue?: (field: string, value: number) => void
  onEdit?: () => void
  
}) {
    const cartSteps = useCartStepsStore(state => state)


  const selectAddress = () => {
    if (isView) return
    cartSteps.updateCartSteps({
      ...cartSteps.cartSteps,
      address_selected: item.id,
      deliverySelected: undefined,
    })
    if (setFieldValue) setFieldValue('address_selected', item.id)
  }

  const addressLabelId = `checkout-address-${item.id}`

  return (
    <ZCard
      className={isView
        ? 'checkout-review-card'
        : `checkout-selectable-card${item.id === cartSteps.cartSteps.address_selected ? ' is-selected' : ''}`}
      onClick={selectAddress}
    >
      <div className=" card-style flex flex-row">
        {!isView && (
          <>
            <div className="flex flex-column justify-content-center">
              <ZRadioButton
                inputId={`address-radio-${item.id}`}
                name="delivery-address"
                value={item.id}
                checked={item.id === cartSteps.cartSteps.address_selected}
                aria-labelledby={addressLabelId}
                onChange={selectAddress}
              />
            </div>
            <div className="p-2" />
          </>
        )}

        <div className="flex flex-column" id={addressLabelId}>
          <strong>
            {item?.address}, {item?.number}
          </strong>
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
          <div className="card-style checkout-card-action">
            <button type="button" onClick={onEdit}>
              Modificar endereço de entrega
            </button>
          </div>
        </>
      )}
    </ZCard>
  );
}
