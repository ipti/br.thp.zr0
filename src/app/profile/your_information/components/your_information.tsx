"use client"
import { ZButton } from "@/components/button/button";
import ZCalendar from "@/components/calendar/calendar";
import ZDivider from "@/components/divider/divider";
import ZInputText from "@/components/input/input";
import ZInputMask from "@/components/input_mask/input_mask";
import InputAddress from "@/components/inputs_address/inputs_address";
import ZRadioButton from "@/components/radio_button/radio_button";
import TitlePage from "@/components/title_page/title_page";
import { useFetchUserToken } from "@/service/global_request/query";
import { UserGlobal } from "@/service/global_request/type";
import { Form, Formik } from "formik";
import { useState } from "react";
import * as Yup from "yup";
import { ControllerYourInformation } from "../service/controller";
import "./your_information.css";


export default function YourInformationComponents() {

    const [cpfOrCnpj, setCpfOrCnpj] = useState(1)

    const controllerYourInformation = ControllerYourInformation()

    const { data: userRequest, isLoading } = useFetchUserToken()

    const user: UserGlobal | undefined = userRequest

   

 const schema = (cpfOrCnpj: number) =>
  Yup.object().shape({
    email: Yup.string()
      .email("E-mail inválido")
      .required("E-mail é obrigatório"),

    name: Yup.string().required("Nome é obrigatório"),

    phone: Yup.string().required("Telefone é obrigatório"),

    birthday: Yup.date().required("Data de nascimento é obrigatória"),

    cpf:
      cpfOrCnpj === 1
        ? Yup.string().required("CPF é obrigatório")
        : Yup.string().notRequired(),

    cnpj:
      cpfOrCnpj === 2
        ? Yup.string().required("CNPJ é obrigatório")
        : Yup.string().notRequired(),

    trade_name:
      cpfOrCnpj === 2
        ? Yup.string().required("Nome fantasia é obrigatório")
        : Yup.string().notRequired(),

    corporate_name:
      cpfOrCnpj === 2
        ? Yup.string().required("Razão social é obrigatória")
        : Yup.string().notRequired(),

    cep: Yup.string().required("CEP é obrigatório"),
    address: Yup.string().required("Endereço é obrigatório"),
    number: Yup.string().required("Número é obrigatório"),
    complement: Yup.string(),
    neighborhood: Yup.string().required("Bairro é obrigatório"),
    city: Yup.number()
      .typeError("Cidade é obrigatória")
      .required("Cidade é obrigatória"),
    state: Yup.number()
      .typeError("Estado é obrigatório")
      .required("Estado é obrigatório"),
  });


    const footer = (
        <>
            <ZDivider />
            <p className="mt-2">Sugestões {"\n"}</p>
            <ul className="pl-2 ml-2 mt-0 line-height-3">
                <li>Pelo menos uma letra minúscula</li>
                <li>Pelo menos uma letra maiúscula</li>
                <li>Pelo menos um número</li>
                <li>No mínimo 8 caracteres</li>
            </ul>
        </>
    );

    if (isLoading) return null

    return (
        <div
           
        >
            <TitlePage title="Atualize seus dados" />
                <Formik
                    initialValues={{
                        email: user?.email ?? "",
                        name: user?.name ?? "",
                        phone: user?.customer.phone ?? "",
                        birthday: user?.customer.birthday ? new Date(user?.customer.birthday) : new Date(Date.now() - 567648000000),
                        cpf: user?.customer.cpf ?? "",
                        cnpj: user?.customer.cnpj ?? "",
                        trade_name: user?.customer.trade_name ?? "",
                        corporate_name: user?.customer.corporate_name ?? "",
                        cep: user?.customer?.billing_address?.cep ?? "",
                        address: user?.customer?.billing_address?.address ?? "",
                        number: user?.customer?.billing_address?.number ?? "",
                        complement: user?.customer?.billing_address?.complement ?? "",
                        neighborhood: user?.customer?.billing_address?.neighborhood ?? "",
                        city: user?.customer?.billing_address?.city_fk ?? undefined,
                        state: user?.customer?.billing_address?.state_fk ?? undefined,
                    }}
                    validationSchema={schema(cpfOrCnpj)}
                    onSubmit={(values) => {
                        controllerYourInformation.UpdateCustomer({ id: user?.customer.id ?? 1, body: { phone: values.phone.replace(/[^a-zA-Z0-9 ]/g, ""), birthday: values.birthday, cpf: values.cpf?.replace(/[^a-zA-Z0-9 ]/g, ""), corporate_name: values.corporate_name, cnpj: values.cnpj?.replace(/[^a-zA-Z0-9 ]/g, ""), trade_name: values.trade_name } });
                        controllerYourInformation.UpdateUser({ id: user?.id ?? 1, body: { email: values.email, name: values.name } })
                        if (user?.customer?.billing_address?.id) {
                            controllerYourInformation.UpdateAddressBilling({ body: { address: values.address, cep: values.cep, cityId: values.city, complement: values.complement, customerId: user?.customer?.id ?? 1, neighborhood: values.neighborhood, number: values.number, stateId: values.state }, id: user.customer.billing_address.id })
                        } else {
                            controllerYourInformation.CreateAddressBilling({ body: { address: values.address, cep: values.cep, cityId: values.city, complement: values.complement, customerId: user?.customer?.id ?? 1, neighborhood: values.neighborhood, number: values.number, stateId: values.state } })
                        }
                    }}
                >
                    {({ values, handleChange, errors, touched, setFieldValue }) => {
                        return (
                            <Form>
                                <div className="p-2" />
                                <div className="grid">
                                    <div className="col-12 md:col-6 mb-4">
                                        <div className="flex flex-column ">
                                            <label className="mb-2">Nome</label>
                                            <ZInputText
                                                name="name"
                                                value={values.name}
                                                onChange={handleChange}
                                                placeholder="Digite o seu nome"
                                                invalid={!!(errors.name && touched.name)}
                                            ></ZInputText>
                                            {errors.name && touched.name ? (
                                                <>
                                                    <div className="p-1" />
                                                    <div style={{ color: "red" }}>{errors.name}</div>
                                                </>
                                            ) : null}
                                        </div>
                                    </div>
                                    <div className="col-12 md:col-6 mb-4">
                                        <div className="flex flex-column ">
                                            <label className="mb-2">E-mail</label>
                                            <ZInputText
                                                name="email"
                                                value={values.email}
                                                onChange={handleChange}
                                                placeholder="Digite o seu nome"
                                                invalid={!!(errors.email && touched.email)}
                                                disabled
                                            ></ZInputText>
                                            {errors.email && touched.email ? (
                                                <>
                                                    <div className="p-1" />
                                                    <div style={{ color: "red" }}>{errors.email}</div>
                                                </>
                                            ) : null}
                                        </div>
                                    </div>
                                    <div className="col-12 md:col-6 mb-4">
                                        <div className="flex flex-column ">
                                            <label className="mb-2">Telefone</label>
                                            <ZInputMask
                                                name="phone"
                                                value={values.phone}
                                                onChange={handleChange}
                                                placeholder="Digite seu telefone"
                                                invalid={!!(errors.phone && touched.phone)}
                                                mask="(99) 9 9999-9999"
                                            ></ZInputMask>
                                            {errors.phone && touched.phone ? (
                                                <>
                                                    <div className="p-1" />
                                                    <div style={{ color: "red" }}>{errors.phone.toString()}</div>
                                                </>
                                            ) : null}
                                        </div>
                                    </div>
                                    <div className="col-12 md:col-6 mb-4">
                                        <div className="flex flex-column ">
                                            <label className="mb-2">Data de nascimento</label>
                                            <ZCalendar
                                                name="birthday"
                                                value={new Date(values.birthday)}
                                                onChange={handleChange}
                                                placeholder="Digite sua data de nascimento"
                                                dateFormat="dd/mm/yy"
                                                invalid={!!(errors.birthday && touched.birthday)}
                                            ></ZCalendar>
                                            {errors.birthday && touched.birthday ? (
                                                <>
                                                    <div className="p-1" />
                                                    <div style={{ color: "red" }}>{errors.birthday}</div>
                                                </>
                                            ) : null}
                                        </div>
                                    </div>
                                    <div className="col-12 flex flex-row gap-3">

                                        <div className="gap-2">
                                            <ZRadioButton value={1} className="mr-2" checked={cpfOrCnpj === 1} onChange={() => { setCpfOrCnpj(1) }} />
                                            <label>CPF</label>
                                        </div>
                                        <div className="gap-2">
                                            <ZRadioButton value={2} className="mr-2" checked={cpfOrCnpj === 2} onChange={() => { setCpfOrCnpj(2) }} />
                                            <label >CNPJ</label>
                                        </div>
                                    </div>
                                    {cpfOrCnpj === 1 ? <>
                                        <div className="col-12 md:col-6 mb-4">
                                            <div className="flex flex-column ">
                                                <label className="mb-2">CPF</label>
                                                <ZInputMask
                                                    name="cpf"
                                                    value={values.cpf}
                                                    onChange={handleChange}
                                                    placeholder="Digite seu CPF"
                                                    mask="999.999.999-99"
                                                    invalid={!!(errors.cpf && touched.cpf)}
                                                ></ZInputMask>
                                                {errors.cpf && touched.cpf ? (
                                                    <>
                                                        <div className="p-1" />
                                                        <div style={{ color: "red" }}>{errors.cpf.toString()}</div>
                                                    </>
                                                ) : null}
                                            </div>
                                        </div>


                                    </> : <>
                                        <div className="col-12 md:col-6 mb-4">
                                            <div className="flex flex-column ">
                                                <label className="mb-2">CNPJ</label>
                                                <ZInputMask
                                                    name="cnpj"
                                                    value={values.cnpj}
                                                    onChange={handleChange}
                                                    placeholder="Digite seu cnpj"
                                                    invalid={!!(errors.cnpj && touched.cnpj)}
                                                    mask="99.999.999/9999-99"
                                                ></ZInputMask>
                                                {errors.cnpj && touched.cnpj ? (
                                                    <>
                                                        <div className="p-1" />
                                                        <div style={{ color: "red" }}>{errors.cnpj.toString()}</div>
                                                    </>
                                                ) : null}
                                            </div>
                                        </div>
                                        <div className="col-12 md:col-6 mb-4">
                                            <div className="flex flex-column ">
                                                <label className="mb-2">Razão Social</label>
                                                <ZInputText
                                                    name="corporate_name"
                                                    value={values.corporate_name}
                                                    onChange={handleChange}
                                                    placeholder="Digite sua Razão Social"
                                                    invalid={!!(errors.corporate_name && touched.corporate_name)}
                                                ></ZInputText>
                                                {errors.corporate_name && touched.corporate_name ? (
                                                    <>
                                                        <div className="p-1" />
                                                        <div style={{ color: "red" }}>{errors.corporate_name.toString()}</div>
                                                    </>
                                                ) : null}
                                            </div>
                                        </div>
                                        <div className="col-12 md:col-6 mb-4">
                                            <div className="flex flex-column ">
                                                <label className="mb-2">Nome fantasia</label>
                                                <ZInputText
                                                    name="trade_name"
                                                    value={values.trade_name}
                                                    onChange={handleChange}
                                                    placeholder="Digite seu Nome fantasia"
                                                    invalid={!!(errors.trade_name && touched.trade_name)}
                                                ></ZInputText>
                                                {errors.trade_name && touched.trade_name ? (
                                                    <>
                                                        <div className="p-1" />
                                                        <div style={{ color: "red" }}>{errors.trade_name.toString()}</div>
                                                    </>
                                                ) : null}
                                            </div>
                                        </div>
                                    </>}

                                </div>
                                <h3>Endereço de cobrança</h3>
                                <div className="p-2" />
                                <div className="grid">
                                    <InputAddress errors={errors} handleChange={handleChange} setFieldValue={setFieldValue} touched={touched} values={values} />
                                </div>
                                <div className="p-2" />
                                <div className="flex flex-row justify-content-end">
                                    <ZButton className="col-12 md:col-4">Salvar</ZButton>
                                </div>
                                <div className="p-2" />
                            </Form>
                        );
                    }}
                </Formik>
        </div>
    );
}