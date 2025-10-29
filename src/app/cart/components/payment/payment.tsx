import { ZButton } from "@/components/button/button";
import ZCard from "@/components/card/card";
import CheckoutComponent from "@/components/payment/payment";

export default function Payment({
  handleActiveIndex,
}: {
  handleActiveIndex: (i: number) => void;
}) {
  return (
    <div>
      {/* <ZCard className="p-4">
        <CheckoutComponent />
      </ZCard> */}
      <div className="mt-4 flex flex-row justify-content-end gap-1">
        <ZButton
          label="Voltar"
          security="secondary"
          onClick={() => {
            handleActiveIndex(2);
          }}
        />
        <ZButton
          label="Continuar"
          onClick={() => {
            handleActiveIndex(4);
          }}
        />
      </div>
    </div>
  );
}
