"use client";
import { useFetchRequestTransformationWorkshop } from "@/app/seller/transformation-workshop/service/query";
import { ZButton } from "@/components/button/button";
import ZDropdown from "@/components/dropdown/dropdown";
import ZInputText from "@/components/input/input";
import ZPassword from "@/components/password/password";
import { logout } from "@/service/localstorage";
import { list_perfis } from "@/utils/list/listt_perfis";
import { primeFlex } from "@/utils/prime_flex";
import { Form, Formik } from "formik";
import { Divider } from "primereact/divider";
import { useEffect } from "react";
import * as Yup from "yup";
import { UserController } from "../service/controller"
import TitlePage from "@/components/title_page/title_page";

type FormUserProps = {
  mode: "create" | "update";
  initialData?: any;
};

export default function FormUser({ mode, initialData }: FormUserProps) {
  const prime = primeFlex();

  //   const history = useNavigation();

  const controller = UserController();

  const { data: otRequest } = useFetchRequestTransformationWorkshop()

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
      <TitlePage title={mode === "create" ? "Criar Usuário" : "Editar Usuário"} />
      <div>
        <Formik
          initialValues={{
            email: initialData?.email || "",
            password: "",
            role: initialData?.role || "",
            name: initialData?.name || "",
            confirmpassword: "",
            ot_fk: '',
          }}
          validationSchema={schema}
          onSubmit={(values) => {

            const payload = {
              name: values.name,
              email: values.email,
              role: values.role,
              password: values.password,
              ot_fk: values.ot_fk
            };

            if (mode === "create") {
              controller.CreateUserAction(payload);
            } else {
              controller.UpdateUserAction(initialData.id, payload);
            }
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
                      <label className="mb-2">Oficina de transformação</label>
                      <ZDropdown
                        name="ot_fk"
                        options={otRequest}
                        optionLabel="transformation_workshop.name"
                        optionValue="transformation_workshop.id"
                        value={values.ot_fk}
                        onChange={handleChange}
                        placeholder="Selecione a oficina"
                        invalid={!!(errors.ot_fk && touched.ot_fk)}
                      ></ZDropdown>
                      {errors.ot_fk && touched.ot_fk ? (
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
                  <ZButton className="col-12 md:col-4">{mode === "create" ? "Criar " : "Salvar"}</ZButton>
                </div>
              </Form>
            );
          }}
        </Formik>
      </div>
    </div>
  );
}
