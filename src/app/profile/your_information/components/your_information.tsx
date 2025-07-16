"use client"
import { ZButton } from "@/components/button/button";
import ZCard from "@/components/card/card";
import ZDivider from "@/components/divider/divider";
import ZInputText from "@/components/input/input";
import ZInputMask from "@/components/input_mask/input_mask";
import { useFetchUserToken } from "@/service/global_request/query";
import { UserGlobal } from "@/service/global_request/type";
import { primeFlex } from "@/utils/prime_flex";
import { Form, Formik } from "formik";
import * as Yup from "yup";
import { ControllerYourInformation } from "../service/controller";


export default function YourInformationComponents() {

    const controllerYourInformation = ControllerYourInformation()

     const {data: userRequest, isLoading} = useFetchUserToken()
    
    const user: UserGlobal | undefined = userRequest

    const prime = primeFlex();

    const schema = Yup.object().shape({
        name: Yup.string()
            .required("Campo Obrigatório")
            .min(8, "Nome deve ter pelo menos 8 caracteres"),
        role: Yup.string().required("Campo Obrigatório"),
        password: Yup.string()
            .required("Campo Obrigatório")
            .min(8, "Senha deve ter pelo menos 8 caracteres"),
        email: Yup.string().required("Campo Obrigatório"),
        confirmpassword: Yup.string()
            .label("Confirmar senha")
            .required("Campo Obrigatório")
            .oneOf([Yup.ref("password")], "Senhas difirentes"),
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

    if(isLoading) return null

    return (
        <div
            className={prime.flex + prime.column + prime.justify_center + "h-full p-4 md:p-8"}
        >
            <ZCard >
                <h3>Atualize seus dados</h3>
                <Formik
                    initialValues={{
                        email: user?.email ?? "",
                        name: user?.name ?? "",
                        phone: user?.customer.phone ?? "",
                        birthday: user?.customer.birthday ?? ""

                    }}
                    // validationSchema={schema}
                    onSubmit={(values) => {
                        controllerYourInformation.UpdateCustomer({id: user?.customer.id ?? 1, body: {phone: values.phone}})
                    }}
                >
                    {({ values, handleChange, errors, touched }) => {
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
                                                    <div style={{ color: "red" }}>{errors.phone}</div>
                                                </>
                                            ) : null}
                                        </div>
                                    </div>
                                    <div className="col-12 md:col-6 mb-4">
                                        <div className="flex flex-column ">
                                            <label className="mb-2">Data de nascimento</label>
                                            <ZInputMask
                                                name="phone"
                                                value={values.phone}
                                                onChange={handleChange}
                                                placeholder="Digite sua data de nascimento"
                                                invalid={!!(errors.phone && touched.phone)}
                                                mask="99/99/9999"
                                            ></ZInputMask>
                                            {errors.phone && touched.phone ? (
                                                <>
                                                    <div className="p-1" />
                                                    <div style={{ color: "red" }}>{errors.phone}</div>
                                                </>
                                            ) : null}
                                        </div>
                                    </div>
                                    <div className="p-2" />
                                </div>
                                <div className="flex flex-row justify-content-end">
                                    <ZButton className="col-12 md:col-4">Salvar</ZButton>
                                </div>
                            </Form>
                        );
                    }}
                </Formik>
            </ZCard>
        </div>
    );
}