"use client";

import FormTransformationWorkshop from "../components/form";
import { useSearchParams } from "next/navigation";
import { useFetchRequestTransformationWorkshop } from "./service/query";

export default function UpdateTransformationWorkshop() {
  const searchParams = useSearchParams();
  const idOt = searchParams.get("idOt");
  const { data, isLoading } = useFetchRequestTransformationWorkshop(idOt ?? "");

  if (isLoading) return <div>Carregando...</div>;
  if (!data) return <div>Oficina não encontrada</div>;

  return (
    <div className="container">
      <FormTransformationWorkshop mode="update" initialData={data} />
    </div>
  );
}
