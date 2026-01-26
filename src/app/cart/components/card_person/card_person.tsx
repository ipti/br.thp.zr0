import ZCard from "@/components/card/card";
import { UserGlobal } from "@/service/global_request/type";
import "../card_address/card_address.css";
import ZDivider from "@/components/divider/divider";

export default function CardPerson({
  item,
  isEdit,
  cep
}: {
  item: UserGlobal;
  isEdit?: boolean;
  cep?: string;
}) {
  return (
    <ZCard className="text-p">
      <div className="card-style">
        <h4>Dados pessoais</h4>
        <p>Informações que serão inseridas na nota fiscal do pedido.</p>
        <div className="p-2" />
        <div className="grid">
        {item?.name && <div className="flex flex-row gap-1 col-12 md:col-6"><h5>Nome:</h5><div className="flex flex-column justify-content-center"><p>{item.name}</p></div></div>}
        {(item?.customer.cpf || item.customer.cnpj) && <div className="flex flex-row gap-1 col-12 md:col-6"><h5>CPF/CNPJ:</h5><div className="flex flex-column justify-content-center"><p> {item.customer.cpf} {item.customer.cnpj}</p></div></div>}
        {(item?.customer.phone) && <div className="flex flex-row gap-1 col-12 md:col-6"><h5>Telefone:</h5><div className="flex flex-column justify-content-center"><p> {item.customer.phone}</p></div></div>}
        {(item?.email) && <div className="flex flex-row gap-1 col-12 md:col-6"><h5>Email:</h5><div className="flex flex-column justify-content-center"><p> {item.email}</p></div></div>}
        {(cep) && <div className="flex flex-row gap-1 col-12 md:col-6"><h5>CEP:</h5><div className="flex flex-column justify-content-center"><p> {cep}</p></div></div>}
        </div>
      </div>
      {isEdit && (
        <>
          <ZDivider />
          <div className="card-style">
            <div className="flex flex-row gap-2" onClick={() => window.location.href = `/profile/your_information`}>
              {!item.customer.phone  && <i className="pi pi pi-exclamation-triangle" style={{ color: "#eab308" }}></i>}
              <div className="text-blue">
                <p>Modificar dados pessoais</p>
              </div>
            </div>
          </div>
        </>
      )}
    </ZCard>
  );
}
