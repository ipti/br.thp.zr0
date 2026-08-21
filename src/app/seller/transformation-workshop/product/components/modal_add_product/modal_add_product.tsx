import { useFetchRequestProduct } from '@/app/seller/product/service/query'
import { ProductType } from '@/app/seller/product/type'
import { ZButton } from '@/components/button/button'
import ZDialog from '@/components/dialog/dialog'
import ZDropdown from '@/components/dropdown/dropdown'
import ZInputNumber from '@/components/input_number/input_number'
import { getIdTw } from '@/service/cookies'
import { Form, Formik } from 'formik'
import { useSearchParams } from 'next/navigation'
import * as Yup from 'yup'
import { ProductTransfWorkshopController } from '../../service/controller'
import { useFetchRequestProductTransformationWorkshop } from '../../service/query'
import './modal_add_product.css'

interface FormValues {
  product: ProductType | null
  quantity: number
}

const schema = Yup.object({
  product: Yup.object().nullable().required('Selecione um produto.'),
  quantity: Yup.number()
    .typeError('Informe uma quantidade válida.')
    .integer('Use apenas números inteiros.')
    .min(0, 'A quantidade não pode ser negativa.')
    .max(999999, 'A quantidade máxima é 999.999 unidades.')
    .required('Informe o estoque inicial.'),
})

const initialValues: FormValues = { product: null, quantity: 0 }

export default function ModalAddProduct({
  onHide,
  visible,
}: {
  visible: boolean
  onHide: () => void
}) {
  const searchParams = useSearchParams()
  const workshopId = searchParams.get('idOt') ?? getIdTw()
  const { data: productsRequest, isLoading: loadingProducts } =
    useFetchRequestProduct()
  const { data: workshopProducts } =
    useFetchRequestProductTransformationWorkshop(workshopId)
  const controller = ProductTransfWorkshopController()

  const linkedProductIds = new Set<number>(
    (workshopProducts?.inventory ?? []).map(
      (item: { product_fk: number }) => item.product_fk,
    ),
  )
  const availableProducts = ((productsRequest ?? []) as ProductType[]).filter(
    product => !linkedProductIds.has(product.id),
  )

  return (
    <ZDialog
      visible={visible}
      onHide={onHide}
      header="Adicionar produto à OT"
      className="add-product-dialog"
      dismissableMask={false}
    >
      {visible && (
        <Formik<FormValues>
          initialValues={initialValues}
          validationSchema={schema}
          onSubmit={async (values, { setStatus }) => {
            if (!workshopId || !values.product) {
              setStatus('Selecione uma oficina e um produto para continuar.')
              return
            }

            setStatus(undefined)
            try {
              await controller.AddProductTransfWorkshopAction({
                product_fk: values.product.id,
                tw_fk: Number(workshopId),
                quantity: values.quantity,
              })
              onHide()
            } catch {
              setStatus(
                'Não foi possível concluir. Revise os dados e tente novamente.',
              )
            }
          }}
        >
          {({
            values,
            errors,
            touched,
            status,
            isSubmitting,
            setFieldTouched,
            setFieldValue,
          }) => (
            <Form className="add-product-form" noValidate>
              <p className="add-product-intro">
                Vincule um produto ao catálogo da oficina e informe quantas
                unidades já estão disponíveis para pronta entrega.
              </p>

              <div className="add-product-field">
                <label htmlFor="ot-product">Produto</label>
                <ZDropdown
                  inputId="ot-product"
                  options={availableProducts}
                  optionLabel="name"
                  filter
                  filterBy="name,description"
                  value={values.product}
                  onChange={event => {
                    setFieldValue('product', event.value)
                    setFieldTouched('product', true, false)
                  }}
                  placeholder={
                    loadingProducts
                      ? 'Carregando produtos...'
                      : 'Busque e selecione um produto'
                  }
                  emptyMessage="Nenhum produto disponível para adicionar"
                  emptyFilterMessage="Nenhum produto encontrado"
                  disabled={
                    loadingProducts || availableProducts.length === 0
                  }
                  className={
                    errors.product && touched.product ? 'p-invalid' : undefined
                  }
                  itemTemplate={(product: ProductType) => (
                    <div className="add-product-option">
                      <strong>{product.name}</strong>
                      {product.description && (
                        <small>{product.description}</small>
                      )}
                    </div>
                  )}
                  aria-describedby={
                    errors.product && touched.product
                      ? 'ot-product-error'
                      : 'ot-product-help'
                  }
                />
                <small id="ot-product-help">
                  Produtos já vinculados a esta OT não aparecem na lista.
                </small>
                {errors.product && touched.product && (
                  <small
                    id="ot-product-error"
                    className="add-product-error"
                    role="alert"
                  >
                    {String(errors.product)}
                  </small>
                )}
              </div>

              <div className="add-product-field">
                <label htmlFor="ot-initial-stock">Estoque inicial</label>
                <ZInputNumber
                  inputId="ot-initial-stock"
                  name="quantity"
                  value={values.quantity}
                  onValueChange={event =>
                    setFieldValue('quantity', event.value ?? 0)
                  }
                  onBlur={() => setFieldTouched('quantity', true)}
                  min={0}
                  max={999999}
                  minFractionDigits={0}
                  maxFractionDigits={0}
                  useGrouping={false}
                  showButtons
                  buttonLayout="horizontal"
                  decrementButtonIcon="pi pi-minus"
                  incrementButtonIcon="pi pi-plus"
                  invalid={Boolean(errors.quantity && touched.quantity)}
                  aria-describedby={
                    errors.quantity && touched.quantity
                      ? 'ot-quantity-error'
                      : 'ot-quantity-help'
                  }
                />
                <small id="ot-quantity-help">
                  Use 0 se o produto ainda não possui unidades prontas. Isso
                  não altera a capacidade de produção mensal.
                </small>
                {errors.quantity && touched.quantity && (
                  <small
                    id="ot-quantity-error"
                    className="add-product-error"
                    role="alert"
                  >
                    {errors.quantity}
                  </small>
                )}
              </div>

              {availableProducts.length === 0 && !loadingProducts && (
                <div className="add-product-empty" role="status">
                  <i className="pi pi-check-circle" aria-hidden="true" />
                  Todos os produtos já estão vinculados a esta oficina.
                </div>
              )}

              {status && (
                <div className="add-product-submit-error" role="alert">
                  {status}
                </div>
              )}

              <div className="add-product-actions">
                <ZButton
                  type="button"
                  label="Cancelar"
                  text
                  onClick={onHide}
                  disabled={isSubmitting}
                />
                <ZButton
                  type="submit"
                  label="Adicionar produto"
                  icon="pi pi-plus"
                  loading={isSubmitting}
                  disabled={
                    !workshopId ||
                    !values.product ||
                    loadingProducts ||
                    availableProducts.length === 0 ||
                    Boolean(errors.quantity)
                  }
                />
              </div>
            </Form>
          )}
        </Formik>
      )}
    </ZDialog>
  )
}
