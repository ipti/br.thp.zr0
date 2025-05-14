"use client";
import { redirect } from "next/navigation";
import { Button } from "primereact/button";
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { CategoryList } from "../type";

export default function ListPage({category}: {category: CategoryList}) {
  const header = (
    <div className="flex flex-wrap align-items-center justify-content-between gap-2">
      <span className="text-xl text-900 font-bold">
        Categorias
      </span>
      <Button
        icon="pi pi-plus"
        onClick={() => {
          redirect("/seller/category/create");
        }}
        label="Criar"
      />
    </div>
  );
  return (
    <div>
      <DataTable value={category} header={header}>
        <Column field="name" header="Name"></Column>
      </DataTable>
    </div>
  );
}
