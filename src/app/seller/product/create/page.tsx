import http from "@/service/axios";
import FormCreateTransformationWorkshop from "./components/form";


export default async function CreateTransformationWorkshop() {

    const { data } = await http.get('/category');
    
    return(
        <div className="container">
           <FormCreateTransformationWorkshop category={data} />
        </div>
    )
}