"use client";
import { logout } from "@/service/localstorage";
import { Form, Formik } from "formik";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { Message } from "primereact/message";
import { useEffect, useState } from "react";
import { SignUpController } from "../service/controller";
import { primeFlex } from "@/utils/prime_flex";
import { Card } from "primereact/card";
import { useNavigation } from "@/utils/navigation";
import * as Yup from "yup";
import { Password } from "primereact/password";
import { Divider } from "primereact/divider";

export default function FormSignUp() {
  const prime = primeFlex();
  const [erros, setErros] = useState("");

  //   const history = useNavigation();

  const controllerLogin = SignUpController(setErros);

  useEffect(() => {
    logout();
  }, []);

  const schema = Yup.object().shape({
    name: Yup.string()
      .required("Campo Obrigatório")
      .min(8, "Nome deve ter pelo menos 8 caracteres"),
    password: Yup.string()
      .required("Campo Obrigatório")
      .min(8, "Senha deve ter pelo menos 8 caracteres"),
    email: Yup.string().required("Campo Obrigatório"),
    confirmpassword: Yup.string()
      .label("Confirmar senha")
      .required("Campo Obrigatório")
      .oneOf([Yup.ref("password")], "Senhas difirentes"),
  });

  return (
    <div
      className={prime.flex + prime.column + prime.justify_center + "h-full"}
    >
      {erros && (
        <div className={"flex row m-4" + prime.justify_center}>
          <Message severity="error" text={erros} />
        </div>
      )}
      <div className={"grid" + prime.justify_center}>
        <Formik
          initialValues={{
            email: "",
            password: "",
            name: "",
            confirmpassword: "",
          }}
          validationSchema={schema}
          onSubmit={(values) => {
            controllerLogin.SignUpAction({
              name: values.name,
              email: values.email,
              password: values.password,
            });
          }}
        >
          {({ values, handleChange, errors, touched }) => {
            console.log(errors);
            return (
              <Form className="col-11 md:col-5">
                <Card className="">
                  <h1>Criar conta</h1>
                  <div className="p-2" />
                  <div>
                    <div className="mb-4">
                      <div className="flex flex-column ">
                        <label className="mb-2">Nome</label>
                        <InputText
                          name="name"
                          value={values.name}
                          onChange={handleChange}
                          placeholder="Digite o seu email"
                        ></InputText>
                        {errors.name && touched.name ? (
                          <div style={{ color: "red" }}>{errors.name}</div>
                        ) : null}
                      </div>
                    </div>
                    <div className="mb-4">
                      <div className="flex flex-column ">
                        <label className="mb-2">Email</label>
                        <InputText
                          name="email"
                          value={values.email}
                          onChange={handleChange}
                          placeholder="Digite sua senha"
                        ></InputText>
                        {errors.email && touched.email ? (
                          <div style={{ color: "red" }}>{errors.email}</div>
                        ) : null}
                      </div>
                    </div>
                    <div className="mb-4">
                      <div className="flex flex-column ">
                        <label className="mb-2">Senha</label>
                        <Password
                          name="password"
                          value={values.password}
                          onChange={handleChange}
                          placeholder="Digite sua senha"
                          toggleMask
                        ></Password>
                        {errors.password && touched.password ? (
                          <div style={{ color: "red" }}>{errors.password}</div>
                        ) : null}
                      </div>
                    </div>
                    <div className="mb-4">
                      <div className="flex flex-column ">
                        <label className="mb-2">Confirmar senha</label>
                        <Password
                          name="confirmpassword"
                          value={values.confirmpassword}
                          onChange={handleChange}
                          placeholder="Confirme sua senha"
                          toggleMask
                        ></Password>
                        {errors.confirmpassword && touched.confirmpassword ? (
                          <div style={{ color: "red" }}>
                            {errors.confirmpassword}
                          </div>
                        ) : null}
                      </div>
                    </div>
                    <div className="">
                      <Button
                        style={{ width: "100%", justifyContent: "center" }}
                      >
                        Criar
                      </Button>
                    </div>
                  </div>
                  <div className="p-2" />
                  <Divider />
                  <div className="p-2" />
                  <div className={prime.flex + prime.row}>
                    <p>Você já tem uma conta? </p>
                    <div className="p-1" />
                    <a href="/login">Fazer Login</a>
                  </div>
                </Card>
              </Form>
            );
          }}
        </Formik>
      </div>
    </div>
  );
}
