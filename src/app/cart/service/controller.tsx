'use client'

import { LoginRequest } from '@/app/auth/login/service/request'
import { SignUpRequest } from '@/app/auth/sign-up/service/request'
import { login } from '@/service/localstorage'
import Cookies from 'js-cookie'
import { useRouter } from 'next/navigation'
import { Dispatch, SetStateAction } from 'react'
import {
  CreateAddressCustomerRequest,
  CreateOrderRequest,
  GetOrderRequest,
  VerifyEmailRequest
} from './request'
import {
  CreateAdressCustomer,
  CreateOrder,
  LoginTypes,
  SignUpTypes,
  VerifyEmailReturn,
  VerifyEmailTypes
} from './types'
import Swal from 'sweetalert2'
import { useCartStore } from '@/service/store/cart_store'

export function CartController(setErros?: Dispatch<SetStateAction<string>>) {
  const exp90 = new Date()
  exp90.setMinutes(exp90.getMinutes() + 90)
  const removeItem = useCartStore(state => state.removeItem)

  const history = useRouter()

  function VerifyEmailAction(
    body: VerifyEmailTypes,
    handleStatusEmail: (value: VerifyEmailReturn) => void
  ) {
    VerifyEmailRequest(body)
      .then(data => {
        setErros('')
        handleStatusEmail(data.data)
      })
      .catch(erros => {
        console.log(erros.response.data.message)
        setErros(erros.response.data.message)
      })
  }

  function LoginCartAction(
    body: LoginTypes,
    handleActiveIndex: (i: number) => void
  ) {
    LoginRequest(body)
      .then(data => {
        setErros('')
        Cookies.set('access_token', data.data.access_token, { expires: exp90 })
        login(data.data.access_token)
        handleActiveIndex(2)
        // if (data.data.userRegistered.role === PerfisEnum.CUSTOMER) {
        //     history.history.push("/")
        // } else {
        //     history.history.push("/seller/home")
        // }
        // window.location.reload()
        // history.history.push("/")
      })
      .catch(erros => {
        console.log(erros.response.data.message)
        setErros(erros.response.data.message)
      })
  }

  function SignUpCartAction(
    body: SignUpTypes,
    handleStatusEmail: (value: VerifyEmailReturn | undefined) => void
  ) {
    SignUpRequest(body)
      .then(data => {
        setErros('')
        handleStatusEmail(undefined)
        // if (data.data.userRegistered.role === PerfisEnum.CUSTOMER) {
        //     history.history.push("/")
        // } else {
        //     history.history.push("/seller/home")
        // }
        // window.location.reload()
        // history.history.push("/")
      })
      .catch(erros => {
        handleStatusEmail(undefined)

        console.log(erros.response.data.message)
        setErros(erros.response.data.message)
      })
  }

  function CreateAddressCustomer(body: CreateAdressCustomer) {
    CreateAddressCustomerRequest(body)
      .then(data => {
        setErros('')
        // if (data.data.userRegistered.role === PerfisEnum.CUSTOMER) {
        //     history.history.push("/")
        // } else {
        //     history.history.push("/seller/home")
        // }
        // window.location.reload()
        // history.history.push("/")
      })
      .catch(erros => {
        console.log(erros.response.data.message)
        setErros(erros.response.data.message)
      })
  }

  function CreateOrder(
    body: CreateOrder,
    handleReturn?: (value: any) => void,
    successAction?: (orders: any) => void
  ) {
    CreateOrderRequest(body)
      .then(data => {
        const itemBuy = body.items.map(item => item)

        handleReturn && handleReturn(data.data)

        for (const i of itemBuy) {
          removeItem(i.productId)
        }

        Swal.fire({
          text: 'Pedido realizado com sucesso!',
          icon: 'success'
        })
        successAction(data.data.orders)
      })
      .catch(erros => {
        handleReturn && handleReturn(erros.response.data)
        console.log(erros.response.data.message)
        Swal.fire({
          text: erros.response.data.message,
          icon: 'error'
        })
      })
  }

  async function GetOrdersInformation(orders: { id: number; uid: string }[]) {
    const exit: any[] = []

    for (const item of orders) {
      try {
        const response = await GetOrderRequest(item.id)
        const data = response.data
        console.log({ data })
        exit.push(data)
      } catch {
        console.error({ error: true, order: item.id })
      }
    }

    return exit
  }
  return {
    VerifyEmailAction,
    LoginCartAction,
    SignUpCartAction,
    CreateAddressCustomer,
    CreateOrder,
    GetOrdersInformation
  }
}
