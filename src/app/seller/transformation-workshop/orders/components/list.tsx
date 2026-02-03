"use client"
import { getIdTw } from "@/service/cookies";
import { orderStatus } from "@/utils/enum/order_status";
import { paymentStatus } from "@/utils/enum/payment_status";
import { formatDateToBR } from "@/utils/hook/format_data";
import { useRouter, useSearchParams } from "next/navigation";
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { TransformationWorkshopOrder } from "../../one/service/type";
import { ProductTransfWorkshopController } from "../../product/service/controller";
import { useFetchRequestOrderTransformationWorkshop } from "../service/query";
import { OrderPagination } from "../service/types";
import { useState } from "react";

export default function ListPage() {
  const searchParams = useSearchParams();

  const idOt = searchParams.get("idOt");
  const productTransfWorkshopController = ProductTransfWorkshopController();
  const [page, setPage] = useState(1)
  const [limit, setLimite] = useState(10)

    const history = useRouter()
  

  const { data } = useFetchRequestOrderTransformationWorkshop(idOt ?? getIdTw(), page.toString(), limit.toString())

  var order: OrderPagination | undefined = data

     const header = (
        <div className="flex flex-wrap align-items-center justify-content-between gap-2">
          <span className="text-xl text-900 font-bold">Pedidos</span>
        </div>
      );

  const onRowEditComplete = (e: any) => {
    const rowData = e.newData
    productTransfWorkshopController.UpdateProductTransfWorkshopAction(rowData.id, { quantity: rowData.quantity })
  };

  const onPageChange = (e: any) => {
    setPage(e.page + 1);
    setLimite(e.rows);
  };

  return (
    <>
    <DataTable 
    lazy
      editMode="row" 
      paginator 
      paginatorPosition="bottom" 
      paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown CurrentPageReport"
      currentPageReportTemplate="Mostrando {first} até {last} de {totalRecords} pedidos"
      header={header}  
      rows={limit} 
      first={(page - 1) * limit}
      totalRecords={order?.pagination.total}
      onPage={onPageChange}
      rowsPerPageOptions={[5, 10, 25, 50]} 
      dataKey="id" 
      onRowEditComplete={onRowEditComplete} 
      value={order?.data} 
      onSelectionChange={(e) => history.push("/seller/transformation-workshop/orders/one?idOrder="+e.value.order_fk)} 
      selectionMode="single"
    >
      <Column
        body={(e) => {
          return <>{e.order.uid}</>;
        }}
        header="ID Pedido"
      ></Column>
      <Column field="_count.order_item" header="Quant de itens"></Column>
      <Column field="totalProducts" header="Quant de produtos"></Column>
      <Column field="order.payment_status" body={(e) => <>{paymentStatus[e.order.payment_status]}</>} header="Status de pagamento"></Column>
      <Column field="status" body={(e) => <>{orderStatus[e.status]}</>} header="Status do pedido"></Column>
      <Column field="createdAt" body={(e) => <>{formatDateToBR(e.createdAt)}</>} header="Data do pedido"></Column>
      <Column
        body={(e: TransformationWorkshopOrder) => {
          return <>R${e.total_amount}</>;
        }}
        header="Total"
      ></Column>
    </DataTable>
      </>
  );
}