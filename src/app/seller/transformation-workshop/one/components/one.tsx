"use client";
import { useSearchParams } from "next/navigation";
import { useFetchRequestTransformationWorkshopOne } from "../service/query";
import { useLocation } from "react-router-dom";
import { TransfWorkOneType } from "../service/type";
import TitlePage from "@/components/title_page/title_page";
import MemberTransformationWorkshop from "./members/members";

export default function TransformationWorkshopOneComponent() {
  const searchParams = useSearchParams();

  const idOt = searchParams.get("idOt");

  const { data: transfWorkRequest } =
    useFetchRequestTransformationWorkshopOne(idOt);

  let transfWork: TransfWorkOneType | undefined = transfWorkRequest;

  return (
    <div>
      <TitlePage title={transfWork?.name} />
      <p>CPNJ: {transfWork?.cnpj}</p>
      <div className="p-1" />
      <p>CEP: {transfWork?.cep}</p>
      <div className="p-4" />
      <MemberTransformationWorkshop
        members={transfWork?.transformation_workshop_user}
      />
    </div>
  );
}
