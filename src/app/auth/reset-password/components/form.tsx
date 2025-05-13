"use client";
import { ZButton } from "@/components/button/button";
import ZMessage from "@/components/message/message";
import ZPassword from "@/components/password/password";
import { logout } from "@/service/localstorage";
import { primeFlex } from "@/utils/prime_flex";
import { Form, Formik } from "formik";
import { Divider } from "primereact/divider";
import { useEffect, useState } from "react";
import * as Yup from "yup";
import { ResetPasswordController } from "../service/controller";
import { useSearchParams } from "next/navigation";

export default function FormResetPassword() {
  const prime = primeFlex();
  const [erros, setErros] = useState("");

  const searchParams = useSearchParams()
    const token = searchParams.get('token')

  //   const history = useNavigation();

  const controllerResetPassword = ResetPasswordController(setErros);

  useEffect(() => {
    logout();
  }, []);

  const schema = Yup.object().shape({
    password: Yup.string()
      .required("Campo Obrigatório")
      .min(8, "Senha deve ter pelo menos 8 caracteres"),
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

  return (
    <div
      className={prime.flex + prime.column + prime.justify_center + "h-full"}
    >
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
            controllerResetPassword.ResetPasswordAction({
              password: values.password,
            }, token ?? "");
          }}
        >
          {({ values, handleChange, errors, touched }) => {
            return (
              <Form className="col-11 md:col-4">
                <div className={prime.flex + prime.row + prime.justify_center}>
                  <h1>Resetar senha</h1>
                </div>
                  <div className="p-2" />
                  <div>
                    <div className="mb-4">
                      <div className="flex flex-column ">
                        <label className="mb-2">Nova Senha</label>
                        <ZPassword
                          name="password"
                          value={values.password}
                          onChange={handleChange}
                          placeholder="Digite sua nova senha"
                          invalid={!!(errors.password && touched.password)}
                          footer={footer}
                          weakLabel="Fraca"
                          mediumLabel="Médio"
                          strongLabel="Forte"
                          promptLabel="Digite uma nova senha"
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
                        <label className="mb-2">Confirmar sua nova senha</label>
                        <ZPassword
                          name="confirmpassword"
                          value={values.confirmpassword}
                          onChange={handleChange}
                          placeholder="Confirme sua nova senha"
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
                      >
                        Salvar
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
