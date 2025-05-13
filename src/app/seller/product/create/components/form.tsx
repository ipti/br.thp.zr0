"use client";

import TitlePage from "@/components/title_page/title_page";
import { Form, Formik } from "formik";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";

export default function FormCreateProduct() {
  return (
    <div>
      <TitlePage title="Criar Produto" />
      <Formik
        initialValues={{
          name: "",
          stock: "",
          price: "",
          category: ""
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
                    <label className="mb-2">Preço</label>
                    <InputText
                      name="price"
                      value={values.price}
                      onChange={handleChange}
                      placeholder="Digite sua senha"
                      invalid={!!(errors.price && touched.price)}
                    ></InputText>
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
                    <label className="mb-2">Estoque</label>
                    <InputText
                      name="stock"
                      value={values.stock}
                      onChange={handleChange}
                      placeholder="Digite um stock"
                      invalid={!!(errors.stock && touched.stock)}
                    ></InputText>
                    {errors.stock && touched.stock ? (
                      <>
                        <div className="p-1" />
                        <div style={{ color: "red" }}>{errors.stock}</div>
                      </>
                    ) : null}
                  </div>
                </div>
                <div className="mb-4 col-12 md:col-6">
                  <div className="flex flex-column">
                    <label className="mb-2">Categoria</label>
                    <InputText
                      name="category"
                      value={values.category}
                      onChange={handleChange}
                      placeholder="Digite a localização"
                      invalid={!!(errors.category && touched.category)}
                    ></InputText>
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
