"use client";
import { logout } from "@/service/localstorage";
import { Form, Formik } from "formik";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { Message } from "primereact/message";
import { useEffect, useState } from "react";
import { LoginController } from "../service/controller";
import { primeFlex } from "@/utils/prime_flex";
import { Card } from "primereact/card";
import { useNavigation } from "@/utils/navigation";
import { Divider } from "primereact/divider";
import { Password } from "primereact/password";

export default function FormLogin() {
  const prime = primeFlex();
  const [erros, setErros] = useState("");
  const history = useNavigation();

  const controllerLogin = LoginController(setErros);

  useEffect(() => {
    logout();
  }, []);

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
          initialValues={{ email: "", password: "" }}
          onSubmit={(values) => {
            controllerLogin.LoginAction({
              email: values.email,
              password: values.password,
            });
          }}
        >
          {({ values, handleChange }) => {
            return (
              <Form className="col-11 md:col-5">
                <Card className="">
                  <h1>Fazer Login</h1>
                  <div className="p-2" />
                  <div>
                    <div className="mb-4">
                      <div className="flex flex-column ">
                        <label className="mb-2">Email</label>
                        <InputText
                          name="email"
                          value={values.email}
                          onChange={handleChange}
                          placeholder="Digite o seu email"
                        ></InputText>
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
                      </div>
                    </div>
                    <div className="">
                      <Button
                        style={{ width: "100%", justifyContent: "center" }}
                      >
                        Entrar
                      </Button>
                    </div>
                  </div>
                </Card>
              </Form>
            );
          }}
        </Formik>
      </div>
      <p className="p-2" />
      <div className={"grid" + prime.justify_center}>
        <div
          className={
            prime.flex +
            prime.row +
            prime.justify_content_around +
            "col-11 md:col-5"
          }
        >
          <Divider />
          <p className="w-full text-center">Novo no Zr0?</p>
          <Divider />
        </div>
      </div>
      <p className="p-2" />
      <div className={"grid" + prime.justify_center}>
        <div className="col-11 md:col-5">
          <div className="button-sign">
            {" "}
            <p
              onClick={() => {
                history.history.push("/sign-up");
              }}
            >
              Fazer cadastro
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
