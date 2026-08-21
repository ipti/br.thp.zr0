'use client'

import Link from 'next/link'
import { useFetchProductReviews } from '../service/query'
import './product_reviews.css'

function ReviewStars({ rating }: { rating: number }) {
  return (
    <span
      className="product-review-stars"
      aria-label={`${rating} de 5 estrelas`}
    >
      {[1, 2, 3, 4, 5].map(star => (
        <i
          aria-hidden="true"
          className={`pi ${star <= rating ? 'pi-star-fill' : 'pi-star'}`}
          key={star}
        />
      ))}
    </span>
  )
}

export function ProductReviews({ productUid }: { productUid: string }) {
  const { data, isLoading, isError } = useFetchProductReviews(productUid)
  const reviews = data?.data ?? []
  const total = data?.pagination.total ?? reviews.length

  return (
    <section className="product-reviews" aria-labelledby="reviews-title">
      <div className="product-reviews-header">
        <div>
          <span className="product-reviews-eyebrow">Opiniões verificadas</span>
          <h2 id="reviews-title">Avaliações de clientes</h2>
          <p>
            {total === 0
              ? 'Este produto ainda não recebeu avaliações.'
              : `${total} ${total === 1 ? 'avaliação publicada' : 'avaliações publicadas'}`}
          </p>
        </div>
        {total > 0 ? (
          <div className="product-reviews-count" aria-label={`${total} avaliações`}>
            <strong>{total}</strong>
            <span>{total === 1 ? 'avaliação' : 'avaliações'}</span>
          </div>
        ) : null}
      </div>

      <div className="product-reviews-guidance">
        <i className="pi pi-shield" aria-hidden="true" />
        <p>
          Somente compras recebidas podem ser avaliadas. Depois da entrega, acesse{' '}
          <Link href="/profile/order">Minhas compras</Link> para contar sua experiência.
        </p>
      </div>

      {isLoading ? (
        <div className="product-reviews-loading" role="status">
          <span className="product-review-skeleton" />
          <span className="product-review-skeleton" />
          <span className="sr-only">Carregando avaliações</span>
        </div>
      ) : null}

      {isError ? (
        <div className="product-reviews-state" role="alert">
          <i className="pi pi-exclamation-circle" aria-hidden="true" />
          <div>
            <strong>Não foi possível carregar as avaliações</strong>
            <p>Tente novamente em alguns instantes.</p>
          </div>
        </div>
      ) : null}

      {!isLoading && !isError && reviews.length === 0 ? (
        <div className="product-reviews-state">
          <i className="pi pi-comments" aria-hidden="true" />
          <div>
            <strong>Seja uma das primeiras pessoas a avaliar</strong>
            <p>A opção será liberada em Minhas compras depois que seu produto chegar.</p>
          </div>
        </div>
      ) : null}

      {!isLoading && !isError && reviews.length > 0 ? (
        <div className="product-reviews-list">
          {reviews.map(review => (
            <article className="product-review-card" key={review.id}>
              <div className="product-review-card-header">
                <span className="product-review-avatar" aria-hidden="true">
                  {review.user.name?.trim().charAt(0).toUpperCase() || 'C'}
                </span>
                <div className="product-review-author">
                  <strong>{review.user.name}</strong>
                  <span>
                    Compra verificada
                    <i className="pi pi-verified" aria-hidden="true" />
                  </span>
                </div>
                <ReviewStars rating={review.rating} />
              </div>
              {review.comment ? <p className="product-review-comment">{review.comment}</p> : null}
              <time dateTime={review.createdAt}>
                {new Intl.DateTimeFormat('pt-BR', {
                  day: '2-digit',
                  month: 'long',
                  year: 'numeric'
                }).format(new Date(review.createdAt))}
              </time>
            </article>
          ))}
        </div>
      ) : null}
    </section>
  )
}
