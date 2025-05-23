"use client";
import { redirect, useRouter } from "next/navigation";
import { Button } from "primereact/button";
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { useFetchRequestTransformationWorkshop } from "../service/query";

export default function ListTransformationWorkshop() {
  const history = useRouter()
  const {data: otRequest, isLoading} = useFetchRequestTransformationWorkshop()
  const header = (
    <div className="flex flex-wrap align-items-center justify-content-between gap-2">
      <span className="text-xl text-900 font-bold">
        Oficina de transfoprmações
      </span>
      <Button
        icon="pi pi-plus"
        onClick={() => {
          redirect("/seller/transformation-workshop/create");
        }}
        label="Criar"
      />
    </div>
  );
  return (
    <div>
      <DataTable value={otRequest} header={header} onSelectionChange={(e) => history.push("/seller/transformation-workshop/one?idOt="+e.value.transformation_workshop.id)} selectionMode="single" loading={isLoading}>
        <Column field="transformation_workshop.name" header="Nome"></Column>
        <Column field="transformation_workshop.cnpj" header="CNPJ"></Column>
        <Column field="transformation_workshop.city.name" header="Cidade"></Column>
        <Column field="transformation_workshop.state.name" header="Email"></Column>
      </DataTable>
    </div>
  );
}
