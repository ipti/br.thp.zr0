"use client";
import { ZButton } from "@/components/button/button";
import ZInputText from "@/components/input/input";
import ZMessage from "@/components/message/message";
import ZPassword from "@/components/password/password";
import { logout } from "@/service/localstorage";
import { primeFlex } from "@/utils/prime_flex";
import { Form, Formik } from "formik";
import { isAxiosError } from "axios";
import { useEffect, useState } from "react";
import * as Yup from "yup";
import { LoginController } from "../service/controller";
import Logo from "@/components/logo/logo";
import { ResendVerificationEmailRequest } from "../service/request";

const isUnverifiedEmailError = (message: string) =>
  message.trim().toLowerCase() === "unverified email";

export default function FormLogin() {
  const prime = primeFlex();
  const [erros, setErros] = useState("");
  const [loading, setLoading] = useState(false);
  const [loginEmail, setLoginEmail] = useState("");
  const [resendLoading, setResendLoading] = useState(false);
  const [resendFeedback, setResendFeedback] = useState<{
    severity: "success" | "error";
    text: string;
  } | null>(null);


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

  const handleReturn = () => {
    setLoading(false);
  };

  const handleResendVerification = async () => {
    if (!loginEmail || resendLoading) return;

    setResendLoading(true);
    setResendFeedback(null);
    try {
      await ResendVerificationEmailRequest(loginEmail);
      setResendFeedback({
        severity: "success",
        text: "Enviamos um novo link. Verifique sua caixa de entrada e a pasta de spam.",
      });
    } catch (error: unknown) {
      const message = isAxiosError<{ message?: string }>(error)
        ? error.response?.data?.message ??
          "Não foi possível reenviar o e-mail. Tente novamente mais tarde."
        : "Não foi possível reenviar o e-mail. Tente novamente mais tarde.";

      setResendFeedback({ severity: "error", text: message });
    } finally {
      setResendLoading(false);
    }
  };

  return (
    <div
      className={prime.flex + prime.column + prime.justify_center + "h-full"}
    >
      <Logo />

      {erros && (
        <div className="login-error-block">
          <ZMessage
            severity="error"
            text={isUnverifiedEmailError(erros) ? "Seu e-mail ainda não foi verificado." : erros}
          />
          {isUnverifiedEmailError(erros) && loginEmail ? (
            <div className="login-verification-help">
              <p>Não recebeu a mensagem de confirmação?</p>
              <ZButton
                type="button"
                label="Reenviar e-mail de confirmação"
                icon="pi pi-envelope"
                outlined
                loading={resendLoading}
                disabled={resendLoading || resendFeedback?.severity === "success"}
                onClick={() => void handleResendVerification()}
              />
              {resendFeedback ? (
                <ZMessage severity={resendFeedback.severity} text={resendFeedback.text} />
              ) : null}
            </div>
          ) : null}
        </div>
      )}

      <div className={"grid" + prime.justify_center}>
        <Formik
          initialValues={{ email: "", password: "" }}
          validationSchema={schema}
          onSubmit={(values) => {
            setLoading(true);
            setLoginEmail(values.email.trim());
            setResendFeedback(null);
            controllerLogin.LoginAction({
              email: values.email,
              password: values.password,
            }, handleReturn);
          }}
        >
          {({ values, handleChange, errors, touched }) => {
            return (
              <Form className="col-11 md:col-4">
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
                    <ZButton
                      type="submit"
                      style={{ width: "100%", justifyContent: "center" }}
                      loading={loading}
                    >
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
        <div className={prime.flex + prime.column + prime.justify_center}>
          <a href="/auth/sign-up">Criar conta</a>
        </div>
      </div>
      <p className="p-2" />
    </div>
  );
}
