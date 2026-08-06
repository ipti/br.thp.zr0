import ZBadge from './badge'
import './sale_type_badge.css'

export type SaleType = 'PRONTA_ENTREGA' | 'ENCOMENDA'

const SALE_TYPE_LABEL: Record<SaleType, string> = {
  PRONTA_ENTREGA: 'Pronta entrega',
  ENCOMENDA: 'Sob encomenda',
}

export function ZSaleTypeBadge({ saleType }: { saleType: SaleType }) {
  return (
    <ZBadge
      value={SALE_TYPE_LABEL[saleType]}
      className={`sale-type-badge sale-type-badge--${saleType.toLowerCase()}`}
    />
  )
}
