"use client";
import { ZButton } from "@/components/button/button";
import ZInputText from "@/components/input/input";
import ZMessage from "@/components/message/message";
import ZPassword from "@/components/password/password";
import { logout } from "@/service/localstorage";
import { primeFlex } from "@/utils/prime_flex";
import { Form, Formik } from "formik";
import { Divider } from "primereact/divider";
import { useEffect, useState } from "react";
import * as Yup from "yup";
import { SignUpController } from "../service/controller";
import Logo from "@/components/logo/logo";

export default function FormSignUp() {
  const prime = primeFlex();
  const [erros, setErros] = useState("");
  const [loading, setLoading] = useState(false);

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

  const footer = (
    <>
      <Divider />
      <p className="mt-2">Sugestões {"\n"}</p>
      <ul className="pl-2 ml-2 mt-0 line-height-3">
        <li>Pelo menos uma letra minúscula</li>
        <li>Pelo menos uma letra maiúscula</li>
        <li>Pelo menos um número</li>
        <li>No mínimo 8 caracteres</li>
      </ul>
    </>
  );

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
          initialValues={{
            email: "",
            password: "",
            name: "",
            confirmpassword: "",
          }}
          validationSchema={schema}
          onSubmit={(values) => {
            setLoading(true);
            controllerLogin.SignUpAction({
              name: values.name,
              email: values.email,
              password: values.password,
            }, handleReturn);
          }}
        >
          {({ values, handleChange, errors, touched }) => {
            return (
              <Form className="col-11 md:col-4">
                <div className={prime.flex + prime.row + prime.justify_center}>
                  <h1>Criar conta</h1>
                </div>
                  <div className="p-2" />
                  <div>
                    <div className="mb-4">
                      <div className="flex flex-column ">
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
                    <div className="mb-4">
                      <div className="flex flex-column ">
                        <label className="mb-2">Email</label>
                        <ZInputText
                          name="email"
                          value={values.email}
                          onChange={handleChange}
                          placeholder="Digite sua senha"
                          invalid={!!(errors.email && touched.email)}
                        ></ZInputText>
                        {errors.email && touched.email ? (
                          <>
                            <div className="p-1" />
                            <div style={{ color: "red" }}>{errors.email}</div>
                          </>
                        ) : null}
                      </div>
                    </div>
                    <div className="mb-4">
                      <div className="flex flex-column ">
                        <label className="mb-2">Senha</label>
                        <ZPassword
                          name="password"
                          value={values.password}
                          onChange={handleChange}
                          placeholder="Digite sua senha"
                          invalid={!!(errors.password && touched.password)}
                          footer={footer}
                          weakLabel="Fraca"
                          mediumLabel="Médio"
                          strongLabel="Forte"
                          promptLabel="Digite uma senha"
                          toggleMask
                        ></ZPassword>
                        {errors.password && touched.password ? (
                          <>
                            <div className="p-1" />
                            <div style={{ color: "red" }}>
                              {errors.password}
                            </div>
                          </>
                        ) : null}
                      </div>
                    </div>
                    <div className="mb-4">
                      <div className="flex flex-column ">
                        <label className="mb-2">Confirmar senha</label>
                        <ZPassword
                          name="confirmpassword"
                          value={values.confirmpassword}
                          onChange={handleChange}
                          placeholder="Confirme sua senha"
                          toggleMask
                          promptLabel="Digite uma senha"
                          invalid={
                            !!(
                              errors.confirmpassword && touched.confirmpassword
                            )
                          }
                        ></ZPassword>
                        {errors.confirmpassword && touched.confirmpassword ? (
                          <div style={{ color: "red" }}>
                            <>
                              <div className="p-1" />
                              {errors.confirmpassword}
                            </>
                          </div>
                        ) : null}
                      </div>
                    </div>
                    <div className="p-2" />
                    <div className="">
                      <ZButton
                        style={{ width: "100%", justifyContent: "center" }}
                        loading={loading}
                      >
                        Criar
                      </ZButton>
                    </div>
                  </div>
                  <div className="p-4" />
                  <div className={prime.flex + prime.row + "text-login" + prime.justify_center}>
                    <p>Você já tem uma conta? </p>
                    <div className="p-1" />
                    <div className={prime.flex + prime.column + prime.justify_center}>
                    <a href="/auth/login">Fazer Login</a>
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
