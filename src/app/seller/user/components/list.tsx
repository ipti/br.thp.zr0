"use client";
import { getTranslatedLabelPerfis } from "@/utils/label_translation/perfis";
import { usePathname, useRouter } from "next/navigation";
import { Button } from "primereact/button";
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { useFetchListUserTransformationWorkshop } from "../service/query";
import { User, UserList } from "../type";
import { useContext } from "react";
import { ProfileContext } from "../../context/profile.context";
import { acessCreatePage } from "@/app/middleware/use_create";
import { acessUpdatePage } from "@/app/middleware/use_update";

export default function ListPage() {

  const {data: listUserRequest} = useFetchListUserTransformationWorkshop()

  const history = useRouter()

  const { profile } = useContext(ProfileContext)
      const pathname = usePathname();
      const createPermission = acessCreatePage(profile, pathname)
      const updatePermission = acessUpdatePage(profile, pathname)

  var listUser: UserList | undefined = listUserRequest
  const header = (
    <div className="flex flex-wrap align-items-center justify-content-between gap-2">
      <span className="text-xl text-900 font-bold">Usuários</span>
      {createPermission &&<Button
        icon="pi pi-plus"
        onClick={() => {
          history.push("/seller/user/create");
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
          history.push(`/seller/user/update?idUser=${rowData.id}`);
        }}
      />
    );
  };

  return (
    <div>
     
      <DataTable value={listUser} header={header}>
        <Column field="name" header="Nome"></Column>
        <Column field="email" header="Email"></Column>
        <Column body={(e: User) => {
          return <>{getTranslatedLabelPerfis(e.role)}</>
        }} header="Perfil"></Column>
      {updatePermission&&  <Column header="Ações" bodyStyle={{ textAlign: 'center' }} body={actionBodyTemplate}></Column>}
      </DataTable>
    </div>
  );
}
