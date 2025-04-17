'use client'
import { Form, Formik } from "formik";
import { LoginRequest } from "../service/request";
import { Button } from "primereact/button";

export default function FormLogin() {
    return (
        <Formik initialValues={{ email: "", password: "" }} onSubmit={(values) => {
            LoginRequest({email: values.email, password: values.password})}}>
            {({ values, handleChange }) => {
              return (
                <Form>
                  <div className="flex flex-column" style={{}}>
                    <div className="flex flex-column">
                      <label>Email</label>
                      <input name="email" value={values.email} onChange={handleChange}></input>
                    </div>
                    <div className="flex flex-column">
                      <label>Senha</label>
                      <input name="password" value={values.password} onChange={handleChange}></input>
                    </div>
                    <div>
                      <Button>Entrar</Button>
                    </div>
                  </div>
                </Form>
              );
            }}
          </Formik>
    )
}