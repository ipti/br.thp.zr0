// Detalhamento por remessa/OT do plano selecionado. Isolado de src/app/cart/.
'use client'
import { Accordion, AccordionTab } from 'primereact/accordion'
import { TimelineItem, ZTimeline } from '@/components/timeline/timeline'
import ZSkeleton from '@/components/skeleton/skeleton'
import { ProductionOrderPlan, ProductionShipment } from '../service/types'
import './shipment_accordion.css'

export function ShipmentAccordionSkeleton() {
  return (
    <Accordion activeIndex={0}>
      {[0, 1].map(key => (
        <AccordionTab
          key={key}
          header={() => <ZSkeleton width="12rem" height="1.2rem" />}
        >
          <ZSkeleton width="100%" height="4rem" />
        </AccordionTab>
      ))}
    </Accordion>
  )
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('pt-BR')
}

function buildTimeline(shipment: ProductionShipment): TimelineItem[] {
  return [
    {
      id: 'confirmed',
      label: 'Pedido confirmado',
      icon: <i className="pi pi-cart-arrow-down" />,
      status: 'completed',
    },
    {
      id: 'ready',
      label: `Produção estimada: ${formatDate(shipment.readyAt)}`,
      icon: <i className="pi pi-cog" />,
      status: 'pending',
    },
    {
      id: 'delivery',
      label: `Entrega estimada: ${formatDate(shipment.deliveryAt)}`,
      icon: <i className="pi pi-truck" />,
      status: 'pending',
    },
  ]
}

export default function ShipmentAccordion({
  plan,
}: {
  plan: ProductionOrderPlan
}) {
  return (
    <Accordion activeIndex={0} key={plan.mode}>
      {plan.shipments.map(shipment => (
        <AccordionTab
          key={shipment.workshopId}
          header={() => (
            <span className="shipment-accordion-header">
              {shipment.workshopName} — {shipment.quantity} unidades
            </span>
          )}
        >
          <ZTimeline items={buildTimeline(shipment)} direction="vertical" />
          <p className="shipment-accordion-cost">
            Frete desta remessa: R$ {shipment.freightCost.toFixed(2)}
            {shipment.service ? ` (${shipment.service})` : ''}
          </p>
          <p className="shipment-accordion-disclaimer">
            Prazo estimado de produção, não é uma garantia contratual.
          </p>
        </AccordionTab>
      ))}
    </Accordion>
  )
}
