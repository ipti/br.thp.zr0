import { ZButton } from "@/components/button/button";
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { TransformationWorkshopUser } from "../../service/type";
import ModalAddMember from "./modal_add_member/modal_add_member";
import { useState } from "react";
import { getTranslatedLabelPerfis } from "@/utils/label_translation/perfis";

export default function MemberTransformationWorkshop({
  members,
}: {
  members: TransformationWorkshopUser[];
}) {

  const [visible, setVisible] = useState(false)
  const header = (
    <div className="flex flex-wrap align-items-center justify-content-between gap-2">
      <span className="text-xl text-900 font-bold">Membros</span>
      <ModalAddMember visible={visible} onHide={() => {setVisible(!visible)}} />
      <ZButton icon="pi pi-plus" onClick={() => {setVisible(!visible)}} label="Adicionar" />
    </div>
  );
  return (
    <DataTable value={members} header={header}>
      <Column field="users.name" header="Nome"></Column>
      <Column body={(e: TransformationWorkshopUser) => {
                return <>{getTranslatedLabelPerfis(e.users.role)}</>
              }} header="Perfil"></Column>
    </DataTable>
  );
}
