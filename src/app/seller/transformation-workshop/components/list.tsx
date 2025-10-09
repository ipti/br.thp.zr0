"use client";
import { useRouter } from "next/navigation";
import { Button } from "primereact/button";
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { useFetchRequestTransformationWorkshop } from "../service/query";
import { useContext } from "react";
import { ProfileContext } from "../../context/profile.context";
import { acessCreatePage } from "@/app/middleware/use_create";

export default function ListTransformationWorkshop() {
  const history = useRouter()
  const { data: otRequest, isLoading } = useFetchRequestTransformationWorkshop()
  const data = useContext(ProfileContext)
  const createPermission = acessCreatePage(data?.profile, '/seller/transformation-workshop/create')
  const header = (
    <div className="flex flex-wrap align-items-center justify-content-between gap-2">
      <span className="text-xl text-900 font-bold">
        Oficinas de transformações
      </span>
      <Button
        icon="pi pi-plus"
        onClick={() => {
          history.push("/seller/transformation-workshop/create");
        }}
        label="Criar"
      />
    </div>
  );

   const actionBodyTemplate = (rowData: any) => {
    return (
      <Button
        icon="pi pi-pencil"
        className="p-button-rounded p-button-text p-button-plain"
        onClick={() => {
          history.push(
            `/seller/transformation-workshop/update?idOt=${rowData.transformation_workshop.id}`
          );
        }}
      />
    );
  };
  
  return (
    <div>
      <DataTable value={otRequest} header={header} onSelectionChange={(e) => history.push("/seller/transformation-workshop/one?idOt=" + e.value.transformation_workshop.id)} selectionMode="single" loading={isLoading}>
        <Column field="transformation_workshop.name" header="Nome"></Column>
        <Column field="transformation_workshop.cnpj" header="CNPJ"></Column>
        <Column field="transformation_workshop.city.name" header="Cidade"></Column>
        <Column field="transformation_workshop.state.name" header="Email"></Column>
        <Column header="Ações" bodyStyle={{ textAlign: 'center' }} body={actionBodyTemplate}></Column>
      </DataTable>
    </div>
  );
}
