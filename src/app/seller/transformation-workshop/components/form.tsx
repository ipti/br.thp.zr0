"use client";

import ZInputText from "@/components/input/input";
import TitlePage from "@/components/title_page/title_page";
import { Form, Formik } from "formik";
import { Button } from "primereact/button";
import { TransformationWorkshopController } from "../service/controller";
import InputAddress from "@/components/inputs_address/inputs_address";
import ZInputMask from "@/components/input_mask/input_mask";

type FormTransformationWorkshopProps = {
  mode: "create" | "update";
  initialData?: any;
};

export default function FormTransformationWorkshop(

  {
    mode,
    initialData,
  }: FormTransformationWorkshopProps

) {
  const controller = TransformationWorkshopController();
  return (
    <div>
      <TitlePage
        title={
          mode === "create"
            ? "Criar Oficina de transformação"
            : "Editar Oficina de transformação"
        }
      />
      <Formik
        initialValues={{
          location: initialData?.location ?? "",
          name: initialData?.name ?? "",
          cnpj: initialData?.cnpj ?? "",
          address: initialData?.address ?? "",
          cep: initialData?.cep ?? "",
          complement: initialData?.complement ?? "",
          neighborhood: initialData?.neighborhood ?? "",
          number: initialData?.number ?? "",
          city: initialData?.city_fk ?? undefined,
          state: initialData?.state_fk ?? undefined,
        }}
        enableReinitialize 
        onSubmit={(values) => {
          const payload = {
            cnpj: values.cnpj.replace(/[^a-zA-Z0-9 ]/g, ""),
            address: values.address,
            cep: values.cep.replace(/[^a-zA-Z0-9 ]/g, ""),
            city_fk: values.city,
            state_fk: values.state,
            complement: values.complement,
            neighborhood: values.neighborhood,
            number: values.number,
            name: values.name,
          };

          if (mode === "create") {
            controller.CreateTransformationWorkshopAction(payload);
          } else {
            controller.UpdateTransformationWorkshopAction(initialData.id, payload);
          }
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
                <Button className="col-12 md:col-4">{mode === "create" ? "Criar" : "Atualizar"}</Button>
              </div>
              <div className="p-2" />
            </Form>
          );
        }}
      </Formik>
    </div>
  );
}
