"use client"
import { getIdTw } from "@/service/cookies";
import { useRouter, useSearchParams } from "next/navigation";
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { TransformationWorkshopOrder } from "../../one/service/type";
import { ProductTransfWorkshopController } from "../../product/service/controller";
import { useFetchRequestOrderTransformationWorkshop } from "../service/query";
import { OrderlistType } from "../service/types";
import { paymentStatus } from "@/utils/enum/payment_status";
import { formatDateToBR } from "@/utils/hook/format_data";
import { orderStatus } from "@/utils/enum/order_status";

export default function ListPage() {
  const searchParams = useSearchParams();

  const idOt = searchParams.get("idOt");
  const productTransfWorkshopController = ProductTransfWorkshopController();

    const history = useRouter()
  

  const { data } = useFetchRequestOrderTransformationWorkshop(idOt ?? getIdTw())

  var order: OrderlistType[] | undefined = data

  //    const header = (
  //       <div className="flex flex-wrap align-items-center justify-content-between gap-2">
  //         <span className="text-xl text-900 font-bold">Produtos da OT</span>
  //         <ModalAddProduct visible={visible} onHide={() => {setVisible(!visible)}} />
  //         <ZButton icon="pi pi-plus" onClick={() => {setVisible(!visible)}} label="Adicionar" />
  //       </div>
  //     );



  const onRowEditComplete = (e: any) => {
    const rowData = e.newData
    productTransfWorkshopController.UpdateProductTransfWorkshopAction(rowData.id, { quantity: rowData.quantity })
  };
  return (
    <DataTable editMode="row" dataKey="id" onRowEditComplete={onRowEditComplete} value={order} onSelectionChange={(e) => history.push("/seller/transformation-workshop/orders/one?idOrder="+e.value.id)} selectionMode="single">
      <Column
        body={(e: TransformationWorkshopOrder) => {
          return <>{e.uid.substring(0, 6)}...</>;
        }}
        header="ID Pedido"
      ></Column>
      <Column field="_count.order_items" header="Quant de itens"></Column>
      <Column field="totalProducts" header="Quant de produtos"></Column>
      <Column field="payment_status" body={(e) => <>{paymentStatus[e.payment_status]}</>} header="Status de pagamento"></Column>
      <Column field="status" body={(e) => <>{orderStatus[e.status]}</>} header="Status do pedido"></Column>
      <Column field="createdAt" body={(e) => <>{formatDateToBR(e.createdAt)}</>} header="Data do pedido"></Column>
      <Column
        body={(e: TransformationWorkshopOrder) => {
          return <>R${e.total_amount}</>;
        }}
        header="Total"
      ></Column>
    </DataTable>
  );
}