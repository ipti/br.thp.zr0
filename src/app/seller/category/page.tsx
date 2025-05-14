import http from "@/service/axios";
import ListPage from "./components/list";

export default async function Category() {

    const { data } = await http.get('/category');

    console.log(data)

    return(
        <div>
            <ListPage category={data}/>
        </div>
    )
}