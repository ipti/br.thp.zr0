"use client";

import FormCategory from "../components/form";
import { useSearchParams } from "next/navigation";
import { useFetchRequestCategoryOne } from "../service/query";



export default function UpdateCategory() {
    const searchParams = useSearchParams();
    const idCategory = searchParams.get("idCategory");
    const { data, isLoading } = useFetchRequestCategoryOne(idCategory ?? "");
    console.log(data);

    if (isLoading) return <div>Carregando...</div>;
    if (!data) return <div>Categoria não encontrada</div>;
    return (
        <div className="container">
            <FormCategory mode="update" initialData={data} />
        </div>
    )
}