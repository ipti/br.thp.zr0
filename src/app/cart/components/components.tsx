"use client"
import ZSteps from "@/components/steps/steps";
import Cookies from 'js-cookie';
import { MenuItem } from "primereact/menuitem";
import { useEffect, useState } from "react";
import CartList from "./cart_list/cart_list";
import Identify from "./identify/identify";
import { useRouter, useSearchParams } from "next/navigation";
import Address from "./address/address";
import Finish from "./finish/finish";
import Delivery from "./delivery/delivery";
import Payment from "./payment/payment";


export default function CartComponent() {

    const history = useRouter()

    const token = Cookies.get('access_token');

    const searchParams = useSearchParams()
    const index = searchParams.get('index')

    const [activeIndex, setActiveIndex] = useState(0);

    const handleActiveIndex = (i: number) => {
        setActiveIndex(i)
    }

    useEffect(() => {
        handleActiveIndex(parseInt(index ?? "0"))
    }, [index])

    const itemRenderer = (item: any, itemIndex: number) => {
        const isActiveItem = activeIndex === itemIndex;
        const backgroundColor = isActiveItem ? 'var(--primary-color)' : 'var(--surface-b)';
        const textColor = isActiveItem ? 'var(--surface-b)' : 'var(--text-color-secondary)';

        return (
            <span
                className="inline-flex align-items-center justify-content-center align-items-center border-circle border-primary border-1 h-3rem w-3rem z-1 cursor-pointer"
                style={{ backgroundColor: backgroundColor, color: textColor, marginTop: '-10px' }}
                onClick={() => setActiveIndex(itemIndex)}
            >
                <i className={`${item.icon} text-xl`} />
            </span>
        );
    };

    const items: MenuItem[] | undefined = [
        {
            label: 'Carrinho',
        },
        // {
        //     label: 'Identificação',
        //     disabled: !!token
        // },
        {
            label: 'Endereço',
            disabled: true
        },
        {
            label: 'Entrega',
            disabled: true
        },
        {
            label: 'Pagamento',
            disabled: true,
        },
        {
            label: 'Confirmação',
            disabled: true
        }
    ];


    return (
        <div>
            <ZSteps model={items} activeIndex={activeIndex}  onSelect={(e) => { setActiveIndex(e.index); history.push('/cart?index=' + e.index) }} readOnly={false} />
            <div className="p-3" />
            {activeIndex === 0 && <CartList key={0} handleActiveIndex={handleActiveIndex} />}
            {/* {activeIndex === 1 && <Identify handleActiveIndex={handleActiveIndex} />} */}
            {activeIndex === 1 && <Address handleActiveIndex={handleActiveIndex} />}
            {activeIndex === 2 && <Delivery handleActiveIndex={handleActiveIndex} />}
            {activeIndex === 3 && <Payment handleActiveIndex={handleActiveIndex} />}
            {activeIndex === 4 && <Finish handleActiveIndex={handleActiveIndex} />}

            {/* <div className="flex flex-row gap-2">
                <ZButton label="Voltar" disabled={activeIndex === 0} onClick={() => { setActiveIndex(activeIndex - 1) }} text raised />
                <ZButton label="Continuar" disabled={activeIndex === 3} onClick={() => { setActiveIndex(activeIndex + 1) }} />
            </div> */}
        </div>
    )
}