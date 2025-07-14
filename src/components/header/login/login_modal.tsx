import { LoginController } from "@/app/auth/login/service/controller";
import { ZButton } from "@/components/button/button";
import ZDialog from "@/components/dialog/dialog";
import ZInputText from "@/components/input/input";
import ZMessage from "@/components/message/message";
import ZPassword from "@/components/password/password";
import { logout } from "@/service/cookies";
import { primeFlex } from "@/utils/prime_flex";
import { Form, Formik } from "formik";
import { useEffect, useState } from "react";
import * as Yup from "yup";
import "./login_modal.css"

export default function LoginModal() {

      const prime = primeFlex();
      const [erros, setErros] = useState("");
    
      const controllerLogin = LoginController(setErros);
    
      useEffect(() => {
        logout();
      }, []);
    
      const schema = Yup.object().shape({
        password: Yup.string()
          .required("Campo Obrigatório")
          .min(6, "Senha deve ter pelo menos 6 caracteres"),
        email: Yup.string().required("Campo Obrigatório"),
      });
    
    return(
        <ZDialog visible={true} modal onHide={() => { }} content={(hide) => {
        return(
            <div className="login_modal" >
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
                          initialValues={{ email: "", password: "" }}
                          validationSchema={schema}
                          onSubmit={(values) => {
                            controllerLogin.LoginAction({
                              email: values.email,
                              password: values.password,
                            });
                          }}
                        >
                          {({ values, handleChange, errors, touched }) => {
                            return (
                              <Form>
                                <div className={prime.flex + prime.row + prime.justify_center}>
                                  <h1>Fazer Login</h1>
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
                                  <div className="mb-4">
                                    <div className="flex flex-column ">
                                      <label className="mb-2">Senha</label>
                                      <ZPassword
                                        name="password"
                                        value={values.password}
                                        onChange={handleChange}
                                        placeholder="Digite sua senha"
                                        feedback={false}
                                        invalid={!!(errors.password && touched.password)}
                                        toggleMask
                                      ></ZPassword>
                                      {errors.password && touched.password ? (
                                        <>
                                          <div className="p-1" />
                                          <div style={{ color: "red" }}>{errors.password}</div>
                                        </>
                                      ) : null}
                                    </div>
                                  </div>
                                  <div className="p-2" />
                                  <div >
                                    <ZButton style={{ width: "100%", justifyContent: "center" }}>
                                      Entrar
                                    </ZButton>
                                  </div>
                                </div>
                              </Form>
                            );
                          }}
                        </Formik>
                      </div>
                      <p className="p-3" />
                      <div className={prime.flex + prime.row + prime.justify_center + "forget-password"}>
                        <a href="/auth/recovery-password">Esqueceu sua senha?</a>
                      </div>
                      <p className="p-4" />
                      <div className={prime.flex + prime.row + prime.justify_center + "text-sign"}>
                        <p>Você já tem uma conta? </p>
                        <div className="p-1" />
                        <a href="/auth/sign-up">Criar conta</a>
                      </div>
                      <p className="p-2" />
                    </div>
            </div>
        )
      }}>
      </ZDialog>
    )
}