"use client";
import { redirect } from "next/navigation";
import { Button } from "primereact/button";
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { UserList } from "../type";
import { useFetchListUserTransformationWorkshop } from "../service/query";

export default function ListPage() {

  const {data: listUserRequest} = useFetchListUserTransformationWorkshop()

  var listUser: UserList | undefined = listUserRequest
  const header = (
    <div className="flex flex-wrap align-items-center justify-content-between gap-2">
      <span className="text-xl text-900 font-bold">Usuários</span>
      <Button
        icon="pi pi-plus"
        onClick={() => {
          redirect("/seller/user/create");
        }}
        label="Criar"
      />
    </div>
  );
  return (
    <div>
     
      <DataTable value={listUser} header={header}>
        <Column field="name" header="Nome"></Column>
        <Column field="email" header="Email"></Column>
        <Column field="role" header="Perfil"></Column>
      </DataTable>
    </div>
  );
}
