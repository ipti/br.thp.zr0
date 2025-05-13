"use client";

import TitlePage from "@/components/title_page/title_page";
import { primeFlex } from "@/utils/prime_flex";
import { Form, Formik } from "formik";
import { Button } from "primereact/button";
import { Divider } from "primereact/divider";
import { InputText } from "primereact/inputtext";
import { Password } from "primereact/password";

export default function FormCreateTransformationWorkshop() {
  const prime = primeFlex();
  return (
    <div>
      <TitlePage title="Criar Oficina de transformação" />
      <Formik
        initialValues={{
          email: "",
          password: "",
          name: "",
          confirmpassword: "",
          cnpj: "",
        }}
        //   validationSchema={schema}
        onSubmit={(values) => {
          // controllerLogin.SignUpAction({
          //   name: values.name,
          //   email: values.email,
          //   password: values.password,
          // });
        }}
      >
        {({ values, handleChange, errors, touched }) => {
          return (
            <Form>
              <div className="p-2" />
              <div className="grid">
                <div className="mb-4 col-12 md:col-6">
                  <div className="flex flex-column">
                    <label className="mb-2">Nome</label>
                    <InputText
                      name="name"
                      value={values.name}
                      onChange={handleChange}
                      placeholder="Digite o seu nome"
                      invalid={!!(errors.name && touched.name)}
                    ></InputText>
                    {errors.name && touched.name ? (
                      <>
                        <div className="p-1" />
                        <div style={{ color: "red" }}>{errors.name}</div>
                      </>
                    ) : null}
                  </div>
                </div>
                <div className="mb-4 col-12 md:col-6">
                  <div className="flex flex-column">
                    <label className="mb-2">Email</label>
                    <InputText
                      name="email"
                      value={values.email}
                      onChange={handleChange}
                      placeholder="Digite sua senha"
                      invalid={!!(errors.email && touched.email)}
                    ></InputText>
                    {errors.email && touched.email ? (
                      <>
                        <div className="p-1" />
                        <div style={{ color: "red" }}>{errors.email}</div>
                      </>
                    ) : null}
                  </div>
                </div>
                <div className="mb-4 col-12 md:col-6">
                  <div className="flex flex-column">
                    <label className="mb-2">CNPJ</label>
                    <InputText
                      name="cnpj"
                      value={values.cnpj}
                      onChange={handleChange}
                      placeholder="Digite um CNPJ"
                      invalid={!!(errors.cnpj && touched.cnpj)}
                    ></InputText>
                    {errors.cnpj && touched.cnpj ? (
                      <>
                        <div className="p-1" />
                        <div style={{ color: "red" }}>{errors.cnpj}</div>
                      </>
                    ) : null}
                  </div>
                </div>
                <div className="mb-4 col-12 md:col-6">
                  <div className="flex flex-column">
                    <label className="mb-2">Localização</label>
                    <InputText
                      name="name"
                      value={values.name}
                      onChange={handleChange}
                      placeholder="Digite a localização"
                      invalid={!!(errors.name && touched.name)}
                    ></InputText>
                    {errors.name && touched.name ? (
                      <>
                        <div className="p-1" />
                        <div style={{ color: "red" }}>{errors.name}</div>
                      </>
                    ) : null}
                  </div>
                </div>
                <div className="mb-4 col-12 md:col-6">
                  <div className="flex flex-column">
                    <label className="mb-2">Senha</label>
                    <Password
                      name="password"
                      value={values.password}
                      onChange={handleChange}
                      placeholder="Digite sua senha"
                      invalid={!!(errors.password && touched.password)}
                      //   footer={footer}
                      weakLabel="Fraca"
                      mediumLabel="Médio"
                      strongLabel="Forte"
                      promptLabel="Digite uma senha"
                      toggleMask
                    ></Password>
                    {errors.password && touched.password ? (
                      <>
                        <div className="p-1" />
                        <div style={{ color: "red" }}>{errors.password}</div>
                      </>
                    ) : null}
                  </div>
                </div>
                <div className="mb-4 col-12 md:col-6">
                  <div className="flex flex-column">
                    <label className="mb-2">Confirmar senha</label>
                    <Password
                      name="confirmpassword"
                      value={values.confirmpassword}
                      onChange={handleChange}
                      placeholder="Confirme sua senha"
                      toggleMask
                      promptLabel="Digite uma senha"
                      invalid={
                        !!(errors.confirmpassword && touched.confirmpassword)
                      }
                    ></Password>
                    {errors.confirmpassword && touched.confirmpassword ? (
                      <div style={{ color: "red" }}>
                        <>
                          <div className="p-1" />
                          {errors.confirmpassword}
                        </>
                      </div>
                    ) : null}
                  </div>
                </div>
                <div className="p-2" />
              </div>
              <div className="flex flex-row justify-content-end">
                <Button className="col-12 md:col-4">
                  Criar
                </Button>
              </div>
              <div className="p-2" />
            </Form>
          );
        }}
      </Formik>
    </div>
  );
}
