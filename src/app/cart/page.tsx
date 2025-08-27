import CartComponent from "./components/components";
import CartProvider from "./context/context";

export default function CartPage() {
    return (
        <div>
            <CartProvider>

                <CartComponent />
            </CartProvider>
        </div>
    )
}