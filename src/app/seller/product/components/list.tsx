"use client";
import { redirect } from "next/navigation";
import { Button } from "primereact/button";
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { ProductList } from "../type";

export default function ListPage({product}:{product: ProductList}) {
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
      <DataTable value={product} header={header}>
        <Column field="name" header="Name"></Column>
        <Column field="category.name" header="Categoria"></Column>
        <Column header={"Preço"} body={(e)=>
        <>R${e.price.toFixed(2)}</>
        }></Column>
      </DataTable>
    </div>
  );
}
