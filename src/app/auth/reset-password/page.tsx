import { Suspense } from "react";
import FormSignUp from "./components/form";
import './sign-up.css'

export default function SignUp() {
  return (
    <div className="container">
      <FormSignUp />
    </div>
  );
}
