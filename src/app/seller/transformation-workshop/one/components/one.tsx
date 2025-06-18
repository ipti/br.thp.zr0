"use client";
import TitlePage from "@/components/title_page/title_page";
import { useSearchParams } from "next/navigation";
import { useFetchRequestTransformationWorkshopOne } from "../service/query";
import { TransfWorkOneType } from "../service/type";
import MemberTransformationWorkshop from "./members/members";
import ProductTransformationWorkshop from "./products/products";
import { getIdTw } from "@/service/cookies";
import { useEffect, useState } from "react";

export default function TransformationWorkshopOneComponent() {
const searchParams = useSearchParams();
  const [id, setId] = useState<string | undefined>(undefined);

  useEffect(() => {
    const idOtParam = searchParams.get("idOt");
    setId(idOtParam ?? getIdTw());
  }, [searchParams]);

  const { data: transfWorkRequest } = useFetchRequestTransformationWorkshopOne(id);

  const transfWork: TransfWorkOneType | undefined = transfWorkRequest;

  // if (!id) return window;

  return (
    <div>
      <TitlePage title={transfWork?.name} />
      <p>CPNJ: {transfWork?.cnpj}</p>
      <div className="p-1" />
      <p>CEP: {transfWork?.cep}</p>
      <div className="p-4" />
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
