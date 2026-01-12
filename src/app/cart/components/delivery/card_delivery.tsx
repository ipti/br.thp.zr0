import { ShippingGetType } from "@/app/product/service/type";
import ZCard from "@/components/card/card";
import ZRadioButton from "@/components/radio_button/radio_button";

export function CardDelivery({ shippingItem, shippingSelect, setShippingSelect, cartContext, handleSelectOptions }: { shippingItem: ShippingGetType, shippingSelect: any[], setShippingSelect: (value: any) => void, cartContext: any, handleSelectOptions: (value: any) => any[] }) {
    return (
        <div>
            <h2>{shippingItem.productName} - {shippingItem.workshopName} (Qtd- {shippingItem.quantity})</h2>
            <h3></h3>
            {shippingItem.result?.validOptions?.map(
                (item, index) => {
                    return (
                        <div key={index} className="my-2">
                            {
                                <ZCard onClick={(e) => {
                                    const newState = handleSelectOptions({ productId: shippingItem.productId, workshopId: shippingItem.workshopId, validOptions: item, productName: shippingItem.productName, workshopName: shippingItem.workshopName, quantity: shippingItem.quantity })
                                    setShippingSelect(newState)
                                    cartContext?.setInitialValue((prev) => ({
                                        ...prev,
                                        deliverySelected: newState,
                                    }));
                                }} style={{cursor: 'pointer', border: !!shippingSelect?.find((select) => (select.productId === shippingItem.productId && select.workshopId === shippingItem.workshopId && select.validOptions.cost === item?.cost)) ? '1px solid var(--primary-color' : '' }}
                                >
                                    <div className="flex flex-row justify-content-between m-1 p-3" >
                                        <div className="flex flex-row align-items-center">
                                            <ZRadioButton
                                                value={item}
                                                checked={!!shippingSelect?.find((select) => (select.productId === shippingItem.productId && select.workshopId === shippingItem.workshopId && select.validOptions.cost === item?.cost))}
                                                onChange={(e) => {
                                                    const newState = handleSelectOptions({ productId: shippingItem.productId, workshopId: shippingItem.workshopId, validOptions: item, productName: shippingItem.productName, workshopName: shippingItem.workshopName, quantity: shippingItem.quantity })
                                                    setShippingSelect(newState)
                                                    cartContext?.setInitialValue((prev) => ({
                                                        ...prev,
                                                        deliverySelected: newState,
                                                    }));
                                                }}
                                            />
                                            <div className="p-1" />
                                            <h1>{item.carrier} ({item.service})</h1>
                                        </div>
                                        <div>
                                            <h2>R${item.cost.toFixed(2)}</h2>
                                            <p>{item.deliveryTime} Dias úteis</p>
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