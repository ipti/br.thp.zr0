"use client";
import { useEffect, useState } from "react";
// import { CartItem } from "@/types/cart";
// import {
//   getCart,
//   removeFromCart,
//   saveCart,
// } from "@/utils/cartStorage";
import { Button } from "primereact/button";
import { Divider } from "primereact/divider";

const cart = [{
    id: "1",
    name: "Silver High Neck Sweater",
    price: 210,
    quantity: 1,
    image: "https://via.placeholder.com/120x120?text=Produto"
  }
  ]

export default function CartList() {
//   const [cart, setCart] = useState<CartItem[]>([]);

//   useEffect(() => {
//     setCart(getCart());
//   }, []);

//   const updateQuantity = (id: string, delta: number) => {
//     const updated = cart.map((item) =>
//       item.id === id
//         ? { ...item, quantity: Math.max(item.quantity + delta, 1) }
//         : item
//     );
//     saveCart(updated);
//     setCart(updated);
//   };

//   const handleRemove = (id: string) => {
//     removeFromCart(id);
//     setCart(getCart());
//   };

  const total = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Seu Carrinho</h2>

      {cart.length === 0 ? (
        <p>Seu carrinho está vazio.</p>
      ) : (
        <>
          <div className="flex flex-column gap-4">
            {cart.map((item) => (
              <div
                key={item.id}
                className="p-3 border-1 border-round-lg surface-card shadow-1"
              >
                <div className="flex flex-row align-items-center gap-4 flex-wrap md:flex-nowrap">
                  <div style={{ width: "100px", height: "100px", position: "relative" }}>
                    <img
                      src={item.image}
                      alt={item.name}
                      fill
                      className="border-round object-contain"
                    />
                  </div>

                  <div className="flex-1 min-w-min">
                    <div className="flex justify-content-between align-items-start flex-wrap">
                      <div>
                        <h3 className="m-0">{item.name}</h3>
                        <p className="text-sm m-0 text-600">
                          ${item.price.toFixed(2)} x {item.quantity}
                        </p>
                        <p className="text-sm text-pink-600 font-bold">
                          ${(item.price * item.quantity).toFixed(2)}
                        </p>
                      </div>

                      <Button
                        icon="pi pi-times"
                        className="p-button-text p-button-sm p-button-danger"
                        // onClick={() => handleRemove(item.id)}
                      />
                    </div>

                    <div className="flex align-items-center gap-2 mt-2">
                      <Button
                        icon="pi pi-minus"
                        className="p-button-outlined p-button-sm"
                        // onClick={() => updateQuantity(item.id, -1)}
                      />
                      <span>{item.quantity}</span>
                      <Button
                        icon="pi pi-plus"
                        className="p-button-outlined p-button-sm"
                        // onClick={() => updateQuantity(item.id, 1)}
                      />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <Divider />

          <div className="flex justify-content-end mt-4">
            <h3 className="text-xl font-bold">Total: ${total.toFixed(2)}</h3>
          </div>
        </>
      )}
    </div>
  );
}
