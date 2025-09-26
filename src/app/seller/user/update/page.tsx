"use client";
import FormCreateUser from "../components/form";
import { useSearchParams } from "next/navigation";
import { useFetchRequestUserOne } from "../service/query";

export default function UpdateUser() {

  const searchParams = useSearchParams();
  const idUser = searchParams.get("idUser");
  const { data, isLoading } = useFetchRequestUserOne(idUser ?? "");


  if (isLoading) return <div>Carregando...</div>;
  if (!data) return <div>Usuário não encontrado</div>;

  return (
    <div className="container">
      <FormCreateUser mode="update"  initialData={data} />
    </div>
  );
}
