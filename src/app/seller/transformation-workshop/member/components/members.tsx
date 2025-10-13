"use client";
import { ZButton } from "@/components/button/button";
import { getTranslatedLabelPerfis } from "@/utils/label_translation/perfis";
import { usePathname, useSearchParams } from "next/navigation";
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { useContext, useState } from "react";
import { useFetchRequestMemberTransformationWorkshop } from "../service/query";
import ModalAddMember from "./modal_add_member/modal_add_member";
import { getIdTw } from "@/service/cookies";
import { acessCreatePage } from "@/app/middleware/use_create";
import { ProfileContext } from "@/app/seller/context/profile.context";
import { acessUpdatePage } from "@/app/middleware/use_update";

export default function MemberTransformationWorkshopComponent() {
  const [visible, setVisible] = useState(false)

  const searchParams = useSearchParams();

  const idOt = searchParams.get("idOt");

  const { data } = useFetchRequestMemberTransformationWorkshop(idOt ?? (getIdTw() ?? ""))

const { profile } = useContext(ProfileContext)
  const pathname = usePathname();
  const createPermission = acessCreatePage(profile, pathname)
  // const updatePermission = acessUpdatePage(profile, pathname)


  const header = (
    <div className="flex flex-wrap align-items-center justify-content-between gap-2">
      <span className="text-xl text-900 font-bold">Membros</span>
      <ModalAddMember visible={visible} onHide={() => { setVisible(!visible) }} />
      {createPermission && <ZButton icon="pi pi-plus" onClick={() => { setVisible(!visible) }} label="Adicionar" />}
    </div>
  );
  return (
    <DataTable value={data?.transformation_workshop_user} header={header}>
      <Column field="users.name" header="Nome"></Column>
      <Column body={(e: any) => {
        return <>{getTranslatedLabelPerfis(e.users.role)}</>
      }} header="Perfil"></Column>
    </DataTable>
  );
}
