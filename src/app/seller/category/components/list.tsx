"use client";
import { usePathname, useRouter } from "next/navigation";
import { Button } from "primereact/button";
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { useFetchRequestCategory } from "../service/query";
import { useContext } from "react";
import { ProfileContext } from "../../context/profile.context";
import { acessCreatePage } from "@/app/middleware/use_create";
import { acessUpdatePage } from "@/app/middleware/use_update";

export default function ListPage() {

  const { data, isLoading } = useFetchRequestCategory()

  const history = useRouter()

   const { profile } = useContext(ProfileContext)
    const pathname = usePathname();
    const createPermission = acessCreatePage(profile, pathname)
    const updatePermission = acessUpdatePage(profile, pathname)

  const header = (
    <div className="flex flex-wrap align-items-center justify-content-between gap-2">
      <span className="text-xl text-900 font-bold">
        Categorias
      </span>
      {createPermission &&<Button
        icon="pi pi-plus"
        onClick={() => {
          history.push("/seller/category/create");
        }}
        label="Criar"
      />}
    </div>
  );

  const actionBodyTemplate = (rowData: any) => {
    return (
      <Button
        icon="pi pi-pencil"
        className="p-button-rounded p-button-text p-button-plain"
        onClick={() => {
          history.push(`/seller/category/update?idCategory=${rowData.id}`);
        }}
      />
    );
  };

  return (
    <div>
      <DataTable value={data} header={header} loading={isLoading}>
        <Column field="name" header="Name"></Column>
        {updatePermission && <Column header="Ações" bodyStyle={{ textAlign: 'center' }} body={actionBodyTemplate}></Column>}
      </DataTable>
    </div>
  );
}
