"use client";
import { ZButton } from "@/components/button/button";
import ZInputNumber from "@/components/input_number/input_number";
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { useState } from "react";
import ModalAddProduct from "./modal_add_product/modal_add_product";
import { useFetchRequestProductTransformationWorkshop } from "../service/query";
import { getIdTw } from "@/service/localstorage";
import { useSearchParams } from "next/navigation";

export default function ListPage() {
   const [visible, setVisible] = useState(false);
   const searchParams = useSearchParams();
   
     const idOt = searchParams.get("idOt");
  //  const transfWorkshopController = TransfWorkshopController();

  const {data} = useFetchRequestProductTransformationWorkshop(parseInt(idOt ?? "") ?? parseInt(getIdTw() ?? "99999"))

   const header = (
      <div className="flex flex-wrap align-items-center justify-content-between gap-2">
        <span className="text-xl text-900 font-bold">Produtos da OT</span>
        <ModalAddProduct visible={visible} onHide={() => {setVisible(!visible)}} />
        <ZButton icon="pi pi-plus" onClick={() => {setVisible(!visible)}} label="Adicionar" />
      </div>
    );
  
      const textEditorNumber = (options: any) => {
          return <ZInputNumber pt={{input:{root:{style: {witdh: "32px"}}}}} value={options.value} onChange={(e) => options.editorCallback(e.value)} />;
      };
  
      const allowEdit = (rowData: any) => {
          return rowData.name !== 'Blue Band';
      };
  
  
        const onRowEditComplete = (e: any) => {
          const rowData = e.newData
          // transfWorkshopController.UpdateProductTransfWorkshopAction(rowData.id, {quantity: rowData.quantity})
         console.log(e)
      };
    return (
      <DataTable editMode="row" dataKey="id" onRowEditComplete={onRowEditComplete} value={data?.transformation_workshop_product} header={header}>
        <Column header={"Imagem"} style={{ width: '10%' }}  body={(e)=>
          <img style={{height: "64px"}} src={e?.product?.product_image?.length > 0 ? e?.product?.product_image![0]?.img_url : null} alt="Imagem produto"></img>
          }></Column>
        <Column field="product.name" header="Nome"></Column>
        <Column field="quantity" editor={(options) => textEditorNumber(options)} header="Quantidade"></Column>
        <Column rowEditor={allowEdit} headerStyle={{ width: '10%', minWidth: '8rem' }} bodyStyle={{ textAlign: 'center' }}></Column>
      </DataTable>
    );
  
}
