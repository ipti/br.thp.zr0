"use client";

import ZDropdown from "@/components/dropdown/dropdown";
import ZInputText from "@/components/input/input";
import TitlePage from "@/components/title_page/title_page";
import { Form, Formik } from "formik";
import { Button } from "primereact/button";
import { CategoryList } from "../type";
import ZInputNumber from "@/components/input_number/input_number";
import * as Yup from "yup";
import { CreateProductController } from "../services/controller";

export default function FormCreateProduct({
  category,
}: {
  category: CategoryList;
}) {
  const controllerCreateProduct = CreateProductController();

  const schema = Yup.object().shape({
    name: Yup.string()
      .required("Campo Obrigatório")
      .min(4, "Nome deve ter pelo menos 4 caracteres"),
    price: Yup.number().required("Campo Obrigatório"),
    category: Yup.number().required("Campo Obrigatório"),
  });
  return (
    <div>
      <TitlePage title="Criar Produto" />
      <Formik
        initialValues={{
          name: "",
          price: null,
          category: null,
        }}
        validationSchema={schema}
        onSubmit={(values) => {
          controllerCreateProduct.CreateProductAction({
            name: values.name,
            price: values.price ?? 0,
            idCategory: values.category ?? 0,
            description: "Produto"
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
                      placeholder="Digite o nome do produto"
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
                    <label className="mb-2">Preço</label>
                    <ZInputNumber
                      name="price"
                      value={values.price}
                      inputId="currency-brazil"
                      mode="currency"
                      currency="BRL"
                      locale="pt-BR"
                      onChange={(e) => setFieldValue("price", e.value)}
                      placeholder="Digite o preço"
                      invalid={!!(errors.price && touched.price)}
                    ></ZInputNumber>
                    {errors.price && touched.price ? (
                      <>
                        <div className="p-1" />
                        <div style={{ color: "red" }}>{errors.price}</div>
                      </>
                    ) : null}
                  </div>
                </div>
                <div className="mb-4 col-12 md:col-6">
                  <div className="flex flex-column">
                    <label className="mb-2">Categoria</label>
                    <ZDropdown
                      name="category"
                      value={values.category}
                      options={category}
                      onChange={handleChange}
                      placeholder="Selecione a categoria"
                      optionValue="id"
                      optionLabel="name"
                      invalid={!!(errors.category && touched.category)}
                    ></ZDropdown>
                    {errors.category && touched.category ? (
                      <>
                        <div className="p-1" />
                        <div style={{ color: "red" }}>{errors.category}</div>
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
