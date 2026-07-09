import Products from "./components/products";

export default async function ProductPage({
  searchParams,
}: {
  searchParams?: Promise<{ q?: string }>
}){
    const params = await searchParams
    return(
        <div className="p-4">
            <Products q={params?.q} />
        </div>
    )
}
