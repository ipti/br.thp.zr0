// Formulário de quantidade desejada — passo 1 da jornada de Encomenda.
// Isolado de src/app/cart/ — nunca importar useCartStore/useCartStepsStore aqui.
'use client'
import { ZButton } from '@/components/button/button'
import LoginModal from '@/components/header/login/login_modal'
import ZInputNumber from '@/components/input_number/input_number'
import ZInputMask from '@/components/input_mask/input_mask'
import { ProductOne } from '@/app/seller/product/one/service/type'
import { useFetchRequestGetAddressCustomer } from '@/app/profile/address/service/query'
import { Form, Formik } from 'formik'
import * as Yup from 'yup'
import { useProductionOrderStore } from '../zustand/zustand'
import Link from 'next/link'
import Cookies from 'js-cookie'
import { useEffect, useState } from 'react'
import './quantity_form.css'

const schema = Yup.object().shape({
  quantity: Yup.number()
    .min(1, 'A quantidade mínima é 1')
    .required('Informe a quantidade desejada'),
  destinationZipCode: Yup.string()
    .required('Informe o CEP de entrega')
    .matches(/^\d{5}-?\d{3}$/, 'CEP deve conter 8 dígitos'),
})

export default function QuantityForm({
  product,
  handleActiveIndex,
}: {
  product: ProductOne | null
  handleActiveIndex: (i: number) => void
}) {
  const [loginModalVisible, setLoginModalVisible] = useState(false)
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null)
  const setDesiredQuantity = useProductionOrderStore(
    state => state.setDesiredQuantity
  )
  const savedOrder = useProductionOrderStore(
    state => state.productionOrder
  )
  const { data: addressList } = useFetchRequestGetAddressCustomer()
  const defaultZipCode = addressList?.customer?.address_customer.find(
    address => address.is_default
  )?.cep

  useEffect(() => {
    setIsAuthenticated(Boolean(Cookies.get('access_token')))
  }, [])

  if (!product) {
    return (
      <div className="quantity-form-error">
        <p>
          Não encontramos o produto para o Pedido de Encomenda. Volte à
          página do produto e clique em &quot;Comprar sob encomenda&quot;
          novamente.
        </p>
      </div>
    )
  }

  return (
    <div className="production-order-quantity-step">
      <div className="production-order-section-heading">
        <h2>Defina sua encomenda</h2>
        <p>
          Informe quantas unidades precisa e o CEP onde deseja receber. Na
          próxima etapa você poderá comparar as opções de produção.
        </p>
      </div>

      <Formik
        initialValues={{
          quantity:
            savedOrder.productId === product.uid
              ? savedOrder.desiredQuantity ?? 1
              : 1,
          destinationZipCode:
            savedOrder.destinationZipCode ?? defaultZipCode ?? '',
        }}
        enableReinitialize
        validationSchema={schema}
        onSubmit={values => {
          setDesiredQuantity(
            product.uid,
            values.quantity,
            values.destinationZipCode.replace(/\D/g, '')
          )

          if (!Cookies.get('access_token')) {
            setIsAuthenticated(false)
            setLoginModalVisible(true)
            return
          }

          handleActiveIndex(1)
        }}
      >
        {({ values, errors, touched, setFieldValue }) => (
          <Form className="quantity-form-grid">
            <article className="quantity-product-card">
              <div className="quantity-product-media">
                {product.product_image?.[0]?.img_url ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={product.product_image[0].img_url}
                    alt={product.name}
                    className="quantity-form-image"
                  />
                ) : (
                  <div className="quantity-product-placeholder">
                    <i className="pi pi-image" aria-hidden="true" />
                  </div>
                )}
              </div>
              <div className="quantity-product-content">
                <span className="quantity-product-label">Produto escolhido</span>
                <h3>{product.name}</h3>
                <p className="quantity-product-description">
                  {product.description}
                </p>
                <div className="quantity-product-price">
                  <span>Preço unitário</span>
                  <strong>
                    {product.price.toLocaleString('pt-BR', {
                      style: 'currency',
                      currency: 'BRL',
                    })}
                  </strong>
                </div>
                <ul className="quantity-product-benefits">
                  <li><i className="pi pi-check-circle" /> Produção sob demanda</li>
                  <li><i className="pi pi-map-marker" /> Oficinas comparadas por CEP</li>
                  <li><i className="pi pi-calendar" /> Prazo calculado antes da confirmação</li>
                </ul>
              </div>
            </article>

            <div className="quantity-form-panel">
              <div className="quantity-field">
                <label htmlFor="production-order-quantity">
                  Quantidade desejada
                </label>
                <small>Escolha uma ou mais unidades.</small>
                <ZInputNumber
                  inputId="production-order-quantity"
                  name="quantity"
                  value={values.quantity}
                  onValueChange={e => setFieldValue('quantity', e.value ?? 1)}
                  min={1}
                  showButtons
                  buttonLayout="horizontal"
                  incrementButtonIcon="pi pi-plus"
                  decrementButtonIcon="pi pi-minus"
                  className="quantity-number-input"
                  invalid={!!(errors.quantity && touched.quantity)}
                />
                {errors.quantity && touched.quantity ? (
                  <div className="quantity-field-error">{errors.quantity}</div>
                ) : null}
              </div>

              <div className="quantity-field">
                <label htmlFor="production-order-zip-code">CEP de entrega</label>
                <small>Usaremos o CEP para calcular frete e prazo.</small>
                <ZInputMask
                  id="production-order-zip-code"
                  name="destinationZipCode"
                  value={values.destinationZipCode}
                  mask="99999-999"
                  placeholder="Digite o CEP"
                  className="quantity-zip-input"
                  onChange={e =>
                    setFieldValue('destinationZipCode', e.target.value ?? '')
                  }
                  invalid={
                    !!(
                      errors.destinationZipCode && touched.destinationZipCode
                    )
                  }
                />
                {defaultZipCode && values.destinationZipCode ? (
                  <span className="quantity-default-address">
                    <i className="pi pi-check-circle" /> Endereço padrão selecionado
                  </span>
                ) : null}
                {errors.destinationZipCode && touched.destinationZipCode ? (
                  <div className="quantity-field-error">
                    {errors.destinationZipCode}
                  </div>
                ) : null}
              </div>

              <div className="quantity-subtotal">
                <span>Subtotal dos produtos</span>
                <strong>
                  {(product.price * values.quantity).toLocaleString('pt-BR', {
                    style: 'currency',
                    currency: 'BRL',
                  })}
                </strong>
                <small>Frete será calculado na próxima etapa.</small>
              </div>

              <div className="production-order-actions quantity-form-actions">
                <Link href={`/product/${product.uid}`}>Voltar ao produto</Link>
                <ZButton
                  type="submit"
                  label={
                    isAuthenticated === false
                      ? 'Entrar para simular'
                      : 'Simular produção e entrega'
                  }
                  icon={
                    isAuthenticated === false
                      ? 'pi pi-lock'
                      : 'pi pi-arrow-right'
                  }
                  iconPos="right"
                />
              </div>
              {isAuthenticated === false && (
                <p className="quantity-auth-notice" role="note">
                  <i className="pi pi-info-circle" aria-hidden="true" />
                  Entre na sua conta para consultar oficinas, frete e prazo de
                  produção.
                </p>
              )}
            </div>
          </Form>
        )}
      </Formik>
      {loginModalVisible && (
        <LoginModal
          visible
          onHide={() => setLoginModalVisible(false)}
        />
      )}
    </div>
  )
}
