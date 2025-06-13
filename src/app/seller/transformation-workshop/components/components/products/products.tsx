import { ZButton } from "@/components/button/button";
import ZInputNumber from "@/components/input_number/input_number";
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { useState } from "react";
import { TransfWorkshopController } from "../../service/controller";
import { TransformationWorkshopProduct } from "../../service/type";

export default function ProductTransformationWorkshop({
  product,
}: {
  product: TransformationWorkshopProduct[];
}) {
 
  const [visible, setVisible] = useState(false)
    const transfWorkshopController = TransfWorkshopController();
  const header = (
    <div className="flex flex-wrap align-items-center justify-content-between gap-2">
      <span className="text-xl text-900 font-bold">Produtos</span>
      <ZButton text onClick={() => {setVisible(!visible)}} label="Ver mais" />
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
        transfWorkshopController.UpdateProductTransfWorkshopAction(rowData.id, {quantity: rowData.quantity})
       console.log(e)
    };
  return (
    <DataTable editMode="row" dataKey="id" onRowEditComplete={onRowEditComplete} value={product} header={header}>
      <Column header={"Imagem"} style={{ width: '10%' }}  body={(e)=>
        <img style={{height: "64px"}} src={e?.product?.product_image?.length > 0 ? e?.product?.product_image![0]?.img_url : null} alt="Imagem produto"></img>
        }></Column>
      <Column field="product.name" header="Nome"></Column>
      <Column field="quantity" editor={(options) => textEditorNumber(options)} header="Quantidade"></Column>
      <Column rowEditor={allowEdit} headerStyle={{ width: '10%', minWidth: '8rem' }} bodyStyle={{ textAlign: 'center' }}></Column>
    </DataTable>
  );
}
