'use client'

import { MouseEvent, useEffect, useState } from 'react'
import Cookies from 'js-cookie'
import { useToast } from '@/components/toast/hook/useToast'
import {
  AddWishlistRequest,
  RemoveWishlistRequest,
} from '../service/request'
import { useFetchWishlistStatus } from '../service/query'

export function WishlistButton({ productUid }: { productUid: string }) {
  const isLoggedIn = !!Cookies.get('access_token')
  const { showToast } = useToast()
  const { data, refetch } = useFetchWishlistStatus(productUid, isLoggedIn)
  const [wished, setWished] = useState(false)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    setWished(data?.wished ?? false)
  }, [data])

  const handleToggle = async (event?: MouseEvent<HTMLButtonElement>) => {
    event?.stopPropagation()

    if (!isLoggedIn) {
      showToast('Faça login para salvar na wishlist.', 'error')
      return
    }

    setLoading(true)
    try {
      if (wished) {
        await RemoveWishlistRequest(productUid)
        setWished(false)
        showToast('Removido da wishlist!', 'success')
      } else {
        await AddWishlistRequest(productUid)
        setWished(true)
        showToast('Adicionado à wishlist!', 'success')
      }
      void refetch()
    } catch {
      showToast('Não foi possível atualizar a wishlist.', 'error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <button
      type="button"
      onClick={event => {
        void handleToggle(event)
      }}
      disabled={loading}
      style={{
        border: 'none',
        background: 'transparent',
        cursor: 'pointer',
        fontSize: '1.2rem',
      }}
      aria-label={wished ? 'Remover da wishlist' : 'Adicionar à wishlist'}
    >
      <i
        className={wished ? 'pi pi-heart-fill' : 'pi pi-heart'}
        style={{ color: wished ? '#d62828' : '#666' }}
      />
    </button>
  )
}
