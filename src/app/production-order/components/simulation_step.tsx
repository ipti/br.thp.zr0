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
    if (
      !productionOrder.productId ||
      !productionOrder.desiredQuantity ||
      !productionOrder.destinationZipCode
    ) return

    setLoading(true)
    SimulateProductionOrderAction(
      {
        productId: productionOrder.productId,
        quantity: productionOrder.desiredQuantity,
        destinationZipCode: productionOrder.destinationZipCode,
      },
      setSimulation,
      setLoading
    )
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    productionOrder.productId,
    productionOrder.desiredQuantity,
    productionOrder.destinationZipCode,
  ])

  const handleSelectMode = (mode: SimulationMode) => {
    if (switchingMode) return
    setSwitchingMode(true)
    selectSimulationMode(mode)
    setTimeout(() => setSwitchingMode(false), 150)
  }

  if (
    !productionOrder.productId ||
    !productionOrder.desiredQuantity ||
    !productionOrder.destinationZipCode
  ) {
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
      <div className="production-order-section-heading simulation-heading">
        <div>
          <h2>Compare as opções de produção</h2>
          <p>
            Selecione o plano que melhor equilibra frete e prazo para a sua
            encomenda.
          </p>
        </div>
        <div className="simulation-request-summary">
          <span><i className="pi pi-box" /> {productionOrder.desiredQuantity} unidades</span>
          <span><i className="pi pi-map-marker" /> CEP {productionOrder.destinationZipCode}</span>
        </div>
      </div>
      <PlanSelector
        costPlan={simulation.costPlan}
        deadlinePlan={simulation.deadlinePlan}
        selectedMode={productionOrder.simulationMode}
        onSelect={handleSelectMode}
        disabled={switchingMode}
      />
      <div className="simulation-detail-heading">
        <div>
          <span>Detalhamento do plano</span>
          <h3>
            {productionOrder.simulationMode
              ? productionOrder.simulationMode === 'COST'
                ? 'Menor custo'
                : 'Menor prazo'
              : 'Selecione uma opção acima'}
          </h3>
        </div>
        <p>Veja onde cada parte da encomenda será produzida e entregue.</p>
      </div>
      {switchingMode && <ShipmentAccordionSkeleton />}
      {!switchingMode && selectedPlan && <ShipmentAccordion plan={selectedPlan} />}
      <div className="production-order-actions">
        <ZButton
          label="Voltar"
          severity="secondary"
          text
          onClick={() => handleActiveIndex(0)}
        />
        <ZButton
          label="Continuar"
          icon="pi pi-arrow-right"
          iconPos="right"
          disabled={!productionOrder.simulationMode || switchingMode}
          onClick={() => handleActiveIndex(2)}
        />
      </div>
    </div>
  )
}
