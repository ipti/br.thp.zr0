"use client";
import { ZButton } from "@/components/button/button";
import ZInputText from "@/components/input/input";
import ZMessage from "@/components/message/message";
import { logout } from "@/service/localstorage";
import { primeFlex } from "@/utils/prime_flex";
import { Form, Formik } from "formik";
import { useEffect, useState } from "react";
import * as Yup from "yup";
import { SendEmailRecoveryPasswordController } from "../service/controller";
import Logo from "@/components/logo/logo";

export default function FormSendEmailRecoveryPassword() {
  const prime = primeFlex();
  const [erros, setErros] = useState("");
  const [loading, setLoading] = useState(false);


  const controllerSendEmailRecoveryPassword = SendEmailRecoveryPasswordController(setErros);

  useEffect(() => {
    logout();
  }, []);

  const schema = Yup.object().shape({
    email: Yup.string().required("Campo Obrigatório"),
  });

   const handleReturn = () => {
    setLoading(false);
  }

  return (
    <div
      className={prime.flex + prime.column + prime.justify_center + "h-full"}
    >
      <Logo/>
      {erros && (
        <div className={"flex row m-4" + prime.justify_center}>
          <ZMessage severity="error" text={erros} />
        </div>
      )}
      <div className={"grid" + prime.justify_center}>
        <Formik
          initialValues={{ email: "" }}
          validationSchema={schema}
          onSubmit={(values) => {
            setLoading(true);
            controllerSendEmailRecoveryPassword.SendEmailRecoveryPasswordAction({
              email: values.email
            }, handleReturn);
          }}
        >
          {({ values, handleChange, errors, touched }) => {
            return (
              <Form className="col-11 md:col-4">
                <div className={prime.flex + prime.row + prime.justify_center}>
                  <h1>Recuperar senha</h1>
                </div>
                <div className="p-2" />
                <div>
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
                          <div style={{ color: "red" }}>{errors.email}</div>
                        </>
                      ) : null}{" "}
                    </div>
                  </div>
                  <div className="p-2" />
                  <div >
                    <ZButton type="submit" style={{ width: "100%", justifyContent: "center" }} loading={loading}>
                      Enviar
                    </ZButton>
                  </div>
                </div>
              </Form>
            );
          }}
        </Formik>
      </div>
    </div>
  );
}
