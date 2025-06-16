"use client"
import { ZButton } from "@/components/button/button";
import { useRouter, useSearchParams } from "next/navigation";
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { TransformationWorkshopProduct } from "../../service/type";
import { getIdTw } from "@/service/cookies";

export default function ProductTransformationWorkshop({
  product,
}: {
  product: TransformationWorkshopProduct[];
}) {


  const searchParams = useSearchParams();

  const idOt = searchParams.get("idOt");
  const history = useRouter()

  const header = (
    <div className="flex flex-wrap align-items-center justify-content-between gap-2">
      <span className="text-xl text-900 font-bold">Produtos</span>
      <ZButton text onClick={() => { history.push("/seller/transformation-workshop/product?idOt=" + (idOt ?? getIdTw()))}} label="Ver mais" />
    </div>
  );


  // const onRowEditComplete = (e: any) => {
  //   const rowData = e.newData
  //   transfWorkshopController.UpdateProductTransfWorkshopAction(rowData.id, { quantity: rowData.quantity })
  // };
  return (
    <DataTable editMode="row" dataKey="id" value={product} header={header}>
      <Column header={"Imagem"} style={{ width: '10%' }} body={(e) =>
        <img style={{ height: "64px" }} src={e?.product?.product_image?.length > 0 ? e?.product?.product_image![0]?.img_url : null} alt="Imagem produto"></img>
      }></Column>
      <Column field="product.name" header="Nome"></Column>
      <Column field="quantity" header="Quantidade"></Column>
      {/* <Column rowEditor={allowEdit} headerStyle={{ width: '10%', minWidth: '8rem' }} bodyStyle={{ textAlign: 'center' }}></Column> */}
    </DataTable>
  );
}
