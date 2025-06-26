import { Suspense } from "react";
import VerifyEmailComponent from "./components/verify_email";
import './verify-email.css';

export default function VerifyEmail() {
  return (
    <div className="container">
      <Suspense>
        <VerifyEmailComponent />
      </Suspense>
    </div>
  );
}
