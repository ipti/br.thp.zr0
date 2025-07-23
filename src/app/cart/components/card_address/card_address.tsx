import { Address } from "@/app/profile/address/service/type";
import "./card_address.css"
import ZRadioButton from "@/components/radio_button/radio_button";
import { useContext } from "react";
import { CardContextType, CartContext } from "../../context/context";

export default function CardAddress({ item }: { item: Address }) {

    const { initialValue, setInitialValue } = useContext(CartContext) as CardContextType

    return (
        <div className="card_address" onClick={() => setInitialValue((prev) => ({
            ...prev, address_selected: item.id
        }))}>
            <div className="flex flex-row">
                <div className="flex flex-column justify-content-center">
                    <ZRadioButton value={item.id} checked={item.id === initialValue.address_selected} />
                </div>
                <div className="p-2" />
                <div className="flex flex-column">

                    <h4>
                        {item.address}, {item.number}
                    </h4>
                    <div className="p-1" />
                    <p>
                        {item.cep} - {item.city.name} - {item.state.acronym}
                    </p>
                    <div className="p-1" />
                    <p>
                        {item.name} - {item.phone}
                        { }            </p>
                </div>
            </div>
        </div>
    )
}