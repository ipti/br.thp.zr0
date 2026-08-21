"use client";
import TitlePage from "@/components/title_page/title_page";
import { useSearchParams } from "next/navigation";
import { useFetchRequestTransformationWorkshopOne } from "../service/query";
import { TransfWorkOneType } from "../service/type";
import MemberTransformationWorkshop from "./members/members";
import ProductTransformationWorkshop from "./products/products";
import { getIdTw } from "@/service/cookies";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "primereact/button";
import OrdersTransformationWorkshop from "./orders/orders";

export default function TransformationWorkshopOneComponent() {
  const searchParams = useSearchParams();
  const [id, setId] = useState<string | undefined>(undefined);
  const history = useRouter()
  useEffect(() => {
    const idOtParam = searchParams.get("idOt");
    setId(idOtParam ?? getIdTw());
  }, [searchParams]);


  const { data: transfWorkRequest, isLoading } = useFetchRequestTransformationWorkshopOne(id);

  const transfWork: TransfWorkOneType | undefined = transfWorkRequest;

  if (isLoading) return <div>Carregando...</div>;

  if (!transfWorkRequest) {
    return (
      <>
        Sem oficina de transformação
      </>
    )
  }

  return (
    <div>

      <div className="flex flex-column md:flex-row justify-content-between align-items-start md:align-items-center gap-3 mb-4">
        <TitlePage title={'Informações da oficina'} />
        <Button
          label="Gerenciar produção"
          icon="pi pi-cog"
          onClick={() => history.push('/seller/transformation-workshop/production')}
        />
      </div>


      <div className="mb-4">
        <div className="grid">
          <div className="col-12 md:col-6">
            <p><strong>Nome:</strong> {transfWork?.name}</p>
          </div>
          <div className="col-12 md:col-6">
            <p><strong>CNPJ:</strong> {transfWork?.cnpj}</p>
          </div>

          <div className="col-12 md:col-6">
            <p><strong>Endereço:</strong> {transfWork?.address}, {transfWork?.number}</p>
          </div>
          <div className="col-12 md:col-6">
            <p><strong>Bairro:</strong> {transfWork?.neighborhood}</p>
          </div>
          <div className="col-12 md:col-6">
            <p><strong>CEP:</strong> {transfWork?.cep}</p>
          </div>
          <div className="col-12 md:col-6">
            <p><strong>Cidade:</strong> {transfWork?.city?.name}</p>
          </div>
          <div className="col-12 md:col-6">
            <p><strong>Estado:</strong> {transfWork?.state?.acronym} - {transfWork?.state?.name}</p>
          </div>
          <div className="col-12 md:col-6">
            <p><strong>Criada em:</strong> {new Date(transfWork?.createdAt).toLocaleDateString()}</p>
          </div>
        </div>
      </div>

      <div className="p-2" />
      <div className="mb-2">
        <OrdersTransformationWorkshop order={transfWork?.order} />
      </div>
      <div className="grid">
        <div className="col-12 md:col-7">
          <ProductTransformationWorkshop
            product={transfWork?.transformation_workshop_product}
          />
        </div>
        <div className="col-12 md:col-5">
          <MemberTransformationWorkshop
            members={transfWork?.transformation_workshop_user}
          />
        </div>

      </div>
    </div>
  );
}
