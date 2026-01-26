import ZCard from "@/components/card/card";
import { Address } from "../../service/type";
import "./card_address.css"
import { ControllerAddressCustomer } from "../../service/controller";
import { ConfirmDialog } from "primereact/confirmdialog";
import ZConfirmDialog from "@/components/confirm_dialog/confirm_dialog";
import { useState } from "react";

export default function CardAddress({ item }: { item: Address }) {
    const [visibleDelete, setVisibleDelete] =  useState(false);
     const [visible, setVisible] =  useState(false);

    const controller = ControllerAddressCustomer()

    return (
        <ZCard className="card_address">
            <div className="flex flex-row justify-content-between">
                <h4>
                    {item.address}, {item.number}
                </h4>
                <h3 >{item.is_default ? '(PADRÃO)' : ''}</h3>
            </div>
            <div className="p-1" />
            <p>
                {item.cep} - {item.city?.name} - {item.state?.acronym}
            </p>
            <div className="p-1" />
            <p>
                {item.name} - {item.phone}
                { }            </p>
                <div className="p-1" />
            <div className="flex flex-row justify-content-end gap-2">
                {/* <h5 className="text-button">EDITAR</h5> */}
                <h5 className="text-button" onClick={() => setVisibleDelete(!visibleDelete)}>EXCLUIR</h5>
                {!item.is_default && <h5 className="text-button-default" onClick={() => setVisible(!visible)}>TORNAR PADRÃO</h5>}
            </div>
            <ZConfirmDialog  group="declarative"
                visible={visibleDelete}
                onHide={() => setVisibleDelete(false)}
                message="Os dados serão apagados permanentemente"
                header="Deseja realmente excluir este endereço?"
                icon="pi pi-exclamation-triangle"
                acceptLabel="Excluir"
                rejectLabel="Cancelar"
                accept={() => controller.DeleteAddressCustomerAction(item.id, item.customer_fk)}
                reject={() => setVisibleDelete(false)}
                />
                 <ZConfirmDialog  group="declarative"
                visible={visible}
                onHide={() => setVisible(false)}
                message="Este endereço será usado como principal para suas próximas compras."
                header="Definir como endereço padrão?"
                icon="pi pi-exclamation-triangle"
                acceptLabel="Confirmar"
                rejectLabel="Cancelar"
                accept={() => controller.UpdateDefaultAddressCustomerAction({addressId: item.id, customerId: item.customer_fk})}
                reject={() => setVisible(false)}
                />
        </ZCard>
    )
}