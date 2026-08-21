'use client'

import { getIdTw } from '@/service/cookies'
import { useQuery } from '@tanstack/react-query'
import { useMemo, useState } from 'react'
import { ZButton } from '@/components/button/button'
import ZCheckbox from '@/components/checkbox/checkbox'
import ZDialog from '@/components/dialog/dialog'
import ZDropdown from '@/components/dropdown/dropdown'
import ZIconField from '@/components/icon_field/icon_field'
import ZInputText from '@/components/input/input'
import ZInputIcon from '@/components/input_icon/input_icon'
import ZInputNumber from '@/components/input_number/input_number'
import {
  createProduction,
  requestCapacities,
  requestProductions,
  updateCapacity,
  updateProduction,
} from './service/request'
import { ProductionCapacity, ProductionItem, ProductionStatus } from './service/types'
import './production.css'

const STATUS_LABEL: Record<ProductionStatus, string> = {
  QUEUED: 'Na fila',
  IN_PROGRESS: 'Em produção',
  DONE: 'Concluída',
  CANCELLED: 'Cancelada',
}

const STATUS_OPTIONS = [
  { label: 'Todos os status', value: 'ALL' },
  ...Object.entries(STATUS_LABEL).map(([value, label]) => ({ value, label })),
]

const formatDate = (date?: string | null) =>
  date
    ? new Intl.DateTimeFormat('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' }).format(
        new Date(date),
      )
    : 'Sem prazo'

function ProgressBar({ item }: { item: ProductionItem }) {
  const percentage = item.quantity
    ? Math.min(100, Math.round((item.produced_quantity / item.quantity) * 100))
    : 0

  return (
    <div className="production-progress" aria-label={`${percentage}% produzido`}>
      <div className="production-progress-track">
        <span style={{ width: `${percentage}%` }} />
      </div>
      <small>{percentage}%</small>
    </div>
  )
}

export function isEligibleProduction(item: ProductionItem) {
  if (item.production_status === 'CANCELLED') return false

  const orderService = item.order_item?.order_service
  if (!orderService) return true

  return (
    orderService.order?.payment_status === 'PAID' &&
    !['CANCELLED', 'SOLITED_CANCELLATION'].includes(orderService.status)
  )
}

