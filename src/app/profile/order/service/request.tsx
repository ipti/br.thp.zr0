import http from '@/service/axios'
import { logout } from '@/service/cookies'
import type { OrderUpdate } from './types'

function handleUnauthorized(error: unknown) {
  const status = (error as { response?: { status?: number } }).response?.status
  if (status === 401) {
    logout()
    window.location.reload()
  }
  throw error
}

export const requestOrderUser = () =>
  http
    .get('/user-bff/order')
    .then(response => response.data)
    .catch(handleUnauthorized)

export const requestOrderOne = (id?: string) => {
  if (!id) return undefined

  return http
    .get(`/orders/${id}`)
    .then(response => response.data)
    .catch(handleUnauthorized)
}

export const requestOrderUpdate = (id: string, body: OrderUpdate) =>
  http
    .patch(`/orders/${id}`, body)
    .then(response => response.data)
    .catch(handleUnauthorized)
