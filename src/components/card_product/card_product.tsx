'use client'

import { Product, ProductImage } from "@/app/seller/product/type";
import { Card } from "primereact/card";
import { ZButton } from "../button/button";
import ZGalleria from "../galleria/galleria";

export default function CardProduct({ item }: { item: Product }) {
    const itemTemplate = (image: ProductImage) => {
        return (
            <img
                src={image.img_url}
                alt={item.name}
                style={{ width: 256, height: 256, display: "block" }}
            />
        );
    };

    return (
        <Card>
            <ZGalleria
                value={item.product_image}
                style={{ maxWidth: "100%" }}
                showThumbnails={false}
                showIndicators
                item={itemTemplate}
            />
            <div className="p-2" />
            <h3>{item.name}</h3>
            <div className="p-2" />
            <p>
                {item.description.substring(0, 64)}
                {item.description.length > 64 ? "..." : null}
            </p>
            <div className="p-2" />
            <div className="flex flex-row justify-content-between">
                <div className="flex flex-column justify-content-center">
                    <h2 style={{ color: "darkcyan" }}>R$ {item.price}</h2>
                </div>
                <ZButton
                    label="Comprar"
                    icon="pi pi-cart-plus"
                //   onClick={() => props.addProductCart(item)}
                />
            </div>
        </Card>
    )
}