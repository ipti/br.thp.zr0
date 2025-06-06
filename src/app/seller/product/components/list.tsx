"use client";
import { redirect } from "next/navigation";
import { Button } from "primereact/button";
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { useFetchRequestProduct } from "../service/query";

export default function ListPage() {
  const {data, isLoading} = useFetchRequestProduct()
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
      <DataTable value={data} header={header} loading={isLoading}>
      <Column header={"Imagem"} body={(e)=>
        <img src={e?.product_image[0]?.img_url} alt="Imagem produto"></img>
        }></Column>
        <Column field="name" header="Nome"></Column>
        <Column field="category.name" header="Categoria"></Column>
        <Column header={"Preço"} body={(e)=>
        <>R${e.price.toFixed(2)}</>
        }></Column>
      </DataTable>
    </div>
  );
}
