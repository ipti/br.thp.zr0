'use client'

import { acessCreatePage } from '@/app/middleware/use_create'
import { acessUpdatePage } from '@/app/middleware/use_update'
import { ProfileContext } from '@/app/seller/context/profile.context'
import { ZButton } from '@/components/button/button'
import ZDialog from '@/components/dialog/dialog'
import { ZEmptyState } from '@/components/empty_state/empty_state'
import ZIconField from '@/components/icon_field/icon_field'
import ZInputText from '@/components/input/input'
import ZInputIcon from '@/components/input_icon/input_icon'
import ZInputNumber from '@/components/input_number/input_number'
import { getIdTw } from '@/service/cookies'
import { Column } from 'primereact/column'
import { DataTable } from 'primereact/datatable'
import Image from 'next/image'
import { usePathname, useSearchParams } from 'next/navigation'
import { useContext, useMemo, useState } from 'react'
import { ProductTransfWorkshopController } from '../service/controller'
import { useFetchRequestProductTransformationWorkshop } from '../service/query'
import './list.css'
import ModalAddProduct from './modal_add_product/modal_add_product'

interface InventoryItem {
  transformation_workshop_fk: number
  product_fk: number
  quantity: number
  product: {
    name: string
    product_image?: Array<{ img_url?: string | null }>
  }
}

const MAX_STOCK = 999999

