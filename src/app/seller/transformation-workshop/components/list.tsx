"use client";
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { oficinasMock } from "../service/oficinas.mock";
import { Button } from "primereact/button";
import { redirect } from "next/navigation";

export default function ListTransformationWorkshop() {
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
      <DataTable value={oficinasMock} header={header}>
        <Column field="name" header="Name"></Column>
        <Column field="cnpj" header="CNPJ"></Column>
        <Column field="locale" header="Localização"></Column>
        <Column field="email" header="Email"></Column>
      </DataTable>
    </div>
  );
}
