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
            <div className="shipment-accordion-header">
              <span className="shipment-accordion-index">
                <i className="pi pi-building" aria-hidden="true" />
              </span>
              <span>
                <strong>{shipment.workshopName}</strong>
                <small>{shipment.quantity} unidades nesta remessa</small>
              </span>
              <span className="shipment-accordion-header-cost">
                {shipment.freightCost.toLocaleString('pt-BR', {
                  style: 'currency',
                  currency: 'BRL',
                })}
              </span>
            </div>
          )}
        >
          <div className="shipment-accordion-content">
            <div className="shipment-accordion-logistics">
              <div>
                <span>Transportadora</span>
                <strong>{shipment.carrier ?? 'A definir'}</strong>
              </div>
              <div>
                <span>Serviço de entrega</span>
                <strong>{shipment.service ?? 'A definir'}</strong>
              </div>
              <div>
                <span>Frete da remessa</span>
                <strong>
                  {shipment.freightCost.toLocaleString('pt-BR', {
                    style: 'currency',
                    currency: 'BRL',
                  })}
                </strong>
              </div>
            </div>
            <ZTimeline items={buildTimeline(shipment)} direction="horizontal" />
            <p className="shipment-accordion-disclaimer">
              <i className="pi pi-info-circle" /> Datas estimadas com base na
              capacidade atual da oficina e no serviço de entrega selecionado.
            </p>
          </div>
        </AccordionTab>
      ))}
    </Accordion>
  )
}
