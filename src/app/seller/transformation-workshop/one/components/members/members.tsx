"use client"
import { ZButton } from "@/components/button/button";
import { getTranslatedLabelPerfis } from "@/utils/label_translation/perfis";
import { useRouter, useSearchParams } from "next/navigation";
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { TransformationWorkshopUser } from "../../service/type";
import { getIdTw } from "@/service/cookies";

export default function MemberTransformationWorkshop({
  members,
}: {
  members: TransformationWorkshopUser[];
}) {

    const searchParams = useSearchParams();
  
    const idOt = searchParams.get("idOt");
    const history = useRouter()

  const header = (
    <div className="flex flex-wrap align-items-center justify-content-between gap-2">
      <span className="text-xl text-900 font-bold">Membros</span>
      <ZButton text onClick={() => { history.push("/seller/transformation-workshop/member?idOt=" +(idOt ?? getIdTw())) }} label="Ver mais" />
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
