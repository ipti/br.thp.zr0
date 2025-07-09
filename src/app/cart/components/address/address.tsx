import { ZButton } from "@/components/button/button";
import ZInputText from "@/components/input/input";
import ZInputMask from "@/components/input_mask/input_mask";
import InputAddress from "@/components/inputs_address/inputs_address";
import { Form, Formik } from "formik";

export default function Address() {
  function addingAddress() {
    return (
      <div className="w-8 md:w-7">
        <div className="p-3" />
        <h2>Novo endereço</h2>
        <div className="p-3" />
        <h2>Quem irá receber?</h2>
        <div className="p-3" />
        <Formik initialValues={{ name: "", phone: "" }} onSubmit={() => {}}>
          {({ values, handleChange, errors, touched, setFieldValue }) => {
            return (
              <Form>
                <div className="mb-4">
                  <div className="flex flex-column ">
                    <label className="mb-2">Nome</label>
                    <ZInputText
                      name="name"
                      value={values.name}
                      onChange={handleChange}
                      placeholder="Digite o seu name"
                      invalid={!!(errors.name && touched.name)}
                    ></ZInputText>
                    {errors.name && touched.name ? (
                      <>
                        <div className="p-1" />
                        <div style={{ color: "red" }}>{errors.name}</div>
                      </>
                    ) : null}{" "}
                  </div>
                </div>
                <div className="mb-4">
                  <div className="flex flex-column ">
                    <label className="mb-2">Telefone</label>
                    <ZInputMask
                      name="phone"
                      value={values.phone}
                      onChange={handleChange}
                      mask="(99) 9 9999-9999"
                      placeholder="Digite o seu telefone"
                      invalid={!!(errors.phone && touched.phone)}
                    ></ZInputMask>
                    {errors.phone && touched.phone ? (
                      <>
                        <div className="p-1" />
                        <div style={{ color: "red" }}>{errors.phone}</div>
                      </>
                    ) : null}{" "}
                  </div>
                </div>
                <h2>Complete as informações do Endereço</h2>
                <div className="p-3" />
                <div className="grid">
                  <InputAddress
                    errors={errors}
                    handleChange={handleChange}
                    setFieldValue={setFieldValue}
                    touched={touched}
                    values={values}
                  />
                </div>
                <div className="flex flex-row justify-content-end">
                    <ZButton label="Salvar e continuar" />
                </div>
              </Form>
            );
          }}
        </Formik>
      </div>
    );
  }
  return (
    <div>
      <div className="flex flex-row justify-content-center">
        {addingAddress()}
      </div>
    </div>
  );
}
