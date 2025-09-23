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
      <div className="flex flex-wrap align-items-center justify-content-between gap-2">
        <TitlePage title={transfWork?.name} />
        <div>
          <Button
            icon="pi pi-pencil"
            onClick={() => {
              history.push(`/seller/transformation-workshop/update?idOt=${transfWork?.id}`);
            }}
            label="Editar"
          />
          <div className="p-4" />
        </div>
      </div>
      <p>CPNJ: {transfWork?.cnpj}</p>
      <div className="p-1" />
      <p>CEP: {transfWork?.cep}</p>
      <div className="p-4" />
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
