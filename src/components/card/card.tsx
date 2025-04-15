import React from "react";
import "./card.css"

export default function CardComponent({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="card">
            {children}
        </div>
    )
}