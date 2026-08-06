// Controller do fluxo de Pedido de Encomenda. Isolado de src/app/cart/ —
// nunca importar daqui em src/app/cart/ nem o inverso.
import { logout } from '@/service/localstorage'
import Swal from 'sweetalert2'
import { SetStateAction } from 'react'
import { AxiosError } from 'axios'
import {
  SimulateProductionOrderPayload,
  ReserveProductionOrderPayload,
  ReserveProductionOrderResult,
  CreateProductionOrderPayload,
  CreateProductionOrderResult,
  SimulateProductionOrderResponse,
} from './types'
import {
  SimulateProductionOrderRequest,
  ReserveProductionOrderRequest,
  CreateProductionOrderRequest,
} from './request'

function handleError(
  erros: AxiosError<{ message?: string }>,
  setLoading: (value: SetStateAction<boolean>) => void
) {
  console.log(erros)
  setLoading(false)

  Swal.fire({
    title: erros?.response?.data?.message ?? 'Erro inesperado',
    icon: 'error',
  })
  if (erros?.response?.status === 401) {
    logout()
    window.location.reload()
  }
  throw erros
}

export function ProductionOrderController() {
  function SimulateProductionOrderAction(
    body: SimulateProductionOrderPayload,
    setSimulation: (data: SimulateProductionOrderResponse) => void,
    setLoading: (value: SetStateAction<boolean>) => void
  ) {
    SimulateProductionOrderRequest(body)
      .then((data) => {
        setSimulation(data.data)
        setLoading(false)
      })
      .catch((erros) => handleError(erros, setLoading))
  }

  function ReserveProductionOrderAction(
    body: ReserveProductionOrderPayload,
    onSuccess: (data: ReserveProductionOrderResult) => void,
    setLoading: (value: SetStateAction<boolean>) => void
  ) {
    ReserveProductionOrderRequest(body)
      .then((data) => {
        onSuccess(data.data)
        setLoading(false)
      })
      .catch((erros) => handleError(erros, setLoading))
  }

  function CreateProductionOrderAction(
    body: CreateProductionOrderPayload,
    onSuccess: (data: CreateProductionOrderResult) => void,
    setLoading: (value: SetStateAction<boolean>) => void
  ) {
    CreateProductionOrderRequest(body)
      .then((data) => {
        onSuccess(data.data)
        setLoading(false)
      })
      .catch((erros) => handleError(erros, setLoading))
  }

  return {
    SimulateProductionOrderAction,
    ReserveProductionOrderAction,
    CreateProductionOrderAction,
  }
}
