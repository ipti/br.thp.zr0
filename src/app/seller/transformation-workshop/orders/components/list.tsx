"use client"
import { getIdTw } from "@/service/cookies";
import { useSearchParams } from "next/navigation";
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { TransformationWorkshopOrder } from "../../one/service/type";
import { ProductTransfWorkshopController } from "../../product/service/controller";
import { useFetchRequestOrderTransformationWorkshop } from "../service/query";
import { OrderlistType } from "../service/types";

export default function ListPage(){
       const searchParams = useSearchParams();
       
         const idOt = searchParams.get("idOt");
       const productTransfWorkshopController = ProductTransfWorkshopController();
    
      const {data} = useFetchRequestOrderTransformationWorkshop(idOt ?? getIdTw())

      var order: OrderlistType | undefined = data
    
    //    const header = (
    //       <div className="flex flex-wrap align-items-center justify-content-between gap-2">
    //         <span className="text-xl text-900 font-bold">Produtos da OT</span>
    //         <ModalAddProduct visible={visible} onHide={() => {setVisible(!visible)}} />
    //         <ZButton icon="pi pi-plus" onClick={() => {setVisible(!visible)}} label="Adicionar" />
    //       </div>
    //     );
      
      
      
            const onRowEditComplete = (e: any) => {
              const rowData = e.newData
              productTransfWorkshopController.UpdateProductTransfWorkshopAction(rowData.id, {quantity: rowData.quantity})
          };
        return (
          <DataTable editMode="row" dataKey="id" onRowEditComplete={onRowEditComplete} value={order?.order}>
            <Column
                    body={(e: TransformationWorkshopOrder) => {
                      return <>{e.uid.substring(0, 12)}...</>;
                    }}
                    header="ID Pedido"
                  ></Column>
                  <Column field="_count.order_items" header="Quantidade"></Column>
                  <Column field="payment_status" header="Status de pagamento"></Column>
                  <Column field="status" header="Status do pedido"></Column>
                  <Column field="createdAt" header="Data do pedido"></Column>
                  <Column
                    body={(e: TransformationWorkshopOrder) => {
                      return <>R${e.total_amount}</>;
                    }}
                    header="Total"
                  ></Column>
          </DataTable>
        );
}