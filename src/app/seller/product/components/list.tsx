"use client";
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { Button } from "primereact/button";
import { redirect } from "next/navigation";
import { productsMock } from "../service/product.mock";

export default function ListPage() {
  const header = (
    <div className="flex flex-wrap align-items-center justify-content-between gap-2">
      <span className="text-xl text-900 font-bold">
        Produtos
      </span>
      <Button
        icon="pi pi-plus"
        onClick={() => {
          redirect("/seller/product/create");
        }}
        label="Criar"
      />
    </div>
  );
  return (
    <div>
      <DataTable value={productsMock} header={header}>
        <Column field="name" header="Name"></Column>
        <Column field="category" header="Categoria"></Column>
        <Column field="stock" header="Estoque"></Column>
        <Column field="price" header="Preço"></Column>
      </DataTable>
    </div>
  );
}
