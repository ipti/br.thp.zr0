import { ZButton } from "@/components/button/button";
import ZSliderBarDialog from "@/components/sidebar/sidebar";
import { useCartStore } from "@/service/store/cart_store";
import { useRouter } from "next/navigation";
import { Image } from "primereact/image";

export default function CartDialog({
  onHide,
  visible,
}: {
  visible: boolean;
  onHide: any;
}) {
  const history = useRouter()
  const cart = useCartStore((state) => state.cart);
  const removeItem = useCartStore((state) => state.removeItem);
  // const clear = useCartStore((state) => state.clear);

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const customHeader = (
    <div className="flex align-items-center gap-2">
      <i className="pi pi-shopping-bag" />
      <span className="font-bold">{cart.length} item</span>
    </div>
  );

  return (
    <ZSliderBarDialog
      position="right"
      visible={visible}
      onHide={onHide}
      header={customHeader}
    >
      <div className="h-full flex flex-column justify-content-between">
        <div className="overflow-auto">
        <div className="p-4" />
        <div className="gap-4">

          {cart.map((item) => {
            return (
              <div key={item.id} className="w-full mb-5">
                <div className="flex gap-4 items-center">
                  <Image
                    src={item.image}
                    alt={item.name}
                    width={64}
                    height={64}
                    className="rounded"
                  />
                  <div className="flex flex-row justify-content-between flex-1">
                    <div>
                      <h3 className="text-lg font-semibold">{item.name}</h3>

                      <p className="text-sm font-bold">
                        R$ {(item.price * item.quantity).toFixed(2)} X{" "}
                        {item.quantity}
                      </p>
                    </div>
                    <div className="mt-2">
                      <ZButton
                        icon="pi pi-times"
                        className="p-button-danger p-button-sm"
                        text
                        rounded
                        onClick={() => removeItem(item.id)}
                      />
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
                  </div>

        </div>
        <div className="flex flex-column justify-content-end mt-3 gap-2">
          <ZButton label={"Finalizar compra" + ` (R$ ${total.toFixed(2)})`} />
          <ZButton label="Ver carrinho" text onClick={() => {history.push('/cart'); onHide()}} />
        </div>
      </div>
    </ZSliderBarDialog>
  );
}
