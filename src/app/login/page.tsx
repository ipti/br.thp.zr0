import CardComponent from "@/components/card/card";
import "../globals.css";
import "./login.css";
import FormLogin from "./components/form";

export default function Login() {
  return (
    <div className="container">
      <CardComponent>
        <FormLogin />
      </CardComponent>
    </div>
  );
}
