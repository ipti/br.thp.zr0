// Store do fluxo de Pedido de Encomenda. Isolado de src/app/cart/ — nunca
// importar useProductionOrderStore em src/app/cart/ nem useCartStore/useCartStepsStore
// aqui. Persiste sob uma chave de localStorage própria (PRODUCTION_ORDER_KEY),
// nunca a mesma ('cart_state') usada pelo carrinho de Pronta Entrega.
import { create } from 'zustand'
import {
  ProductionShipment,
  ProductionOrderPlan,
  SimulateProductionOrderResponse,
  SimulationMode,
} from '../service/types'

export interface ProductionOrderContextType {
  productId?: string
  desiredQuantity?: number
  simulationMode?: SimulationMode
  simulation?: SimulateProductionOrderResponse
  shipmentsSelected?: ProductionShipment[]
}

export interface ProductionOrderStore {
  productionOrder: ProductionOrderContextType
  setDesiredQuantity: (productId: string, quantity: number) => void
  setSimulation: (simulation: SimulateProductionOrderResponse) => void
  selectSimulationMode: (mode: SimulationMode) => void
  getSelectedPlan: () => ProductionOrderPlan | undefined
  reset: () => void
}

const PRODUCTION_ORDER_KEY = 'production_order_state'

function persist(state: ProductionOrderContextType) {
  localStorage.setItem(PRODUCTION_ORDER_KEY, JSON.stringify(state))
}

export const useProductionOrderStore = create<ProductionOrderStore>((set, get) => ({
  productionOrder:
    typeof window !== 'undefined'
      ? JSON.parse(localStorage.getItem(PRODUCTION_ORDER_KEY) || '{}')
      : {},

  setDesiredQuantity: (productId: string, quantity: number) => {
    const updated = { ...get().productionOrder, productId, desiredQuantity: quantity }
    persist(updated)
    set({ productionOrder: updated })
  },

  setSimulation: (simulation: SimulateProductionOrderResponse) => {
    const updated = { ...get().productionOrder, simulation }
    persist(updated)
    set({ productionOrder: updated })
  },

  selectSimulationMode: (mode: SimulationMode) => {
    const current = get().productionOrder
    const plan = mode === 'COST' ? current.simulation?.costPlan : current.simulation?.deadlinePlan
    const updated = {
      ...current,
      simulationMode: mode,
      shipmentsSelected: plan?.shipments,
    }
    persist(updated)
    set({ productionOrder: updated })
  },

  getSelectedPlan: (): ProductionOrderPlan | undefined => {
    const { simulation, simulationMode } = get().productionOrder
    if (!simulation || !simulationMode) return undefined
    return simulationMode === 'COST' ? simulation.costPlan : simulation.deadlinePlan
  },

  reset: () => {
    localStorage.removeItem(PRODUCTION_ORDER_KEY)
    set({ productionOrder: {} })
  },
}))