export default function ListPage() {
  const [addDialogVisible, setAddDialogVisible] = useState(false)
  const [editing, setEditing] = useState<InventoryItem | null>(null)
  const [editedQuantity, setEditedQuantity] = useState(0)
  const [saving, setSaving] = useState(false)
  const [saveError, setSaveError] = useState<string | null>(null)
  const [search, setSearch] = useState('')
  const searchParams = useSearchParams()
  const { profile } = useContext(ProfileContext)
  const pathname = usePathname()
  const createPermission = acessCreatePage(profile, pathname)
  const updatePermission = acessUpdatePage(profile, pathname)
  const workshopId = searchParams.get('idOt') ?? getIdTw()
  const controller = ProductTransfWorkshopController()
  const { data, isLoading, isFetching, isError, refetch } =
    useFetchRequestProductTransformationWorkshop(workshopId)

  const inventory = useMemo(
    () => (data?.inventory ?? []) as InventoryItem[],
    [data?.inventory],
  )
  const normalizedSearch = search.trim().toLocaleLowerCase('pt-BR')
  const filteredInventory = useMemo(
    () =>
      normalizedSearch
        ? inventory.filter(item =>
            item.product.name
              .toLocaleLowerCase('pt-BR')
              .includes(normalizedSearch),
          )
        : inventory,
    [inventory, normalizedSearch],
  )
  const totalUnits = inventory.reduce(
    (total, item) => total + (item.quantity ?? 0),
    0,
  )

  const openQuantityDialog = (item: InventoryItem) => {
    setEditing(item)
    setEditedQuantity(item.quantity ?? 0)
    setSaveError(null)
  }

  const closeQuantityDialog = () => {
    if (saving) return
    setEditing(null)
    setSaveError(null)
  }

  const quantityIsInvalid =
    !Number.isInteger(editedQuantity) ||
    editedQuantity < 0 ||
    editedQuantity > MAX_STOCK
  const stockDelta = editing ? editedQuantity - editing.quantity : 0

  const saveQuantity = async () => {
    if (!editing || quantityIsInvalid || stockDelta === 0) return

    setSaving(true)
    setSaveError(null)
    try {
      await controller.UpdateProductTransfWorkshopAction(
        {
          product_fk: editing.product_fk,
          tw_fk: editing.transformation_workshop_fk,
          quantity: editedQuantity,
        },
        stockDelta,
      )
      setEditing(null)
    } catch {
      setSaveError('Não foi possível atualizar o estoque. Tente novamente.')
    } finally {
      setSaving(false)
    }
  }

  const emptyContent = search ? (
    <ZEmptyState
      icon="pi pi-search"
      title="Nenhum produto encontrado"
      description="Revise o termo pesquisado ou limpe a busca."
      action={
        <ZButton label="Limpar busca" text onClick={() => setSearch('')} />
      }
    />
  ) : (
    <ZEmptyState
      icon="pi pi-box"
      title="Nenhum produto no estoque"
      description="Adicione o primeiro produto para começar a controlar as quantidades desta OT."
      action={
        createPermission ? (
          <ZButton
            label="Adicionar produto"
            icon="pi pi-plus"
            onClick={() => setAddDialogVisible(true)}
          />
        ) : undefined
      }
    />
  )

  return (
    <section className="inventory-panel" aria-labelledby="inventory-title">
      <header className="inventory-header">
        <div>
          <h1 id="inventory-title">Estoque da OT</h1>
          <p>
            Consulte os produtos disponíveis e mantenha as quantidades
            atualizadas.
          </p>
        </div>
        {createPermission && (
          <ZButton
            icon="pi pi-plus"
            onClick={() => setAddDialogVisible(true)}
            label="Adicionar produto"
          />
        )}
      </header>

      <div className="inventory-summary" aria-label="Resumo do estoque">
        <div>
          <span>Produtos cadastrados</span>
          <strong>{inventory.length.toLocaleString('pt-BR')}</strong>
        </div>
        <div>
          <span>Unidades disponíveis</span>
          <strong>{totalUnits.toLocaleString('pt-BR')}</strong>
        </div>
      </div>

      <div className="inventory-toolbar">
        <label className="sr-only" htmlFor="inventory-search">
          Buscar produto no estoque
        </label>
        <ZIconField iconPosition="left" className="inventory-search">
          <ZInputIcon className="pi pi-search" />
          <ZInputText
            id="inventory-search"
            value={search}
            onChange={event => setSearch(event.target.value)}
            placeholder="Buscar por nome do produto"
          />
        </ZIconField>
        {isFetching && !isLoading && (
          <span className="inventory-updating" role="status">
            <i className="pi pi-spin pi-spinner" aria-hidden="true" />
            Atualizando
          </span>
        )}
      </div>

      {isError ? (
        <div className="inventory-error" role="alert">
          <div>
            <strong>Não foi possível carregar o estoque.</strong>
            <span>Confira sua conexão e tente novamente.</span>
          </div>
          <ZButton
            label="Tentar novamente"
            icon="pi pi-refresh"
            outlined
            onClick={() => refetch()}
          />
        </div>
      ) : (
        <DataTable
          value={filteredInventory}
          dataKey="product_fk"
          loading={isLoading}
          loadingIcon="pi pi-spin pi-spinner"
          emptyMessage={emptyContent}
          paginator={filteredInventory.length > 8}
          rows={8}
          rowsPerPageOptions={[8, 16, 24]}
          paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown"
          currentPageReportTemplate="{first} a {last} de {totalRecords} produtos"
          className="inventory-table"
          tableStyle={{ minWidth: '42rem' }}
          scrollable
        >
          <Column
            header="Produto"
            body={(item: InventoryItem) => <ProductCell item={item} />}
          />
          <Column
            header="Quantidade disponível"
            body={(item: InventoryItem) => (
              <span
                className={`inventory-quantity${item.quantity === 0 ? ' is-empty' : ''}`}
              >
                {item.quantity.toLocaleString('pt-BR')}{' '}
                {item.quantity === 1 ? 'unidade' : 'unidades'}
              </span>
            )}
          />
          {updatePermission && (
            <Column
              header="Ações"
              body={(item: InventoryItem) => (
                <ZButton
                  label="Alterar quantidade"
                  icon="pi pi-pencil"
                  text
                  onClick={() => openQuantityDialog(item)}
                  aria-label={`Alterar quantidade de ${item.product.name}`}
                />
              )}
              className="inventory-actions-column"
            />
          )}
        </DataTable>
      )}

      {createPermission && (
        <ModalAddProduct
          visible={addDialogVisible}
          onHide={() => setAddDialogVisible(false)}
        />
      )}

      <ZDialog
        visible={Boolean(editing)}
        onHide={closeQuantityDialog}
        header="Alterar quantidade em estoque"
        className="inventory-edit-dialog"
        dismissableMask={false}
        closable={!saving}
      >
        {editing && (
          <div className="inventory-edit-form">
            <div className="inventory-edit-product">
              <ProductCell item={editing} />
              <span>
                Estoque atual:{' '}
                <strong>{editing.quantity.toLocaleString('pt-BR')}</strong>
              </span>
            </div>

            <div className="inventory-edit-field">
              <label htmlFor="inventory-new-quantity">Nova quantidade</label>
              <ZInputNumber
                inputId="inventory-new-quantity"
                value={editedQuantity}
                onValueChange={event => setEditedQuantity(event.value ?? 0)}
                min={0}
                max={MAX_STOCK}
                minFractionDigits={0}
                maxFractionDigits={0}
                useGrouping={false}
                showButtons
                buttonLayout="horizontal"
                decrementButtonIcon="pi pi-minus"
                incrementButtonIcon="pi pi-plus"
                invalid={quantityIsInvalid}
                aria-describedby="inventory-quantity-help"
              />
              <small id="inventory-quantity-help">
                Informe o total disponível após esta movimentação.
              </small>
              {quantityIsInvalid && (
                <small className="inventory-field-error" role="alert">
                  Informe um número inteiro entre 0 e 999.999.
                </small>
              )}
            </div>

            {!quantityIsInvalid && stockDelta !== 0 && (
              <div className="inventory-movement" role="status">
                <i
                  className={stockDelta > 0 ? 'pi pi-arrow-up' : 'pi pi-arrow-down'}
                  aria-hidden="true"
                />
                Serão {stockDelta > 0 ? 'adicionadas' : 'retiradas'}{' '}
                <strong>{Math.abs(stockDelta).toLocaleString('pt-BR')}</strong>{' '}
                {Math.abs(stockDelta) === 1 ? 'unidade' : 'unidades'}.
              </div>
            )}

            {saveError && (
              <div className="inventory-save-error" role="alert">
                {saveError}
              </div>
            )}

            <div className="inventory-dialog-actions">
              <ZButton
                label="Cancelar"
                text
                onClick={closeQuantityDialog}
                disabled={saving}
              />
              <ZButton
                label="Salvar quantidade"
                icon="pi pi-check"
                onClick={saveQuantity}
                loading={saving}
                disabled={quantityIsInvalid || stockDelta === 0}
              />
            </div>
          </div>
        )}
      </ZDialog>
    </section>
  )
}

function ProductCell({ item }: { item: InventoryItem }) {
  const imageUrl = item.product.product_image?.[0]?.img_url

  return (
    <div className="inventory-product">
      <div className="inventory-product-image">
        {imageUrl ? (
          <Image src={imageUrl} alt="" width={56} height={56} unoptimized />
        ) : (
          <i className="pi pi-image" aria-hidden="true" />
        )}
      </div>
      <div>
        <strong>{item.product.name}</strong>
        <span>Produto #{item.product_fk}</span>
      </div>
    </div>
  )
}
