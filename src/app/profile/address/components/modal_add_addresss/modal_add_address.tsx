"use client"
import { ControllerYourInformation } from "@/app/profile/your_information/service/controller";
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


export default function ModalAddressCustomer({visible, onHide}:{visible: boolean, onHide: any}) {

    const { data: userRequest, isLoading } = useFetchUserToken()

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
        <ZDialog visible={visible} onHide={onHide}>
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
            }} onSubmit={(values) => { 
                controllerAddressCustomer.CreateAddressCustomerAction({
                address: values.address,
                cep: values.cep,
                name: values.name,
                neighborhood: values.neighborhood,
                number: values.number,
                phone: values.phone,
                complement: values.complement,
                stateId: values.state,
                cityId: values.city,
                customerId: user?.customer.id ?? 1
            })
            
            }} validationSchema={schema}>
                {({ values, handleChange, errors, touched, setFieldValue }) => {
                    return (
                        <Form>
                            <div className="grid">
                                <div className="mb-4 col-12 md:col-6">
                                    <div className="flex flex-column">
                                        <label>Nome</label>
                                        <div className="p-2" />
                                        <ZInputText
                                            value={values.name}
                                            placeholder="Nome"
                                            onChange={handleChange}
                                            name="name"
                                        />
                                        {errors.name ? (
                                            <div style={{ color: "red", marginTop: "8px" }}>
                                                {errors.name}
                                            </div>
                                        ) : null}
                                    </div>
                                </div>
                                <div className="mb-4 col-12 md:col-6">
                                    <div className="flex flex-column">
                                        <label>Telefone</label>
                                        <div className="p-2" />
                                        <ZInputMask
                                            value={values.phone}
                                            mask="(99) 9 9999-9999"
                                            placeholder="Telefone para contato"
                                            onChange={handleChange}
                                            name="phone"
                                        />
                                        {errors.phone ? (
                                            <div style={{ color: "red", marginTop: "8px" }}>
                                                {errors.phone}
                                            </div>
                                        ) : null}
                                    </div>
                                </div>
                                <InputAddress errors={errors} handleChange={handleChange} setFieldValue={setFieldValue} touched={touched} values={values} />
                            </div>
                            <div className="flex flex-row justify-content-end mt-2">
                                <ZButton label="Adicionar" />
                            </div>
                        </Form>
                    )
                }}
            </Formik>
        </ZDialog>
    )
}