export default function ProductionPage() {
  const workshopId = getIdTw()
  const [statusFilter, setStatusFilter] = useState<'ALL' | ProductionStatus>('ALL')
  const [search, setSearch] = useState('')
  const [editing, setEditing] = useState<ProductionItem | null>(null)
  const [creating, setCreating] = useState(false)
  const [produced, setProduced] = useState(0)
  const [newProduct, setNewProduct] = useState<number | null>(null)
  const [newQuantity, setNewQuantity] = useState(1)
  const [saving, setSaving] = useState(false)
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  const productionQuery = useQuery(
    ['seller-production', workshopId],
    () => requestProductions(workshopId!),
    { enabled: Boolean(workshopId) },
  )
  const capacityQuery = useQuery(
    ['seller-production-capacity', workshopId],
    () => requestCapacities(workshopId!),
    { enabled: Boolean(workshopId) },
  )

  const productions = useMemo(
    () => (productionQuery.data?.data ?? []).filter(isEligibleProduction),
    [productionQuery.data],
  )
  const capacities = useMemo(() => capacityQuery.data?.data ?? [], [capacityQuery.data])
  const activeCapacities = capacities.filter(item => item.active)

  const filtered = productions.filter(item => {
    const status = item.production_status ?? 'QUEUED'
    const term = search.trim().toLocaleLowerCase('pt-BR')
    const order = item.order_item?.order_service?.order
    const matchesSearch =
      !term ||
      item.product.name.toLocaleLowerCase('pt-BR').includes(term) ||
      order?.uid.toLocaleLowerCase('pt-BR').includes(term) ||
      order?.user.name.toLocaleLowerCase('pt-BR').includes(term)
    return matchesSearch && (statusFilter === 'ALL' || status === statusFilter)
  })

  const queued = productions.filter(item => (item.production_status ?? 'QUEUED') === 'QUEUED').length
  const inProgress = productions.filter(item => item.production_status === 'IN_PROGRESS').length
  const remaining = productions
    .filter(item => !['DONE', 'CANCELLED'].includes(item.production_status ?? 'QUEUED'))
    .reduce((total, item) => total + Math.max(0, item.quantity - item.produced_quantity), 0)
  const monthlyCapacity = activeCapacities.reduce((total, item) => total + item.monthly_capacity, 0)

  const refresh = async () => {
    await Promise.all([productionQuery.refetch(), capacityQuery.refetch()])
  }

  const openProgress = (item: ProductionItem) => {
    setEditing(item)
    setProduced(item.produced_quantity)
    setFeedback(null)
  }

  const saveProgress = async () => {
    if (!editing || produced < 0 || produced > editing.quantity) return
    setSaving(true)
    setFeedback(null)
    try {
      await updateProduction(editing.id, { producedQuantity: produced })
      await refresh()
      setEditing(null)
      setFeedback({ type: 'success', text: 'Progresso da produção atualizado.' })
    } catch {
      setFeedback({ type: 'error', text: 'Não foi possível atualizar o progresso. Tente novamente.' })
    } finally {
      setSaving(false)
    }
  }

  const saveNewProduction = async () => {
    if (!workshopId || !newProduct || newQuantity < 1) return
    setSaving(true)
    setFeedback(null)
    try {
      await createProduction({
        idTransformationWorkshop: Number(workshopId),
        idProduct: Number(newProduct),
        quantity: newQuantity,
        productionStatus: 'QUEUED',
      })
      await refresh()
      setCreating(false)
      setNewProduct(null)
      setNewQuantity(1)
      setFeedback({ type: 'success', text: 'Produção manual incluída na fila.' })
    } catch {
      setFeedback({ type: 'error', text: 'Não foi possível incluir a produção. Confira a capacidade do produto.' })
    } finally {
      setSaving(false)
    }
  }

  const saveCapacity = async (capacity: ProductionCapacity, monthly: number, active: boolean) => {
    if (!workshopId || monthly < 1) return
    setSaving(true)
    setFeedback(null)
    try {
      await updateCapacity(Number(workshopId), capacity.product_fk, {
        monthlyCapacity: monthly,
        active,
      })
      await capacityQuery.refetch()
      setFeedback({ type: 'success', text: `Capacidade de ${capacity.product.name} atualizada.` })
    } catch {
      setFeedback({ type: 'error', text: 'Não foi possível atualizar a capacidade mensal.' })
    } finally {
      setSaving(false)
    }
  }

  if (!workshopId) {
    return <div className="production-empty">Selecione uma Oficina de Transformação para gerenciar a produção.</div>
  }

  return (
    <div className="production-page">
      <header className="production-heading">
        <div>
          <span className="production-eyebrow">Operação da oficina</span>
          <h1>Produção da OT</h1>
          <p>Acompanhe encomendas, lançamentos internos, capacidade e o que ainda falta produzir.</p>
        </div>
        <ZButton
          label="Adicionar produção"
          icon="pi pi-plus"
          onClick={() => { setCreating(true); setFeedback(null) }}
          disabled={activeCapacities.length === 0}
          title={activeCapacities.length === 0 ? 'Ative a capacidade de um produto primeiro' : undefined}
        />
      </header>

      {feedback && (
        <div className={`production-feedback ${feedback.type}`} role={feedback.type === 'error' ? 'alert' : 'status'}>
          <i className={`pi ${feedback.type === 'error' ? 'pi-exclamation-circle' : 'pi-check-circle'}`} />
          {feedback.text}
        </div>
      )}

      <section className="production-metrics" aria-label="Resumo da produção">
        <article><i className="pi pi-list" /><div><strong>{queued}</strong><span>ordens na fila</span></div></article>
        <article><i className="pi pi-cog" /><div><strong>{inProgress}</strong><span>ordens em produção</span></div></article>
        <article><i className="pi pi-box" /><div><strong>{remaining}</strong><span>unidades faltantes</span></div></article>
        <article><i className="pi pi-chart-line" /><div><strong>{monthlyCapacity}</strong><span>unidades/mês ativas</span></div></article>
      </section>

      <section className="production-panel" aria-labelledby="production-queue-title">
        <div className="production-panel-heading">
          <div><h2 id="production-queue-title">Fila de produção</h2><p>Pedidos recebidos e produções internas, ordenados pelo prazo.</p></div>
          <div className="production-filters">
            <label className="sr-only" htmlFor="production-search">Buscar produção</label>
            <ZIconField iconPosition="left" className="production-search">
              <ZInputIcon className="pi pi-search" />
              <ZInputText
                id="production-search"
                value={search}
                onChange={event => setSearch(event.target.value)}
                placeholder="Pedido, cliente ou produto"
              />
            </ZIconField>
            <label className="sr-only" htmlFor="production-status">Filtrar por status</label>
            <ZDropdown
              inputId="production-status"
              value={statusFilter}
              options={STATUS_OPTIONS}
              optionLabel="label"
              optionValue="value"
              onChange={event => setStatusFilter(event.value as typeof statusFilter)}
              className="production-status-filter"
              ariaLabel="Filtrar por status"
              pt={{
                trigger: { 'aria-label': 'Abrir filtro de status' },
                select: { 'aria-label': 'Filtrar por status' },
              }}
            />
          </div>
        </div>

        {productionQuery.isLoading ? (
          <div className="production-state" role="status"><i className="pi pi-spin pi-spinner" /> Carregando produção...</div>
        ) : productionQuery.isError ? (
          <div className="production-state error" role="alert">Não foi possível carregar a fila. <ZButton label="Tentar novamente" text onClick={() => productionQuery.refetch()} /></div>
        ) : filtered.length === 0 ? (
          <div className="production-state"><i className="pi pi-inbox" /><strong>Nenhuma produção encontrada</strong><span>Ajuste os filtros ou adicione um lançamento interno.</span></div>
        ) : (
          <div className="production-list">
            {filtered.map(item => {
              const status = item.production_status ?? 'QUEUED'
              const order = item.order_item?.order_service?.order
              const missing = Math.max(0, item.quantity - item.produced_quantity)
              return (
                <article className="production-row" key={item.id}>
                  <div className="production-row-main">
                    <div className="production-row-title">
                      <span className={`production-status ${status.toLowerCase()}`}>{STATUS_LABEL[status]}</span>
                      <div><h3>{item.product.name}</h3><p>{order ? `Pedido ${order.uid} · ${order.user.name}` : `Lançamento interno #${item.id}`}</p></div>
                    </div>
                    <ProgressBar item={item} />
                  </div>
                  <dl className="production-row-data">
                    <div><dt>Planejado</dt><dd>{item.quantity}</dd></div>
                    <div><dt>Produzido</dt><dd>{item.produced_quantity}</dd></div>
                    <div><dt>Falta</dt><dd className="production-missing">{missing}</dd></div>
                    <div><dt>Prazo</dt><dd>{formatDate(item.date_end)}</dd></div>
                  </dl>
                  <ZButton label="Atualizar" icon="pi pi-pencil" outlined onClick={() => openProgress(item)} disabled={status === 'CANCELLED'} />
                </article>
              )
            })}
          </div>
        )}
      </section>

      <section className="production-panel" aria-labelledby="capacity-title">
        <div className="production-panel-heading"><div><h2 id="capacity-title">Capacidade mensal por produto</h2><p>Informe o ritmo real da oficina. Esse valor define os prazos das novas encomendas.</p></div></div>
        {capacityQuery.isLoading ? <div className="production-state" role="status">Carregando capacidades...</div> : capacities.length === 0 ? (
          <div className="production-state"><strong>Nenhum produto vinculado à oficina</strong><span>Adicione produtos à OT antes de configurar a capacidade.</span></div>
        ) : (
          <div className="capacity-list">
            {capacities.map(capacity => <CapacityRow key={capacity.product_fk} capacity={capacity} saving={saving} onSave={saveCapacity} />)}
          </div>
        )}
      </section>

      <ZDialog visible={Boolean(editing)} onHide={() => setEditing(null)} header="Atualizar produção" className="production-dialog">
        {editing && <div className="production-form">
          <div className="production-form-summary"><strong>{editing.product.name}</strong><span>Total planejado: {editing.quantity} unidades</span></div>
          <label htmlFor="produced-quantity">Quantidade já produzida</label>
          <ZInputNumber
            inputId="produced-quantity"
            min={0}
            value={produced}
            useGrouping={false}
            maxFractionDigits={0}
            onValueChange={event => setProduced(event.value ?? 0)}
            invalid={produced > editing.quantity}
            aria-describedby="produced-help"
          />
          <small id="produced-help">Faltam {Math.max(0, editing.quantity - produced)} unidades. Ao atingir o total, a produção será concluída.</small>
          {produced > editing.quantity && <p className="field-error" role="alert">O produzido não pode ultrapassar o total planejado.</p>}
          <div className="production-dialog-actions"><ZButton label="Cancelar" text onClick={() => setEditing(null)} /><ZButton label="Salvar progresso" icon="pi pi-check" loading={saving} disabled={produced < 0 || produced > editing.quantity} onClick={saveProgress} /></div>
        </div>}
      </ZDialog>

      <ZDialog visible={creating} onHide={() => setCreating(false)} header="Adicionar produção interna" className="production-dialog">
        <div className="production-form">
          <p>O lançamento será incluído na mesma fila das encomendas e terá o prazo calculado pela capacidade atual.</p>
          <label htmlFor="new-production-product">Produto</label>
          <ZDropdown
            inputId="new-production-product"
            value={newProduct}
            options={activeCapacities}
            optionLabel="product.name"
            optionValue="product_fk"
            placeholder="Selecione um produto"
            onChange={event => setNewProduct(event.value)}
            ariaLabel="Produto da produção interna"
            pt={{
              trigger: { 'aria-label': 'Abrir lista de produtos' },
              select: { 'aria-label': 'Produto da produção interna' },
            }}
            itemTemplate={(capacity: ProductionCapacity) => (
              <div className="production-product-option">
                <strong>{capacity.product.name}</strong>
                <small>{capacity.monthly_capacity} unidades/mês</small>
              </div>
            )}
          />
          <label htmlFor="new-production-quantity">Quantidade planejada</label>
          <ZInputNumber
            inputId="new-production-quantity"
            min={1}
            value={newQuantity}
            useGrouping={false}
            maxFractionDigits={0}
            showButtons
            onValueChange={event => setNewQuantity(event.value ?? 1)}
          />
          <div className="production-dialog-actions"><ZButton label="Cancelar" text onClick={() => setCreating(false)} /><ZButton label="Adicionar à fila" icon="pi pi-plus" loading={saving} disabled={!newProduct || newQuantity < 1} onClick={saveNewProduction} /></div>
        </div>
      </ZDialog>
    </div>
  )
}

