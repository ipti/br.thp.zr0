"use client";

import { useFetchRequestCategory } from "@/app/seller/category/service/query";
import ZDropdown from "@/components/dropdown/dropdown";
import ZInputText from "@/components/input/input";
import ZInputNumber from "@/components/input_number/input_number";
import TitlePage from "@/components/title_page/title_page";
import { Form, Formik } from "formik";
import { Button } from "primereact/button";
import * as Yup from "yup";
import { ProductController } from "../service/controller"
import ImageDropzone from "@/components/dropfile/dropfile";
import ZInputTextArea from "@/components/input_text_area/input_text_area";

type FormProductProps = {
  mode: "create" | "update";
  initialData?: any;
};

export default function FormProduct({ mode, initialData }: FormProductProps) {
  const { data: categoryRequest, isLoading } = useFetchRequestCategory()
  const controller = ProductController();

  const schema = Yup.object().shape({
    name: Yup.string()
      .required("Campo Obrigatório")
      .min(4, "Nome deve ter pelo menos 4 caracteres"),
    price: Yup.number().required("Campo Obrigatório"),
    category: Yup.number().required("Campo Obrigatório"),
  });
  return (
    <div>
      <TitlePage title={mode === "create" ? "Criar Produto" : "Editar Produto"} />
      <Formik
        initialValues={{
          name: initialData?.name || "",
          price: initialData?.price || 0,
          category: initialData?.category_fk || 0,
          description: initialData?.description || "",
          weight: initialData?.weight || 0,
          height: initialData?.height || 0,
          width: initialData?.width || 0,
          length: initialData?.length || 0,
          files: undefined
        }}
        validationSchema={schema}
        onSubmit={(values) => {
           const payload = {
            name: values.name,
            price: values.price ?? 0,
            idCategory: values.category ?? 0,
            description: values.description,
            files: values.files,
            height: values.height,
            length:values.length,
            weight: values.weight,
            width: values.width
          }
          if (mode === "create") {
            controller.CreateProductAction(payload);
          } else {
            controller.UpdateProductAction(initialData.id, payload);
          }
        }}
      >
        {({ values, handleChange, errors, touched, setFieldValue }) => {
          console.log(errors)
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
                <div className="mb-4 col-12">
                  <ImageDropzone files={values.files ?? []} onChange={(e: any) => setFieldValue("files", e)} />
                </div>
                <div className="mb-4 col-12 md:col-6">
                  <div className="flex flex-column">
                    <label className="mb-2">Altura</label>
                    <ZInputNumber
                      name="height"
                      value={values.height}
                      showButtons 
                      suffix="cm"
                      onChange={(e) => setFieldValue("height", e.value)}
                      placeholder="Digite a altura"
                      invalid={!!(errors.height && touched.height)}
                    ></ZInputNumber>
                    {errors.height && touched.height ? (
                      <>
                        <div className="p-1" />
                        <div style={{ color: "red" }}>{errors.height}</div>
                      </>
                    ) : null}
                  </div>
                </div>
                <div className="mb-4 col-12 md:col-6">
                  <div className="flex flex-column">
                    <label className="mb-2">Largura</label>
                    <ZInputNumber
                      name="width"
                      value={values.width}
                      showButtons
                      suffix="cm"
                      onChange={(e) => setFieldValue("width", e.value)}
                      placeholder="Digite a largura"
                      invalid={!!(errors.width && touched.width)}
                    ></ZInputNumber>
                    {errors.width && touched.width ? (
                      <>
                        <div className="p-1" />
                        <div style={{ color: "red" }}>{errors.width}</div>
                      </>
                    ) : null}
                  </div>
                </div>
                <div className="mb-4 col-12 md:col-6">
                  <div className="flex flex-column">
                    <label className="mb-2">Tamanho</label>
                    <ZInputNumber
                      name="length"
                      value={values.length}
                      showButtons 
                      suffix="cm"
                      onChange={(e) => setFieldValue("length", e.value)}
                      placeholder="Digite a tamanho"
                      invalid={!!(errors.length && touched.length)}
                    ></ZInputNumber>
                    {errors.length && touched.length ? (
                      <>
                        <div className="p-1" />
                        <div style={{ color: "red" }}>{errors.length}</div>
                      </>
                    ) : null}
                  </div>
                </div>
                <div className="mb-4 col-12 md:col-6">
                  <div className="flex flex-column">
                    <label className="mb-2">Peso</label>
                    <ZInputNumber
                      name="weight"
                      value={values.weight}
                      showButtons 
                      suffix="kg"
                      onChange={(e) => setFieldValue("weight", e.value)}
                      placeholder="Digite o peso"
                      invalid={!!(errors.weight && touched.weight)}
                    ></ZInputNumber>
                    {errors.weight && touched.weight ? (
                      <>
                        <div className="p-1" />
                        <div style={{ color: "red" }}>{errors.weight}</div>
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
                      options={categoryRequest}
                      loading={isLoading}
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
                <div className="col-12">
                  <div className="flex flex-column">
                    <label className="mb-2">Descrição</label>
                    <ZInputTextArea name="description" autoResize cols={30} rows={5} pt={{
                      root: {
                        style: { height: "128px" }
                      }
                    }} value={values.description} onChange={handleChange} />
                  </div>
                </div>
                <div className="p-4" />
              </div>
              <div className="flex flex-row justify-content-end">
                <Button className="col-12 md:col-4">{mode === "create" ? "Criar" : "Salvar"}</Button>
              </div>
              <div className="p-2" />
            </Form>
          );
        }}
      </Formik>
    </div>
  );
}
