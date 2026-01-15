'use client'
import TitlePage from "@/components/title_page/title_page"
import { useFetchRequestOrderUser } from "../service/query"
import { OrderUser } from "../service/types"
import CardOrder from "./card_order/card_order"
import NotFoundOrder from "./not_found/not_found_order"

export default function OrderComponent() {

    const { data } = useFetchRequestOrderUser()

    const orderUser: OrderUser | undefined = data
    return (
        <>
            <TitlePage title="Seus pedidos" />
            {orderUser?.order?.length === 0 && <NotFoundOrder />}
            <div className="grid">
                {orderUser?.order?.map((item) => {
                    return <div className="col-12 sm:col-12 md:col-6 lg:col-4" key={item.id}> <CardOrder item={item} /></div>
                })}
            </div>
        </>
    )
}