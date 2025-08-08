import ZCard from "@/components/card/card";
import { UserGlobal } from "@/service/global_request/type";
import "../card_address/card_address.css";
import ZDivider from "@/components/divider/divider";

export default function CardPerson({
  item,
  isEdit,
}: {
  item: UserGlobal;
  isEdit?: boolean;
}) {
  return (
    <ZCard className="text-p">
      <div className="card-style">
        {item?.name && <h4>{item.name}</h4>}
        <div className="p-1" />
        {item?.customer.cpf && <p>CPF {item.customer.cpf}</p>}
        {item.customer.cnpj && <p>CNPJ {item.customer.cnpj}</p>}
        <div className="p-1" />
        <div className="flex flex-column">
          <div className="p-2" />
          <h5>
            {item?.customer?.billing_address?.address},{" "}
            {item?.customer?.billing_address?.number}
          </h5>
          <div className="p-1" />
          <p>
            {item?.customer?.billing_address?.cep} -{" "}
            {item?.customer.billing_address?.city?.name} -{" "}
            {item?.customer.billing_address?.state?.acronym}
          </p>
          <div className="p-1" />
          <p>
            {item?.name} - {item?.customer?.phone}
            {}{" "}
          </p>
        </div>
      </div>
      {isEdit && (
        <>
          <ZDivider />
          <div className="card-style">
            <div className="text-blue">
              <p>Modificar dados de faturamento</p>
            </div>
          </div>
        </>
      )}
    </ZCard>
  );
}
