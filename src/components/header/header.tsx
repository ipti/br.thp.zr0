"use client";
import { useRouter } from "next/navigation";
import "./header.css";
import { IconField } from "primereact/iconfield";
import { InputIcon } from "primereact/inputicon";
import { InputText } from "primereact/inputtext";

export default function TopBar() {
  const useNavigate = useRouter();

  return (
    <div className="container">
      <div>Logo</div>
      <div>
        <IconField iconPosition="left">
          <InputIcon className="pi pi-search"> </InputIcon>
          <InputText placeholder="Search" />
        </IconField>
      </div>
      <div onClick={() => useNavigate.push("/auth/login")}>menu</div>
    </div>
  );
}
