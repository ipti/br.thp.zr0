import TitlePage from "@/components/title_page/title_page";
import FormCreateUser from "./components/form";

export default async function CreateUser() {
  return (
    <div className="container">
      <TitlePage title="Criar usuário" />
      <FormCreateUser />
    </div>
  );
}
