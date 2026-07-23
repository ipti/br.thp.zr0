import Products from "./components/products";
import type { Metadata } from 'next'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Produtos sustentáveis | ZR0',
  description:
    'Conheça móveis e peças de design produzidos artesanalmente com plástico reciclado.',
}

export default async function ProductPage({
  searchParams,
}: {
  searchParams?: Promise<{ q?: string; page?: string }>
}){
    const params = await searchParams
    const parsedPage = Number(params?.page ?? 1)
    const page = Number.isInteger(parsedPage) && parsedPage > 0 ? parsedPage : 1

    return(
        <div className="p-4">
            <Products q={params?.q} page={page} />
        </div>
    )
}
