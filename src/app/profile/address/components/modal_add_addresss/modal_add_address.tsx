"use client"
import { ZButton } from "@/components/button/button";
import ZDialog from "@/components/dialog/dialog";
import ZInputText from "@/components/input/input";
import ZInputMask from "@/components/input_mask/input_mask";
import InputAddress from "@/components/inputs_address/inputs_address";
import { Form, Formik } from "formik";
import * as Yup from "yup";
import { ControllerAddressCustomer } from "../../service/controller";
import { useFetchUserToken } from "@/service/global_request/query";
import { UserGlobal } from "@/service/global_request/type";
import { useState } from "react";


export default function ModalAddressCustomer({ visible, onHide }: { visible: boolean, onHide: () => void }) {
    const [submitError, setSubmitError] = useState<string | null>(null)

    const { data: userRequest } = useFetchUserToken()

    const user: UserGlobal | undefined = userRequest


    const controllerAddressCustomer = ControllerAddressCustomer()

    const schema = Yup.object().shape({
        name: Yup.string()
            .required("Campo Obrigatório")
            .min(4, "Nome deve ter pelo menos 4 caracteres"),
        phone: Yup.string()
            .required("Campo Obrigatório"),
        cep: Yup.string()
            .required("Campo Obrigatório"),
        address: Yup.string()
            .required("Campo Obrigatório"),
        number: Yup.string()
            .required("Campo Obrigatório"),
        complement: Yup.string(),
        neighborhood: Yup.string()
            .required("Campo Obrigatório"),
        city: Yup.number()
            .required("Campo Obrigatório"),
        state: Yup.number()
            .required("Campo Obrigatório"),
    });


    return (
        <ZDialog visible={visible} onHide={onHide} header={"Adicionar endereço de entrega"} className="w-10 md:w-6">
            <Formik initialValues={{
                name: "",
                phone: "",
                cep: "",
                address: "",
                number: "",
                complement: "",
                neighborhood: "",
                city: undefined,
                state: undefined,
            }} onSubmit={async (values, { setSubmitting }) => {
                setSubmitError(null)
                try {
                    await controllerAddressCustomer.CreateAddressCustomerAction({
                        address: values.address,
                        cep: values.cep.replace(/\D/g, ""),
                        name: values.name,
                        neighborhood: values.neighborhood,
                        number: values.number,
                        phone: values.phone,
                        complement: values.complement,
                        stateId: values.state,
                        cityId: values.city,
                        customerId: user?.customer.id ?? 0
                    })
                    onHide()
                } catch {
                    setSubmitError('Não foi possível adicionar o endereço. Revise os dados e tente novamente.')
                } finally {
                    setSubmitting(false)
                }
            }} validationSchema={schema}>
                {({ values, handleChange, errors, touched, setFieldValue, isSubmitting }) => {
                    return (
                        <Form>
                            <div className="grid">
                                <div className="mb-4 col-12 md:col-6">
                                    <div className="flex flex-column">
                                        <label htmlFor="new-address-name">Nome</label>
                                        <div className="p-2" />
                                        <ZInputText
                                            value={values.name}
                                            id="new-address-name"
                                            placeholder="Nome"
                                            onChange={handleChange}
                                            name="name"
                                            aria-describedby={errors.name ? 'new-address-name-error' : undefined}
                                            invalid={Boolean(errors.name)}
                                        />
                                        {errors.name ? (
                                            <div id="new-address-name-error" role="alert" style={{ color: "#8b1a1a", marginTop: "8px" }}>
                                                {errors.name}
                                            </div>
                                        ) : null}
                                    </div>
                                </div>
                                <div className="mb-4 col-12 md:col-6">
                                    <div className="flex flex-column">
                                        <label htmlFor="new-address-phone">Telefone</label>
                                        <div className="p-2" />
                                        <ZInputMask
                                            value={values.phone}
                                            id="new-address-phone"
                                            mask="(99) 9 9999-9999"
                                            placeholder="Telefone para contato"
                                            onChange={handleChange}
                                            name="phone"
                                            aria-describedby={errors.phone ? 'new-address-phone-error' : undefined}
                                            invalid={Boolean(errors.phone)}
                                        />
                                        {errors.phone ? (
                                            <div id="new-address-phone-error" role="alert" style={{ color: "#8b1a1a", marginTop: "8px" }}>
                                                {errors.phone}
                                            </div>
                                        ) : null}
                                    </div>
                                </div>
                                <InputAddress errors={errors} handleChange={handleChange} setFieldValue={setFieldValue} touched={touched} values={values} />
                            </div>
                            {submitError ? <div className="checkout-inline-error" role="alert">{submitError}</div> : null}
                            <div className="flex flex-row justify-content-end mt-2">
                                <ZButton type="submit" label="Adicionar" loading={isSubmitting} disabled={isSubmitting || !user?.customer?.id} />
                            </div>
                        </Form>
                    )
                }}
            </Formik>
        </ZDialog>
    )
}
