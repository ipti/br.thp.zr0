import { ZButton } from "@/components/button/button";
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { TransformationWorkshopUser } from "../../service/type";

export default function MemberTransformationWorkshop({
  members,
}: {
  members: TransformationWorkshopUser[];
}) {
  const header = (
    <div className="flex flex-wrap align-items-center justify-content-between gap-2">
      <span className="text-xl text-900 font-bold">Membros</span>
      <ZButton icon="pi pi-plus" onClick={() => {}} label="Adicionar" />
    </div>
  );
  return (
    <DataTable value={members} header={header}>
      <Column field="users.name" header="Nome"></Column>
      <Column field="users.email" header="Email"></Column>
      <Column field="users.role" header="Cidade"></Column>
    </DataTable>
  );
}
