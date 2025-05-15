"use client";
import { ZButton } from "@/components/button/button";
import ZDropdown from "@/components/dropdown/dropdown";
import ZInputText from "@/components/input/input";
import ZPassword from "@/components/password/password";
import { logout } from "@/service/localstorage";
import { primeFlex } from "@/utils/prime_flex";
import { Form, Formik } from "formik";
import { Divider } from "primereact/divider";
import { useEffect } from "react";
import * as Yup from "yup";
import { CreateUserController } from "../services/controller";
import { list_perfis } from "@/utils/list/listt_perfis";

export default function FormCreateUser() {
  const prime = primeFlex();

  //   const history = useNavigation();

  const controllerLCreateUser = CreateUserController();

  useEffect(() => {
    logout();
  }, []);

  const schema = Yup.object().shape({
    name: Yup.string()
      .required("Campo Obrigatório")
      .min(8, "Nome deve ter pelo menos 8 caracteres"),
    role: Yup.string().required("Campo Obrigatório"),
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

  return (
    <div
      className={prime.flex + prime.column + prime.justify_center + "h-full"}
    >
      <div>
        <Formik
          initialValues={{
            email: "",
            password: "",
            role: "",
            name: "",
            confirmpassword: "",
          }}
          validationSchema={schema}
          onSubmit={(values) => {
            controllerLCreateUser.CreateUserAction({
              name: values.name,
              email: values.email,
              role: values.role,
              password: values.password,
            });
          }}
        >
          {({ values, handleChange, errors, touched }) => {
            return (
              <Form>
                <div className="p-2" />
                <div className="grid">
                  <div className="col-12 md:col-6 mb-4">
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
                  <div className="col-12 md:col-6 mb-4">
                    <div className="flex flex-column ">
                      <label className="mb-2">Email</label>
                      <ZInputText
                        name="email"
                        value={values.email}
                        onChange={handleChange}
                        placeholder="Digite seu email"
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
                  <div className="col-12 md:col-6 mb-4">
                    <div className="flex flex-column ">
                      <label className="mb-2">Tipo de perfil</label>
                      <ZDropdown
                        name="role"
                        options={list_perfis}
                        optionLabel="name"
                        optionValue="id"
                        value={values.role}
                        onChange={handleChange}
                        placeholder="Selecione o perfil"
                        invalid={!!(errors.role && touched.role)}
                      ></ZDropdown>
                      {errors.role && touched.role ? (
                        <>
                          <div className="p-1" />
                          <div style={{ color: "red" }}>{errors.role}</div>
                        </>
                      ) : null}
                    </div>
                  </div>
                  <div className="col-12 md:col-6 mb-4">
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
                          <div style={{ color: "red" }}>{errors.password}</div>
                        </>
                      ) : null}
                    </div>
                  </div>
                  <div className="col-12 md:col-6 mb-4">
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
                          !!(errors.confirmpassword && touched.confirmpassword)
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
                </div>
                <div className="flex flex-row justify-content-end">
                  <ZButton className="col-12 md:col-4">Criar</ZButton>
                </div>
              </Form>
            );
          }}
        </Formik>
      </div>
    </div>
  );
}
