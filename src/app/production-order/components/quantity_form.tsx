// Formulário de quantidade desejada — passo 1 da jornada de Encomenda.
// Isolado de src/app/cart/ — nunca importar useCartStore/useCartStepsStore aqui.
'use client'
import { ZButton } from '@/components/button/button'
import ZInputNumber from '@/components/input_number/input_number'
import { ProductOne } from '@/app/seller/product/one/service/type'
import { Form, Formik } from 'formik'
import * as Yup from 'yup'
import { useProductionOrderStore } from '../zustand/zustand'
import './quantity_form.css'

const schema = Yup.object().shape({
  quantity: Yup.number()
    .min(1, 'A quantidade mínima é 1')
    .required('Informe a quantidade desejada'),
})

export default function QuantityForm({
  product,
  handleActiveIndex,
}: {
  product: ProductOne | null
  handleActiveIndex: (i: number) => void
}) {
  const setDesiredQuantity = useProductionOrderStore(
    state => state.setDesiredQuantity
  )

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
    <div className="quantity-form">
      <div className="quantity-form-product">
        {product.product_image?.[0]?.img_url ? (
          <img
            src={product.product_image[0].img_url}
            alt={product.name}
            className="quantity-form-image"
          />
        ) : null}
        <div>
          <h3>{product.name}</h3>
          <p>R$ {product.price?.toLocaleString('pt-BR')}</p>
        </div>
      </div>

      <Formik
        initialValues={{ quantity: 1 }}
        validationSchema={schema}
        onSubmit={values => {
          setDesiredQuantity(product.uid, values.quantity)
          handleActiveIndex(1)
        }}
      >
        {({ values, errors, touched, setFieldValue }) => (
          <Form>
            <div className="flex flex-column mb-4">
              <label className="mb-2">Quantidade desejada</label>
              <ZInputNumber
                name="quantity"
                value={values.quantity}
                onValueChange={e => setFieldValue('quantity', e.value ?? 1)}
                min={1}
                showButtons
                invalid={!!(errors.quantity && touched.quantity)}
              />
              {errors.quantity && touched.quantity ? (
                <>
                  <div className="p-1" />
                  <div style={{ color: 'red' }}>{errors.quantity}</div>
                </>
              ) : null}
            </div>
            <ZButton type="submit" label="Continuar" />
          </Form>
        )}
      </Formik>
    </div>
  )
}
