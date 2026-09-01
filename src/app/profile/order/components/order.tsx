'use client'

import { useMemo, useState } from 'react'
import { ZButton } from '@/components/button/button'
import ZDropdown from '@/components/dropdown/dropdown'
import { ZEmptyState } from '@/components/empty_state/empty_state'
import ZIconField from '@/components/icon_field/icon_field'
import ZInputText from '@/components/input/input'
import ZInputIcon from '@/components/input_icon/input_icon'
import ZSkeleton from '@/components/skeleton/skeleton'
import TitlePage from '@/components/title_page/title_page'
import { useFetchRequestOrderUser } from '../service/query'
import { OrderUser } from '../service/types'
import CardOrder from './card_order/card_order'
import './order.css'

const PAYMENT_OPTIONS = [
  { label: 'Todos os pagamentos', value: 'ALL' },
  { label: 'Pagamento pendente', value: 'PENDING' },
  { label: 'Pagamento em processamento', value: 'PROCESSING' },
  { label: 'Pagamento aprovado', value: 'PAID' },
  { label: 'Falha no pagamento', value: 'FAILED' },
  { label: 'Pagamento estornado', value: 'REFUNDED' },
]

export default function OrderComponent() {
  const [search, setSearch] = useState('')
  const [paymentStatus, setPaymentStatus] = useState('ALL')
  const { data, isLoading, isError, refetch } = useFetchRequestOrderUser()
  const orderUser: OrderUser | undefined = data

  const filteredOrders = useMemo(() => {
    const term = search.trim().toLocaleLowerCase('pt-BR')
    return (orderUser?.order ?? []).filter(order => {
      const matchesPayment = paymentStatus === 'ALL' || order.payment_status === paymentStatus
      if (!matchesPayment) return false
      if (!term) return true
      const products = order.order_services.flatMap(service => service.order_item).map(item => item.product.name)
      return [order.uid, ...products].some(value => value.toLocaleLowerCase('pt-BR').includes(term))
    })
  }, [orderUser, paymentStatus, search])

  return (
    <section className="orders-page" aria-labelledby="orders-title">
      <div className="orders-page__heading" id="orders-title">
        <TitlePage title="Seus pedidos" description="Acompanhe pagamentos, produção e entrega dos seus pedidos." />
      </div>

      {!isLoading && !isError && (orderUser?.order.length ?? 0) > 0 && (
        <div className="orders-page__toolbar" aria-label="Filtros dos pedidos">
          <ZIconField iconPosition="left" className="orders-page__search">
            <ZInputIcon className="pi pi-search" />
            <ZInputText
              value={search}
              onChange={event => setSearch(event.target.value)}
              placeholder="Buscar por pedido ou produto"
              aria-label="Buscar por pedido ou produto"
            />
          </ZIconField>
          <ZDropdown
            value={paymentStatus}
            options={PAYMENT_OPTIONS}
            onChange={event => setPaymentStatus(event.value)}
            aria-label="Filtrar por pagamento"
            className="orders-page__filter"
          />
          <span className="orders-page__count" aria-live="polite">
            {filteredOrders.length} {filteredOrders.length === 1 ? 'pedido' : 'pedidos'}
          </span>
        </div>
      )}

      {isLoading && (
        <div className="orders-page__grid" aria-label="Carregando pedidos">
          {[1, 2, 3, 4, 5, 6].map(item => <ZSkeleton key={item} height="25rem" borderRadius="16px" />)}
        </div>
      )}

      {isError && (
        <ZEmptyState
          icon="pi pi-exclamation-circle"
          title="Não foi possível carregar seus pedidos"
          description="Confira sua conexão e tente novamente."
          action={<ZButton label="Tentar novamente" icon="pi pi-refresh" onClick={() => refetch()} />}
        />
      )}

      {!isLoading && !isError && (orderUser?.order.length ?? 0) === 0 && (
        <ZEmptyState
          icon="pi pi-shopping-bag"
          title="Você ainda não fez nenhum pedido"
          description="Seus pedidos aparecerão aqui depois que você concluir uma compra."
        />
      )}

      {!isLoading && !isError && (orderUser?.order.length ?? 0) > 0 && filteredOrders.length === 0 && (
        <ZEmptyState
          icon="pi pi-search"
          title="Nenhum pedido encontrado"
          description="Altere a busca ou o filtro de pagamento para ver outros pedidos."
          action={<ZButton label="Limpar filtros" outlined onClick={() => { setSearch(''); setPaymentStatus('ALL') }} />}
        />
      )}

      {filteredOrders.length > 0 && (
        <div className="orders-page__grid">
          {filteredOrders.map(item => <CardOrder item={item} key={item.id} />)}
        </div>
      )}
    </section>
  )
}
