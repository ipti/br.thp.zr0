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
import Link from 'next/link'
import './production_order.css'

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
    <div className="production-order-page">
      <div className="production-order-breadcrumb">
        <Link href={product ? `/product/${product.uid}` : '/product'}>
          Produtos
        </Link>
        <i className="pi pi-angle-right" aria-hidden="true" />
        <span>Comprar sob encomenda</span>
      </div>

      <header className="production-order-heading">
        <div>
          <span className="production-order-eyebrow">Produção sob demanda</span>
          <h1>Comprar sob encomenda</h1>
          <p>
            Escolha a quantidade, compare custo e prazo entre as oficinas e
            confirme a melhor opção para você.
          </p>
        </div>
        <div className="production-order-heading-icon" aria-hidden="true">
          <i className="pi pi-cog" />
        </div>
      </header>

      <section className="production-order-wizard">
        <div className="production-order-steps">
          <ZSteps model={items} activeIndex={activeIndex} readOnly />
        </div>
        <div className="production-order-step-content">
          {activeIndex === 0 && (
            <QuantityForm
              product={product}
              handleActiveIndex={handleActiveIndex}
            />
          )}
          {activeIndex === 1 && (
            <SimulationStep handleActiveIndex={handleActiveIndex} />
          )}
          {activeIndex === 2 && (
            <Confirmation
              product={product}
              handleActiveIndex={handleActiveIndex}
            />
          )}
        </div>
      </section>
    </div>
  )
}
