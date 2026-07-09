'use client'

import Cookies from 'js-cookie'
import { useState } from 'react'
import { ZButton } from '@/components/button/button'
import ZInputText from '@/components/input/input'
import { useToast } from '@/components/toast/hook/useToast'
import { useFetchProductReviews } from '../service/query'
import { CreateProductReviewRequest } from '../service/request'

export function ProductReviews({ productUid }: { productUid: string }) {
  const { data, refetch } = useFetchProductReviews(productUid)
  const [rating, setRating] = useState(5)
  const [comment, setComment] = useState('')
  const [loading, setLoading] = useState(false)
  const { showToast } = useToast()

  const handleReview = async () => {
    if (!Cookies.get('access_token')) {
      showToast('Faça login para avaliar este produto.', 'error')
      return
    }

    setLoading(true)
    try {
      await CreateProductReviewRequest(productUid, { rating, comment })
      setComment('')
      showToast('Avaliação enviada com sucesso!', 'success')
      void refetch()
    } catch (error: any) {
      showToast(
        error?.response?.data?.message ?? 'Não foi possível enviar a avaliação.',
        'error'
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="mt-5">
      <h3>Avaliações</h3>
      <div className="flex gap-2 align-items-center mt-3 mb-3">
        <label>Nota</label>
        <select
          value={rating}
          onChange={e => setRating(Number(e.target.value))}
        >
          {[5, 4, 3, 2, 1].map(value => (
            <option key={value} value={value}>
              {value} estrela{value > 1 ? 's' : ''}
            </option>
          ))}
        </select>
      </div>
      <div className="flex flex-column gap-2 mb-4">
        <ZInputText
          value={comment}
          onChange={e => setComment(e.target.value)}
          placeholder="Conte como foi sua experiência"
        />
        <ZButton
          type="button"
          label="Enviar avaliação"
          loading={loading}
          onClick={() => {
            void handleReview()
          }}
        />
      </div>

      <div className="flex flex-column gap-3">
        {data?.data?.map(review => (
          <div key={review.id} className="card p-3">
            <div className="flex justify-content-between">
              <strong>{review.user.name}</strong>
              <span>{'★'.repeat(review.rating)}</span>
            </div>
            {review.comment ? <p className="mt-2">{review.comment}</p> : null}
          </div>
        ))}
        {!data?.data?.length ? <p>Ainda não há avaliações para este produto.</p> : null}
      </div>
    </div>
  )
}
