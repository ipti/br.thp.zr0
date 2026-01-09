import { ProductClientController } from "@/app/product/service/controller";
import { OrderItems, ShippingGetType, ValidOption } from "@/app/product/service/type";
import { Form, Formik } from "formik";
import { useState } from "react";
import { ZButton } from "../button/button";
import ZInputMask from "../input_mask/input_mask";
import ZSkeleton from "../skeleton/skeleton";
import ZCard from "../card/card";

export default function Shipping({ orderItems, disabled }: { orderItems: OrderItems[], disabled?: boolean }) {

    const [shipping, setShipping] = useState<ShippingGetType[] | undefined>();
    const [isLoadingCep, setLoading] = useState(false)
    const [shippingSelect, setShippingSelect] = useState<ValidOption | undefined>()
    const [cep, setCep] = useState<string | undefined>()


    const productClientController = ProductClientController({ setShipping, setShippingSelect });

    const handleShippingCalculate = (
        cep?: string,
    ) => {
        if (cep) {
            setLoading(true)
            productClientController.ShippingCalculateAction({
                destinationZipCode: cep.replace(/[^a-zA-Z0-9 ]/g, ""),
                orderItems: orderItems ?? []
            }, setLoading);
            setCep(cep)
        }
    };

    // useEffect(() => {
    //   if (cep) handleShippingCalculate(cep)
    // }, [cart, cartContext?.initialValue.product_selected])


    return (
        <div>
                <Formik
                    initialValues={{ cep: "", quantity: 1 }}
                    onSubmit={(values) => {
                        handleShippingCalculate(
                            values.cep
                        );
                    }}
                >
                    {({ values, handleChange }) => {
                        return (
                            <Form>
                                <div className="flex flex-column">
                                    <label>Calcular frete</label>
                                    <div className="p-1" />
                                    <div className="flex flex-row gap-2">
                                        <ZInputMask
                                            mask="99999-999"
                                            value={values.cep}
                                            name="cep"
                                            onChange={handleChange}
                                            placeholder="Digite o seu CEP"
                                            className="w-full"
                                            disabled={disabled}
                                        />
                                        <ZButton label="Ok" />
                                    </div>
                                </div>
                            </Form>
                        );
                    }}
                </Formik>
            {shipping && <div className="" style={{ borderRadius: "8px" }}>
                <div className="gap-3">
                    {isLoadingCep ? <div className="flex flex-column gap-2"><ZSkeleton /><ZSkeleton /><ZSkeleton /></div> : <div>
                                        <div className="p-1" />

                <h1>Frete</h1>
                <div className="p-1" />
                        {shipping.map((shippingItem, index) => {
                            return (<div key={index}>
                                <h3>{shippingItem.productName} - {shippingItem.workshopName} (Qtd - {shippingItem.quantity})</h3>
                                {shippingItem?.result?.validOptions?.map((item, index) => {
                                    return (
                                        <ZCard key={index} className="my-2 p-1">
                                            {<div className="flex flex-row justify-content-between m-1">
                                                <div className="flex flex-row align-items-center">
                                                    <h5>{item.carrier}</h5>
                                                </div>
                                                <div>
                                                    <h5>R${item.cost.toFixed(2)}</h5>
                                                    <p>{item.deliveryTime} Dias úteis</p>
                                                </div>
                                            </div>}
                                        </ZCard>
                                    )
                                })}
                            </div>)
                        })}

                    </div>}
                </div></div>}
            <div className="p-2" />
        </div>
    )
}