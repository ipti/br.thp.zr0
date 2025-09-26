import FormCreateUser from "../components/form";

export default async function CreateUser() {
  return (
    <div className="container">
      <FormCreateUser mode="create" />
    </div>
  );
}
