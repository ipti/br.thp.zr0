'use client'
import http from '@/service/axios'
import {
  CreateAdressCustomer,
  CreateOrder,
  CouponValidation,
  CreateStockReservation,
  VerifyEmailTypes
} from './types'
import { logout } from '@/service/cookies'

export const VerifyEmailRequest = async (body: VerifyEmailTypes) => {
  return await http.post('/users/get-email', { email: body.email })
}

export const CreateAddressCustomerRequest = async (
  body: CreateAdressCustomer
) => {
  return await http.post('/users/get-email', body)
}

export const CreateOrderRequest = async (body: CreateOrder) => {
  return await http.post('/orders', body)
}

export const ReserveStockRequest = async (body: CreateStockReservation) => {
  return await http.post('/checkout/reserve', body)
}

export const GetOrderRequest = async (id: number) => {
  return await http.get(`/orders/${id}`)
}

export const ValidateCouponRequest = async (
  code: string,
  orderTotal: number
): Promise<CouponValidation> => {
  const response = await http.get(
    `/coupon/validate/${encodeURIComponent(code)}?orderTotal=${orderTotal}`
  )
  return response.data
}

export const getAddressOneRequest = async (id: number) => {
  return await http
    .get('/address-customer/' + id)
    .then(response => response.data)
    .catch(err => {
      if (err.response.status === 401) {
        logout()
        window.location.reload()
      }
      throw err
    })
}

export const requestProductOneQuantity = (id: string) => {
  const path = '/product-bff/quantity/' + id
  return http
    .get(path)
    .then(response => response.data)
    .catch(err => {
      if (err.response.status === 401) {
      }
      throw err
    })
}
