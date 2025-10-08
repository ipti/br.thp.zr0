import { Address } from "../../service/type";
import "./card_address.css"

export default function CardAddress({ item }: { item: Address }) {
    return (
        <div className="card_address">
            <h4>
                {item.address}, {item.number}
            </h4>
            <div className="p-1" />
            <p>
                {item.cep} - {item.city?.name} - {item.state?.acronym}
            </p>
            <div className="p-1" />
            <p>
                {item.name} - {item.phone}
                { }            </p>
        </div>
    )
}