function CapacityRow({ capacity, saving, onSave }: { capacity: ProductionCapacity; saving: boolean; onSave: (capacity: ProductionCapacity, monthly: number, active: boolean) => Promise<void> }) {
  const [monthly, setMonthly] = useState(Math.max(1, capacity.monthly_capacity))
  const [active, setActive] = useState(capacity.active)
  const dirty = monthly !== capacity.monthly_capacity || active !== capacity.active

  return <article className="capacity-row">
    <div><strong>{capacity.product.name}</strong><span>{active ? 'Recebendo novas encomendas' : 'Capacidade pausada'}</span></div>
    <label className="capacity-field"><span>Unidades por mês</span><ZInputNumber inputId={`capacity-${capacity.product_fk}`} min={1} value={monthly} useGrouping={false} maxFractionDigits={0} onValueChange={event => setMonthly(event.value ?? 1)} className="capacity-number" /></label>
    <div className="capacity-switch"><ZCheckbox inputId={`capacity-active-${capacity.product_fk}`} checked={active} onChange={event => setActive(Boolean(event.checked))} /><label htmlFor={`capacity-active-${capacity.product_fk}`}>Ativa</label></div>
    <ZButton label="Salvar" outlined loading={saving && dirty} disabled={!dirty || monthly < 1 || saving} onClick={() => onSave(capacity, monthly, active)} />
  </article>
}
