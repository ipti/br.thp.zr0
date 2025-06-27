"use client"
import ZSteps from "@/components/steps/steps";
import { MenuItem } from "primereact/menuitem";
import { useState } from "react";
import CartList from "./cart_list/cart_list";

export default function CartComponent(){

    const [activeIndex, setActiveIndex] = useState(0);
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
    const items:  MenuItem[] | undefined = [
        {
            icon: 'pi pi-shopping-cart',
            template: (item) => itemRenderer(item, 0)
        },
        {
            label: 'Seat',
           
        },
        {
            label: 'Payment',
           
        },
        {
            label: 'Confirmation',
        }
    ];

    console.log(activeIndex)
    return(
        <div className="p-8">
            <ZSteps  model={items} activeIndex={activeIndex} onSelect={(e) => setActiveIndex(e.index)} readOnly={false}  />
            {activeIndex === 0 && <CartList />}
        </div>
    )
}