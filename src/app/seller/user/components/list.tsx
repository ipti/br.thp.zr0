"use client";
import { getTranslatedLabelPerfis } from "@/utils/label_translation/perfis";
import { useRouter } from "next/navigation";
import { Button } from "primereact/button";
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { useFetchListUserTransformationWorkshop } from "../service/query";
import { User, UserList } from "../type";

export default function ListPage() {

  const {data: listUserRequest} = useFetchListUserTransformationWorkshop()

  const history = useRouter()

  var listUser: UserList | undefined = listUserRequest
  const header = (
    <div className="flex flex-wrap align-items-center justify-content-between gap-2">
      <span className="text-xl text-900 font-bold">Usuários</span>
      <Button
        icon="pi pi-plus"
        onClick={() => {
          history.push("/seller/user/create");
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
        <Column body={(e: User) => {
          return <>{getTranslatedLabelPerfis(e.role)}</>
        }} header="Perfil"></Column>
      </DataTable>
    </div>
  );
}
