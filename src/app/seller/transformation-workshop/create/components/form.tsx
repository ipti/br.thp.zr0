"use client";

import ZInputText from "@/components/input/input";
import TitlePage from "@/components/title_page/title_page";
import { Form, Formik } from "formik";
import { Button } from "primereact/button";
import { TransformationWorkshopController } from "../service/controller";
import InputAddress from "@/components/inputs_address/inputs_address";
import ZInputMask from "@/components/input_mask/input_mask";

export default function FormCreateTransformationWorkshop() {
  const controllerCreateTW = TransformationWorkshopController();
  return (
    <div>
      <TitlePage title="Criar Oficina de transformação" />
      <Formik
        initialValues={{
          location: "",
          name: "",
          cnpj: "",
          address: "",
          cep: "",
          complement: "",
          neighborhood: "",
          number: "",
          city: undefined,
          state: undefined,
        }}
        //   validationSchema={schema}
        onSubmit={(values) => {
          controllerCreateTW.CreateTransformationWorkshopAction({
            cnpj: values.cnpj.replace(/[^a-zA-Z0-9 ]/g, ""),
            address: values.address,
            cep: values.cep.replace(/[^a-zA-Z0-9 ]/g, ""),
            city_fk: values.city,
            state_fk: values.state,
            complement: values.complement,
            neighborhood: values.neighborhood,
            number: values.number,
            name: values.name,
          });
        }}
      >
        {({ values, handleChange, errors, touched, setFieldValue }) => {
          return (
            <Form>
              <div className="p-2" />
              <div className="grid">
                <div className="mb-4 col-12 md:col-6">
                  <div className="flex flex-column">
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
                <div className="mb-4 col-12 md:col-6">
                  <div className="flex flex-column">
                    <label className="mb-2">CNPJ</label>
                    <ZInputMask
                      name="cnpj"
                      value={values.cnpj}
                      mask="99.999.999/9999-99"
                      onChange={handleChange}
                      placeholder="Digite um CNPJ"
                      invalid={!!(errors.cnpj && touched.cnpj)}
                    ></ZInputMask>
                    {errors.cnpj && touched.cnpj ? (
                      <>
                        <div className="p-1" />
                        <div style={{ color: "red" }}>{errors.cnpj}</div>
                      </>
                    ) : null}
                  </div>
                </div>
                <InputAddress
                  errors={errors}
                  handleChange={handleChange}
                  setFieldValue={setFieldValue}
                  touched={touched}
                  values={values}
                />
              </div>
              <div className="flex flex-row justify-content-end">
                <Button className="col-12 md:col-4">Criar</Button>
              </div>
              <div className="p-2" />
            </Form>
          );
        }}
      </Formik>
    </div>
  );
}
