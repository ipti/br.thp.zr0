"use client"
import { orderStatus } from "@/utils/enum/order_status";
import { paymentStatus } from "@/utils/enum/payment_status";
import { formatDateToBR } from "@/utils/hook/format_data";
import { useRouter, useSearchParams } from "next/navigation";
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";

import { useState } from "react";
import { useFetchrequestOrderSolitedCancellation } from "../service/query";
import { Order, OrderSolitedCancellation } from "../service/types";

export default function ListPage() {
  const searchParams = useSearchParams();

  const idOt = searchParams.get("idOt");
  const [page, setPage] = useState(1)
  const [limit, setLimite] = useState(10)

  const history = useRouter()


  const { data } = useFetchrequestOrderSolitedCancellation(page.toString(), limit.toString())

  var order: OrderSolitedCancellation | undefined = data

  const header = (
    <div className="flex flex-wrap align-items-center justify-content-between gap-2">
      <span className="text-xl text-900 font-bold">Pedidos Cancelados</span>
    </div>
  );


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
        value={order?.data}
        onSelectionChange={(e) => history.push("/seller/canceled-orders/one?idOrder=" + e.value.id)}
        selectionMode="single"
      >
        <Column
          body={(e: Order) => {
            return <>{e.uid}</>;
          }}
          header="ID Pedido"
        ></Column>
        <Column field="order.payment_status" body={(e: Order) => <>{paymentStatus[e.payment_status]}</>} header="Status de pagamento"></Column>
        <Column field="status" body={(e: Order) => <>{orderStatus[e.order_services[0].status]}</>} header="Status do pedido"></Column>
        <Column field="createdAt" body={(e) => <>{formatDateToBR(e.createdAt)}</>} header="Data do pedido"></Column>
        <Column
          body={(e: Order) => {
            return <>R${e.total_amount}</>;
          }}
          header="Total"
        ></Column>
      </DataTable>
    </>
  );
}