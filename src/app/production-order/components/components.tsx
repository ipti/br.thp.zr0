// Orquestrador do wizard de Pedido de Encomenda. Isolado de src/app/cart/ —
// ZSteps próprio, activeIndex local, sem depender de ?index= do carrinho.
'use client'
import ZSteps from '@/components/steps/steps'
import { ProductOne } from '@/app/seller/product/one/service/type'
import { MenuItem } from 'primereact/menuitem'
import { useState } from 'react'
import QuantityForm from './quantity_form'
import SimulationStep from './simulation_step'
import Confirmation from './confirmation'

export default function ProductionOrderSteps({
  product,
}: {
  product: ProductOne | null
}) {
  const [activeIndex, setActiveIndex] = useState(0)

  const handleActiveIndex = (i: number) => {
    setActiveIndex(i)
  }

  const items: MenuItem[] = [
    { label: 'Quantidade' },
    { label: 'Simulação' },
    { label: 'Confirmação' },
  ]

  return (
    <div className="container">
      <ZSteps model={items} activeIndex={activeIndex} readOnly />
      <div className="p-3" />
      {activeIndex === 0 && (
        <QuantityForm product={product} handleActiveIndex={handleActiveIndex} />
      )}
      {activeIndex === 1 && (
        <SimulationStep handleActiveIndex={handleActiveIndex} />
      )}
      {activeIndex === 2 && (
        <Confirmation handleActiveIndex={handleActiveIndex} />
      )}
    </div>
  )
}
