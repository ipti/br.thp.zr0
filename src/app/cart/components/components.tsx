"use client"
import ZSteps from "@/components/steps/steps";
import { MenuItem } from "primereact/menuitem";
import { useState } from "react";
import CartList from "./cart_list/cart_list";
import { ZButton } from "@/components/button/button";
import Login from "@/app/auth/login/page";
import Cookies from 'js-cookie';
import Identify from "./identify/identify";


export default function CartComponent() {

  const token = Cookies.get('access_token');

    const [activeIndex, setActiveIndex] = useState(0);

    const handleActiveIndex = (i: number) => {
        setActiveIndex(i)
    }


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
        {
            label: 'Identificação',
        },
        {
            label: 'Endereço',
        },
        {
            label: 'Confirmação',
        }
    ];


    return (
        <div className="p-8">
            <ZSteps model={items} activeIndex={activeIndex} onSelect={(e) => setActiveIndex(e.index)} readOnly={false} />
            {activeIndex === 0 && <CartList />}
            {activeIndex === 1 && <Identify handleActiveIndex={handleActiveIndex} />}
            <div className="flex flex-row gap-2">
                <ZButton label="Voltar" disabled={activeIndex === 0} onClick={() => { setActiveIndex(activeIndex - 1) }} text raised />
                <ZButton label="Continuar" disabled={activeIndex === 3} onClick={() => { setActiveIndex(activeIndex + 1) }} />
            </div>
        </div>
    )
}