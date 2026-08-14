'use client'

import { useState } from 'react'
import { AxiosError } from 'axios'
import { InputTextarea } from 'primereact/inputtextarea'
import { ZButton } from '@/components/button/button'
import { useToast } from '@/components/toast/hook/useToast'
import { CreateProductReviewRequest } from '@/app/product/service/request'
import type { OrderOneType, Product } from '../../../service/types'

type ReviewProduct = Pick<Product, 'id' | 'uid' | 'name'>

function ReviewProductCard({ product }: { product: ReviewProduct }) {
  const [rating, setRating] = useState(0)
  const [comment, setComment] = useState('')
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const { showToast } = useToast()

  const handleSubmit = async () => {
    if (!rating) {
      showToast('Selecione de 1 a 5 estrelas para continuar.', 'error')
      return
    }

    setLoading(true)
    try {
      await CreateProductReviewRequest(product.uid, {
        rating,
        comment: comment.trim() || undefined
      })
      setSubmitted(true)
      showToast('Avaliação enviada com sucesso!', 'success')
    } catch (error: unknown) {
      const apiMessage =
        error instanceof AxiosError
          ? (error.response?.data as { message?: string } | undefined)?.message
          : undefined
      showToast(
        apiMessage ?? 'Não foi possível enviar a avaliação.',
        'error'
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <article className="order-review-product">
      <div className="order-review-product-heading">
        <span className="order-review-product-icon" aria-hidden="true">
          <i className="pi pi-shopping-bag" />
        </span>
        <div>
          <strong>{product.name}</strong>
          <span>
            <i className="pi pi-check-circle" aria-hidden="true" />
            Entrega concluída
          </span>
        </div>
      </div>

      {submitted ? (
        <div className="order-review-success" role="status">
          <i className="pi pi-check" aria-hidden="true" />
          <div>
            <strong>Avaliação publicada</strong>
            <p>Obrigado por compartilhar sua experiência com outros clientes.</p>
          </div>
          <button type="button" onClick={() => setSubmitted(false)}>Editar</button>
        </div>
      ) : (
        <div className="order-review-form">
          <fieldset>
            <legend>Como foi sua experiência com o produto?</legend>
            <div className="order-review-stars">
              {[1, 2, 3, 4, 5].map(star => (
                <button
                  aria-label={`${star} ${star === 1 ? 'estrela' : 'estrelas'}`}
                  aria-pressed={star <= rating}
                  className={star <= rating ? 'selected' : ''}
                  key={star}
                  onClick={() => setRating(star)}
                  type="button"
                >
                  <i className={`pi ${star <= rating ? 'pi-star-fill' : 'pi-star'}`} />
                </button>
              ))}
              <span aria-live="polite">
                {rating ? `${rating} de 5` : 'Selecione uma nota'}
              </span>
            </div>
          </fieldset>

          <label htmlFor={`review-comment-${product.id}`}>
            Conte mais sobre sua experiência <span>(opcional)</span>
          </label>
          <InputTextarea
            autoResize
            id={`review-comment-${product.id}`}
            maxLength={1000}
            onChange={event => setComment(event.target.value)}
            placeholder="Qualidade, acabamento, conforto..."
            rows={4}
            value={comment}
          />
          <div className="order-review-form-footer">
            <span>{comment.length}/1000 caracteres</span>
            <ZButton
              disabled={!rating || loading}
              icon="pi pi-send"
              label="Enviar avaliação"
              loading={loading}
              onClick={() => void handleSubmit()}
              type="button"
            />
          </div>
        </div>
      )}
    </article>
  )
}

export function OrderReviews({ order }: { order: OrderOneType }) {
  const completedProducts = new Map<number, ReviewProduct>()

  order.order_services
    .filter(service => service.status === 'COMPLETED')
    .flatMap(service => service.order_item)
    .forEach(item => {
      if (item.product.uid) completedProducts.set(item.product.id, item.product)
    })

  const products = Array.from(completedProducts.values())
  const isPaidOrder = order.payment_status === 'PAID'
  const hasActiveDelivery = order.order_services.some(service =>
    ['CONFIRMED', 'IN_PRODUCTION', 'SHIPPED'].includes(service.status)
  )

  if (!isPaidOrder) return null

  if (!products.length) {
    if (!hasActiveDelivery) return null

    return (
      <section className="order-reviews order-reviews-locked" aria-labelledby="order-reviews-title">
        <span className="order-reviews-lock" aria-hidden="true">
          <i className="pi pi-lock" />
        </span>
        <div>
          <h2 id="order-reviews-title">Avaliação disponível após a entrega</h2>
          <p>Quando o recebimento for confirmado, você poderá avaliar os produtos deste pedido aqui.</p>
        </div>
      </section>
    )
  }

  return (
    <section className="order-reviews" aria-labelledby="order-reviews-title">
      <header className="order-reviews-header">
        <div>
          <span>Sua compra chegou</span>
          <h2 id="order-reviews-title">Avalie seus produtos</h2>
          <p>Sua opinião ajuda outras pessoas a escolher e melhora a experiência na Zr0.</p>
        </div>
        <i className="pi pi-comments" aria-hidden="true" />
      </header>
      <div className="order-reviews-products">
        {products.map(product => (
          <ReviewProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  )
}
