"use client";

import FormProduct from "../components/form";
import { useSearchParams } from "next/navigation";
import { useFetchrequestProductOne } from "../service/query";


export default  function UpdateProduct() {
    const searchParams = useSearchParams();
    const idProduct = searchParams.get("idProduct");
    const { data, isLoading } = useFetchrequestProductOne(idProduct ?? "");

    if (isLoading) return <div>Carregando...</div>;
    if (!data) return <div>Produto não encontrada</div>;

    return (
        <div className="container">
            <FormProduct mode="update" initialData={data} />
        </div>
    )
}