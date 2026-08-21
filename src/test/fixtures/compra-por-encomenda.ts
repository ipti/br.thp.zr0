// Fixtures do cenário motivador (escola): produto com OT A (35/mês) e OT B
// (15/mês) com capacidade de produção ativa. Usadas pelos handlers do MSW e
// pelos testes de integração da jornada de Encomenda.
import {
  SimulateProductionOrderResponse,
  ReserveProductionOrderResult,
  CreateProductionOrderResult,
} from '@/app/production-order/service/types'

export const SCHOOL_PRODUCT_UID = 'chair-uid-escola'

export function buildSchoolSimulation(
  quantity: number
): SimulateProductionOrderResponse {
  const readyAtCost = new Date('2026-09-05T00:00:00.000Z').toISOString()
  const deliveryAtCost = new Date('2026-09-10T00:00:00.000Z').toISOString()

  return {
    costPlan: {
      mode: 'COST',
      shipments: [
        {
          workshopId: 1,
          workshopName: 'OT A',
          quantity,
          freightCost: 18,
          carrier: 'Correios',
          service: 'PAC',
          readyAt: readyAtCost,
          deliveryAt: deliveryAtCost,
        },
      ],
      totalCost: 18,
      maxDeliveryAt: deliveryAtCost,
    },
    deadlinePlan: {
      mode: 'DEADLINE',
      shipments: [
        {
          workshopId: 1,
          workshopName: 'OT A',
          quantity: Math.ceil(quantity * 0.7),
          freightCost: 18,
          carrier: 'Correios',
          service: 'PAC',
          readyAt: readyAtCost,
          deliveryAt: deliveryAtCost,
        },
        {
          workshopId: 2,
          workshopName: 'OT B',
          quantity: Math.floor(quantity * 0.3),
          freightCost: 25,
          carrier: 'Correios',
          service: 'SEDEX',
          readyAt: new Date('2026-09-02T00:00:00.000Z').toISOString(),
          deliveryAt: new Date('2026-09-07T00:00:00.000Z').toISOString(),
        },
      ],
      totalCost: 43,
      maxDeliveryAt: deliveryAtCost,
    },
  }
}

export const SCHOOL_SIMULATION_UNAVAILABLE: SimulateProductionOrderResponse = {
  costPlan: { mode: 'COST', shipments: [], totalCost: 0, maxDeliveryAt: '' },
  deadlinePlan: {
    mode: 'DEADLINE',
    shipments: [],
    totalCost: 0,
    maxDeliveryAt: '',
  },
  unavailable: true,
}

export const SCHOOL_RESERVE_RESULT: ReserveProductionOrderResult = {
  expiresAt: new Date('2026-09-01T00:15:00.000Z').toISOString(),
  shipments: [
    {
      workshopId: 1,
      quantity: 30,
      estimatedReadyAt: new Date('2026-09-05T00:00:00.000Z').toISOString(),
    },
  ],
}

export const SCHOOL_CREATE_RESULT: CreateProductionOrderResult = {
  message: 'Pedido de encomenda criado com sucesso',
  orders: [{ id: 101, uid: 'ZR-202609-ENCOMENDA01' }],
}
