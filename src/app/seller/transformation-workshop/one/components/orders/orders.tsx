import { ZButton } from "@/components/button/button";
import { getIdTw } from "@/service/cookies";
import { useRouter, useSearchParams } from "next/navigation";
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { TransformationWorkshopOrder } from "../../service/type";
import { paymentStatus } from "@/utils/enum/payment_status";
import { formatDateToBR } from "@/utils/hook/format_data";
import { orderStatus } from "@/utils/enum/order_status";

export default function OrdersTransformationWorkshop({
  order,
}: {
  order: TransformationWorkshopOrder[] | undefined;
}) {
  const searchParams = useSearchParams();

  const idOt = searchParams.get("idOt");
  const history = useRouter();

  const header = (
    <div className="flex flex-wrap align-items-center justify-content-between gap-2">
      <span className="text-xl text-900 font-bold">Pedidos</span>
      <ZButton
        text
        onClick={() => {
          history.push(
            "/seller/transformation-workshop/orders?idOt=" + (idOt ?? getIdTw())
          );
        }}
        label="Ver mais"
      />
    </div>
  );
  return (
    <DataTable value={order} header={header}>
      <Column
        body={(e: TransformationWorkshopOrder) => {
          return <>{e.uid.substring(0, 12)}...</>;
        }}
        header="ID Pedido"
      ></Column>
      <Column field="_count.order_items" header="Quant de itens"></Column>
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
