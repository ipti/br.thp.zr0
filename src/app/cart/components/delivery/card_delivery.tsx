import { ShippingGetType } from "@/app/product/service/type";
import ZCard from "@/components/card/card";
import ZRadioButton from "@/components/radio_button/radio_button";
import { useCartStepsStore } from "../../zustand/zustand";
import { formatCurrency } from '../../utils';
import { DeliverySelectedType } from '../../zustand/zustand';
import { Dispatch, SetStateAction } from 'react';

export function CardDelivery({ shippingItem, shippingSelect, setShippingSelect, handleSelectOptions }: { shippingItem: ShippingGetType, shippingSelect: DeliverySelectedType[], setShippingSelect: Dispatch<SetStateAction<DeliverySelectedType[]>>, handleSelectOptions: (value: DeliverySelectedType) => DeliverySelectedType[] }) {
    
        const cartSteps = useCartStepsStore(state => state)
    
    return (
        <div>
            <div className="delivery-group-heading">
              <h3>{shippingItem.productName}</h3>
              <p>{shippingItem.workshopName} · {shippingItem.quantity} {shippingItem.quantity === 1 ? 'unidade' : 'unidades'}</p>
            </div>
            {shippingItem.result?.validOptions?.map(
                (item, index) => {
                    return (
                        <div key={index} className="my-2">
                            {
                                <ZCard className={`checkout-selectable-card${!!shippingSelect?.find((select) => (select.productId === shippingItem.productId && select.workshopId === shippingItem.workshopId && select.validOptions.cost === item?.cost)) ? ' is-selected' : ''}`} role="radio" aria-checked={!!shippingSelect?.find((select) => (select.productId === shippingItem.productId && select.workshopId === shippingItem.workshopId && select.validOptions.cost === item?.cost))} tabIndex={0} onClick={() => {
                                    const newState = handleSelectOptions({ productId: shippingItem.productId, workshopId: shippingItem.workshopId, validOptions: item, productName: shippingItem.productName, workshopName: shippingItem.workshopName, quantity: shippingItem.quantity })
                                    setShippingSelect(newState)
                                    cartSteps?.updateCartSteps({
                                        ...cartSteps.cartSteps,
                                        deliverySelected: newState,
                                    });
                                }} onKeyDown={event => {
                                  if (event.key === 'Enter' || event.key === ' ') {
                                    event.preventDefault()
                                    const newState = handleSelectOptions({ productId: shippingItem.productId, workshopId: shippingItem.workshopId, validOptions: item, productName: shippingItem.productName, workshopName: shippingItem.workshopName, quantity: shippingItem.quantity })
                                    setShippingSelect(newState)
                                    cartSteps.updateCartSteps({ ...cartSteps.cartSteps, deliverySelected: newState })
                                  }
                                }}
                                >
                                    <div className="flex flex-row justify-content-between m-1 p-3" >
                                        <div className="flex flex-row align-items-center">
                                            <ZRadioButton
                                                value={item}
                                                checked={!!shippingSelect?.find((select) => (select.productId === shippingItem.productId && select.workshopId === shippingItem.workshopId && select.validOptions.cost === item?.cost))}
                                                onChange={() => {
                                                    const newState = handleSelectOptions({ productId: shippingItem.productId, workshopId: shippingItem.workshopId, validOptions: item, productName: shippingItem.productName, workshopName: shippingItem.workshopName, quantity: shippingItem.quantity })
                                                    setShippingSelect(newState)
                                                    cartSteps?.updateCartSteps({
                                                        ...cartSteps.cartSteps,
                                                        deliverySelected: newState,
                                                    });
                                                }}
                                            />
                                            <div className="p-1" />
                                            <h1>{item.carrier} ({item.service})</h1>
                                        </div>
                                        <div>
                                            <h4>{formatCurrency(item.cost)}</h4>
                                            <p>Entrega estimada em {item.deliveryTime} dias úteis</p>
                                        </div>
                                    </div>
                                </ZCard>
                            }
                        </div>
                    );
                }
            )}
        </div>)
}
