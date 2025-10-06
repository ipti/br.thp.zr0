"use client"
import { ZButton } from "@/components/button/button";
import { useState } from "react";
import ModalAddressCustomer from "./modal_add_addresss/modal_add_address";
import { useFetchRequestGetAddressCustomer } from "../service/query";
import { AddressList } from "../service/type";
import CardAddress from "./card_address/card_address";
import NotFoundAddress from "./not_found/not_found_address";

export default function AddressComponent() {
    const [visibleAddAddress, setVisibleAddAddress] = useState(false)

    const { data } = useFetchRequestGetAddressCustomer()

    var addressList: AddressList | undefined = data

    return (
        <div>
            <div className="m-4 flex flex-row justify-content-end">
                <ZButton label="Adicionar endereço" onClick={() => setVisibleAddAddress(!visibleAddAddress)} />
            </div>
            <div className="grid">
                {addressList?.customer?.address_customer.length === 0 && <NotFoundAddress />}
                {addressList?.customer?.address_customer.map((item, key) => {
                    return <div className="col-12 md:col-4" key={key} ><CardAddress item={item} /></div>
                })}
            </div>
            <ModalAddressCustomer onHide={() => setVisibleAddAddress(!visibleAddAddress)} visible={visibleAddAddress} />
        </div>
    )
}