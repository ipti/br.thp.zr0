"use client";
import TitlePage from "@/components/title_page/title_page";
import { useSearchParams } from "next/navigation";
import { useFetchRequestTransformationWorkshopOne } from "../service/query";
import { TransfWorkOneType } from "../service/type";
import MemberTransformationWorkshop from "./members/members";
import ZCard from "@/components/card/card";

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
      <div className="col-12 md:col-6">
        <ZCard title="Produtos" icon={true} path_img_or_icon="pi pi-box" />
      </div>
      <MemberTransformationWorkshop
        members={transfWork?.transformation_workshop_user}
      />
    </div>
  );
}
