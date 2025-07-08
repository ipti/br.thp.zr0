import { ZButton } from "@/components/button/button";
import ZInputText from "@/components/input/input";
import ZPassword from "@/components/password/password";
import { Form, Formik } from "formik";
import { useState } from "react";
import * as Yup from "yup";
import { CartController } from "../../service/controller";
import { VerifyEmailReturn } from "../../service/types";

export default function Identify({
  handleActiveIndex,
}: {
  handleActiveIndex: (i: number) => void;
}) {
  const [erros, setErros] = useState("");
  const [email, setEmail] = useState("");
  const [statusEmail, setStatusEmail] = useState<VerifyEmailReturn>();

  console.log(statusEmail);

  const handleStatusEmail = (value: VerifyEmailReturn) => {
    setStatusEmail(value);
  };

  const controllerCart = CartController(setErros);
  const schema = Yup.object().shape({
    password: Yup.string()
      .required("Campo Obrigatório")
      .min(6, "Senha deve ter pelo menos 6 caracteres"),
    email: Yup.string().required("Campo Obrigatório"),
  });

  const paginaVerify = () => {
    return (
      <div className="p-4">
        <h1>Identificação</h1>
        <div className="p-4" />
        <div className="grid">
          <div className="col-12 md:col-6">
            <div className="flex flex-row justify-content-center">
              <div className="w-full md:w-8">
                <h3>Quero criar uma conta</h3>
                <div className="p-2" />
                <div className="flex flex-column">
                  <label>E-mail</label>
                  <div className="p-1" />
                  <ZInputText
                    placeholder="Digite seu e-mail"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                  <div className="mb-4" />
                  <ZButton
                    label="Continuar"
                    onClick={() =>
                      controllerCart.VerifyEmailAction(
                        { email: email },
                        handleStatusEmail
                      )
                    }
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="col-12 md:col-6">
            <div className="flex flex-row justify-content-center w-full">
              <div className="w-full md:w-8">
                <h3>Já sou cliente</h3>
                <div className="p-2" />
                <Formik
                  initialValues={{ email: "", password: "" }}
                  validationSchema={schema}
                  onSubmit={(values) => {
                    controllerCart.LoginCartAction(
                      {
                        email: values.email,
                        password: values.password,
                      },
                      handleActiveIndex
                    );
                  }}
                >
                  {({ values, handleChange, touched, errors }) => {
                    return (
                      <Form>
                        <div className="mb-4">
                          <div className="flex flex-column ">
                            <label className="mb-2">Email</label>
                            <ZInputText
                              name="email"
                              value={values.email}
                              onChange={handleChange}
                              placeholder="Digite o seu email"
                              invalid={!!(errors.email && touched.email)}
                            ></ZInputText>
                            {errors.email && touched.email ? (
                              <>
                                <div className="p-1" />
                                <div style={{ color: "red" }}>
                                  {errors.email}
                                </div>
                              </>
                            ) : null}{" "}
                          </div>
                        </div>
                        <div className="mb-4">
                          <div className="flex flex-column">
                            <label className="mb-2">Senha</label>
                            <ZPassword
                              name="password"
                              value={values.password}
                              onChange={handleChange}
                              placeholder="Digite sua senha"
                              feedback={false}
                              invalid={!!(errors.password && touched.password)}
                              toggleMask
                            ></ZPassword>
                            {errors.password && touched.password ? (
                              <>
                                <div className="p-1" />
                                <div style={{ color: "red" }}>
                                  {errors.password}
                                </div>
                              </>
                            ) : null}
                          </div>
                        </div>
                        <ZButton label="Entrar" className="w-full" />
                      </Form>
                    );
                  }}
                </Formik>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const paginaCadastro = () => {
    return (
      <div className="p-4">
        <h1>Criar Conta</h1>
        <div className="p-4" />

        <div className="grid">
          <div className="col-12 md:col-6">
            <div className="flex flex-row justify-content-center w-full">
              <div className="w-full">
                <div className="p-2" />
                <Formik
                  initialValues={{ email: email ?? "", password: "" }}
                  validationSchema={schema}
                  onSubmit={(values) => {
                    controllerCart.LoginCartAction(
                      {
                        email: values.email,
                        password: values.password,
                      },
                      handleActiveIndex
                    );
                  }}
                >
                  {({ values, handleChange, touched, errors }) => {
                    return (
                      <Form>
                        <div className="mb-4">
                          <div className="flex flex-column ">
                            <label className="mb-2">Email</label>
                            <ZInputText
                              name="email"
                              value={values.email}
                              onChange={handleChange}
                              placeholder="Digite o seu email"
                              invalid={!!(errors.email && touched.email)}
                            ></ZInputText>
                            {errors.email && touched.email ? (
                              <>
                                <div className="p-1" />
                                <div style={{ color: "red" }}>
                                  {errors.email}
                                </div>
                              </>
                            ) : null}{" "}
                          </div>
                        </div>
                        <div className="mb-4">
                          <div className="flex flex-column ">
                            <label className="mb-2">Nome</label>
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
                                <div style={{ color: "red" }}>
                                  {errors.email}
                                </div>
                              </>
                            ) : null}{" "}
                          </div>
                        </div>
                        <div className="mb-4">
                          <div className="flex flex-column">
                            <label className="mb-2">Senha</label>
                            <ZPassword
                              name="password"
                              value={values.password}
                              onChange={handleChange}
                              placeholder="Digite sua senha"
                              feedback={false}
                              invalid={!!(errors.password && touched.password)}
                              toggleMask
                            ></ZPassword>
                            {errors.password && touched.password ? (
                              <>
                                <div className="p-1" />
                                <div style={{ color: "red" }}>
                                  {errors.password}
                                </div>
                              </>
                            ) : null}
                          </div>
                        </div>
                        <div className="mb-4">
                          <div className="flex flex-column">
                            <label className="mb-2">Comfirmar senha</label>
                            <ZPassword
                              name="password"
                              value={values.password}
                              onChange={handleChange}
                              placeholder="Digite sua senha"
                              feedback={false}
                              invalid={!!(errors.password && touched.password)}
                              toggleMask
                            ></ZPassword>
                            {errors.password && touched.password ? (
                              <>
                                <div className="p-1" />
                                <div style={{ color: "red" }}>
                                  {errors.password}
                                </div>
                              </>
                            ) : null}
                          </div>
                        </div>
                        <ZButton label="Criar" className="w-full" />
                      </Form>
                    );
                  }}
                </Formik>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return statusEmail?.exists === false ? paginaCadastro() : paginaVerify();
}
