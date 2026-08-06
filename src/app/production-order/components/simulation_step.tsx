// Passo 2 da jornada de Encomenda ("Simulação"). Isolado de src/app/cart/ —
// nunca importar useCartStore/useCartStepsStore aqui.
'use client'
import { useEffect, useState } from 'react'
import { ZButton } from '@/components/button/button'
import { ZEmptyState } from '@/components/empty_state/empty_state'
import { ProductionOrderController } from '../service/controller'
import { useProductionOrderStore } from '../zustand/zustand'
import { SimulationMode } from '../service/types'
import PlanSelector, { PlanSelectorSkeleton } from './plan_selector'
import ShipmentAccordion, { ShipmentAccordionSkeleton } from './shipment_accordion'

export default function SimulationStep({
  handleActiveIndex,
}: {
  handleActiveIndex: (i: number) => void
}) {
  const { SimulateProductionOrderAction } = ProductionOrderController()
  const productionOrder = useProductionOrderStore(state => state.productionOrder)
  const setSimulation = useProductionOrderStore(state => state.setSimulation)
  const selectSimulationMode = useProductionOrderStore(
    state => state.selectSimulationMode
  )

  const [loading, setLoading] = useState(true)
  const [switchingMode, setSwitchingMode] = useState(false)

  useEffect(() => {
    if (!productionOrder.productId || !productionOrder.desiredQuantity) return

    setLoading(true)
    SimulateProductionOrderAction(
      {
        productId: productionOrder.productId,
        quantity: productionOrder.desiredQuantity,
      },
      setSimulation,
      setLoading
    )
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [productionOrder.productId, productionOrder.desiredQuantity])

  const handleSelectMode = (mode: SimulationMode) => {
    if (switchingMode) return
    setSwitchingMode(true)
    selectSimulationMode(mode)
    setTimeout(() => setSwitchingMode(false), 150)
  }

  if (!productionOrder.productId || !productionOrder.desiredQuantity) {
    return (
      <p>
        Informe a quantidade desejada no passo anterior antes de simular a
        encomenda.
      </p>
    )
  }

  if (loading) {
    return (
      <div>
        <PlanSelectorSkeleton />
        <div className="p-3" />
        <ShipmentAccordionSkeleton />
      </div>
    )
  }

  const simulation = productionOrder.simulation

  if (!simulation) {
    return (
      <ZEmptyState
        icon="pi pi-exclamation-circle"
        title="Não foi possível carregar a simulação"
        description="Tente novamente em alguns instantes."
        action={
          <ZButton
            label="Voltar"
            severity="secondary"
            text
            onClick={() => handleActiveIndex(0)}
          />
        }
      />
    )
  }

  if (simulation.unavailable) {
    return (
      <ZEmptyState
        icon="pi pi-exclamation-triangle"
        title="Sem capacidade de produção disponível"
        description="No momento não há oficina com capacidade de produção cadastrada para este produto. Tente novamente mais tarde ou escolha outro produto."
        action={
          <ZButton
            label="Voltar"
            severity="secondary"
            text
            onClick={() => handleActiveIndex(0)}
          />
        }
      />
    )
  }

  const selectedPlan =
    productionOrder.simulationMode === 'COST'
      ? simulation.costPlan
      : productionOrder.simulationMode === 'DEADLINE'
        ? simulation.deadlinePlan
        : undefined

  return (
    <div>
      <PlanSelector
        costPlan={simulation.costPlan}
        deadlinePlan={simulation.deadlinePlan}
        selectedMode={productionOrder.simulationMode}
        onSelect={handleSelectMode}
        disabled={switchingMode}
      />
      <div className="p-3" />
      {switchingMode && <ShipmentAccordionSkeleton />}
      {!switchingMode && selectedPlan && <ShipmentAccordion plan={selectedPlan} />}
      <div className="p-3" />
      <div className="flex flex-row gap-2">
        <ZButton
          label="Voltar"
          severity="secondary"
          text
          onClick={() => handleActiveIndex(0)}
        />
        <ZButton
          label="Continuar"
          disabled={!productionOrder.simulationMode || switchingMode}
          onClick={() => handleActiveIndex(2)}
        />
      </div>
    </div>
  )
}
