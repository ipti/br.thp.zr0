// Seletor de modo de simulação (Custo x Prazo). Isolado de src/app/cart/.
'use client'
import ZCard from '@/components/card/card'
import ZRadioButton from '@/components/radio_button/radio_button'
import ZSkeleton from '@/components/skeleton/skeleton'
import { ProductionOrderPlan, SimulationMode } from '../service/types'
import { SIMULATION_MODE_LABEL } from '../service/constants'
import './plan_selector.css'

function formatMaxDeliveryAt(iso: string): string {
  return new Date(iso).toLocaleDateString('pt-BR')
}

export function PlanSelectorSkeleton() {
  return (
    <div className="grid plan-selector">
      {[0, 1].map(key => (
        <div className="col-12 md:col-6" key={key}>
          <ZCard className="plan-card">
            <ZSkeleton width="60%" height="1.5rem" className="mb-2" />
            <ZSkeleton width="40%" height="2rem" className="mb-2" />
            <ZSkeleton width="70%" height="1rem" className="mb-2" />
            <ZSkeleton width="30%" height="1rem" />
          </ZCard>
        </div>
      ))}
    </div>
  )
}

export default function PlanSelector({
  costPlan,
  deadlinePlan,
  selectedMode,
  onSelect,
  disabled,
}: {
  costPlan: ProductionOrderPlan
  deadlinePlan: ProductionOrderPlan
  selectedMode?: SimulationMode
  onSelect: (mode: SimulationMode) => void
  disabled?: boolean
}) {
  const plans: { mode: SimulationMode; plan: ProductionOrderPlan; badge: string }[] = [
    { mode: 'COST', plan: costPlan, badge: 'Mais barato' },
    { mode: 'DEADLINE', plan: deadlinePlan, badge: 'Mais rápido' },
  ]

  const handleSelect = (mode: SimulationMode) => {
    if (disabled) return
    onSelect(mode)
  }

  return (
    <div className={`grid plan-selector ${disabled ? 'plan-selector--disabled' : ''}`}>
      {plans.map(({ mode, plan, badge }) => (
        <div className="col-12 md:col-6" key={mode}>
          <ZCard
            className={`plan-card ${selectedMode === mode ? 'plan-card--selected' : ''}`}
            onClick={() => handleSelect(mode)}
          >
            <div className="plan-card-header">
              <ZRadioButton
                name="simulationMode"
                checked={selectedMode === mode}
                disabled={disabled}
                onChange={() => handleSelect(mode)}
              />
              <h2 className="plan-card-title">{SIMULATION_MODE_LABEL[mode]}</h2>
              <span className="plan-card-badge">{badge}</span>
            </div>
            <p className="plan-card-cost">R$ {plan.totalCost.toFixed(2)}</p>
            <p className="plan-card-deadline">
              Entrega estimada até {formatMaxDeliveryAt(plan.maxDeliveryAt)}
            </p>
            <p className="plan-card-shipments">
              {plan.shipments.length}{' '}
              {plan.shipments.length === 1 ? 'remessa' : 'remessas'}
            </p>
          </ZCard>
        </div>
      ))}
    </div>
  )
}
