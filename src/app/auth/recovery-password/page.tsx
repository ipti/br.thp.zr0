import "../../globals.css";
import FormSendEmailRecoveryPassword from "./components/form";
import "./recovery-password.css";

export default function RecoveryPassword() {
  return (
    <div className="container">
      {/* <CardComponent> */}
        <FormSendEmailRecoveryPassword />
      {/* </CardComponent> */}
    </div>
  );
}
