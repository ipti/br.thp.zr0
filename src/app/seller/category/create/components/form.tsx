"use client";

import ZInputText from "@/components/input/input";
import TitlePage from "@/components/title_page/title_page";
import { Form, Formik } from "formik";
import { Button } from "primereact/button";
import * as Yup from "yup";
import { CreateCategoryController } from "../services/controller";

export default function FormCreateCategory() {
  const controllerCreateCategory = CreateCategoryController();

  const schema = Yup.object().shape({
    name: Yup.string()
      .required("Campo Obrigatório")
      .min(4, "Nome deve ter pelo menos 4 caracteres")
  });
  return (
    <div>
      <TitlePage title="Criar Categoria" />
      <Formik
        initialValues={{
          name: "",
        }}
        validationSchema={schema}
        onSubmit={(values) => {
          controllerCreateCategory.CreateCategoryAction({
            name: values.name,
          });
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
                    <ZInputText
                      name="name"
                      value={values.name}
                      onChange={handleChange}
                      placeholder="Digite o nome da categoria"
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
                <div className="p-2" />
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
