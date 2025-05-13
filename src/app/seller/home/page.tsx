import TitlePage from "@/components/title_page/title_page";
import ListHome from "./components/list";

export default function Home() {
  return (
    <div>
      <TitlePage title="Oficinas de transfomações" />
      <ListHome />
    </div>
  );
}
