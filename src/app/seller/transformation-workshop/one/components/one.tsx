"use client";
import TitlePage from "@/components/title_page/title_page";
import { useSearchParams } from "next/navigation";
import { useFetchRequestTransformationWorkshopOne } from "../service/query";
import { TransfWorkOneType } from "../service/type";
import MemberTransformationWorkshop from "./members/members";
import ProductTransformationWorkshop from "./products/products";

export default function TransformationWorkshopOneComponent() {
  const searchParams = useSearchParams();

  const idOt = searchParams.get("idOt");

  const { data: transfWorkRequest } =
    useFetchRequestTransformationWorkshopOne(idOt);

  var transfWork: TransfWorkOneType | undefined = transfWorkRequest;

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
