import http from "@/service/axios";
import ListPage from "./components/list";
import TitlePage from "@/components/title_page/title_page";

export default async function User() {
  const { data } = await http.get("/users");

  return (
    <div>
      <TitlePage title="" />

      <ListPage user={data} />
    </div>
  );
}
