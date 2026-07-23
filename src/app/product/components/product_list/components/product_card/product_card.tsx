import { WishlistButton } from '@/app/product/components/wishlist_button'
import { ProductType } from '@/app/seller/product/type'
import Link from 'next/link'
import './product_card.css'

interface ProductCardProps {
    product: ProductType
    //   onProductClick: (id: number) => void;
    //   onNavigateToCart: () => void;
}

export const ProductCard = ({
    product
}: ProductCardProps) => {
    return (
        <article className="card">
            <div className="flex justify-content-end p-2">
                <WishlistButton productUid={product.uid} />
            </div>
            <Link
                href={`/product/${product.uid}`}
                className="product-card-link"
                aria-label={`Ver detalhes de ${product.name}`}
            >
                <div className="imageWrapper">
                    {product.product_image[0]?.img_url ? (
                        <img
                            src={product.product_image[0].img_url}
                            alt={product.name}
                            className="image"
                        />
                    ) : null}
                </div>
                <div className="info">
                    <div>
                        <h3 className="title">{product.name}</h3>
                        <p>
                            {(product.averageRating ?? 0).toFixed(1)} ★ (
                            {product.reviewCount ?? 0})
                        </p>
                    </div>
                    <p className="price">
                        {product.price.toLocaleString('pt-BR', {
                            style: 'currency',
                            currency: 'BRL',
                        })}
                    </p>
                </div>
            </Link>
        </article>
    )
}
