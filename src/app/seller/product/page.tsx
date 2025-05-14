import http from "@/service/axios";
import ListPage from "./components/list";

export default async function Product() {

    const { data } = await http.get('/product');

console.log(data)

    return(
        <div>
            <ListPage product={data} />
        </div>
    )
}