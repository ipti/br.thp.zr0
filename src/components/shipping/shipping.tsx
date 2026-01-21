import { ProductClientController } from "@/app/product/service/controller";
import { OrderItems, ShippingGetType, ValidOption } from "@/app/product/service/type";
import { Form, Formik } from "formik";
import { useEffect, useState } from "react";
import { ZButton } from "../button/button";
import ZInputMask from "../input_mask/input_mask";
import ZSkeleton from "../skeleton/skeleton";
import ZCard from "../card/card";
import { useFetchRequestGetAddressCustomer } from "@/app/profile/address/service/query";
import { AddressList } from "@/app/profile/address/service/type";
import './shipping.css'

export default function Shipping({ orderItems, disabled }: { orderItems: OrderItems[], disabled?: boolean }) {

    const [shipping, setShipping] = useState<ShippingGetType[] | undefined>();
    const [isLoadingCep, setLoading] = useState(false)
    const [selectetInput, setSelectedInput] = useState<boolean | undefined>(false)
    const [shippingSelect, setShippingSelect] = useState<ValidOption | undefined>()
    const [cep, setCep] = useState<string | undefined>()

    const { data: addressCustomerRequest } = useFetchRequestGetAddressCustomer()

    var addressList: AddressList | undefined = addressCustomerRequest


    const productClientController = ProductClientController({ setShipping, setShippingSelect });

    const addressSelect = addressList?.customer.address_customer.find(item => item.is_default)

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

    useEffect(() => {
        if (addressSelect) handleShippingCalculate(addressSelect.cep)
    }, [addressList])

    const skletonArray = [1, 2, 3]

    return (
        <div>
            {addressSelect && !selectetInput ? <>
                <h4>{addressSelect.address} - {addressSelect.city.name}/{addressSelect.state.acronym}</h4>
                <div className="flex flex-row gap-2">

                    <h4>CEP: {addressSelect?.cep}
                    </h4>
                    <div className="flex flex-column justify-content-center cursor-pointer">
                        <p className="verify-cep" onClick={() => setSelectedInput(true)}>Verificar outro CEP</p>
                    </div>
                </div>
            </>
                : <Formik
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
                </Formik>}
            {isLoadingCep ? <div className="flex flex-column gap-2 mt-1"> {skletonArray.map((item) => <ZSkeleton height="48px"/>)}</div>
                : <>
                    {shipping && <div className="" style={{ borderRadius: "8px" }}>
                        <div className="gap-3">

                            <div>
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
                                                            <h5>{item.carrier} ({item.service})</h5>
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

                            </div>
                        </div></div>}
                </>
            }
            <div className="p-2" />
        </div>
    )
}