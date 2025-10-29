'use client'
import NotFoundAddress from "../../address/components/not_found/not_found_address"
import { useFetchRequestOrderUser } from "../service/query"
import { OrderUser } from "../service/types"
import CardOrder from "./card_order/card_order"

export default function OrderComponent() {

    const { data } = useFetchRequestOrderUser()

    const orderUser: OrderUser | undefined = data
    return(
        <> 
            {orderUser?.order?.length === 0 && <NotFoundAddress />}
            <div className="grid">

            {orderUser?.order?.map((item) => {
                return<div className="col-12 sm:col-12 md:col-6 lg:col-4" key={item.id}> <CardOrder item={item}/></div>
            })}
            </div>
        </>
    )
}