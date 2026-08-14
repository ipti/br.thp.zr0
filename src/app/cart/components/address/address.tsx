import ModalAddressCustomer from '@/app/profile/address/components/modal_add_addresss/modal_add_address'
import NotFoundAddress from '@/app/profile/address/components/not_found/not_found_address'
import { useFetchRequestGetAddressCustomer } from '@/app/profile/address/service/query'
import { AddressList } from '@/app/profile/address/service/type'
import { ZButton } from '@/components/button/button'
import { Form, Formik } from 'formik'
import { useState } from 'react'
import * as Yup from 'yup'
import { useCartStepsStore } from '../../zustand/zustand'
import CardAddress from '../card_address/card_address'

const schema = Yup.object({
  address_selected: Yup.number().required('Selecione um endereço para continuar.')
})

export default function Address({
  handleActiveIndex
}: {
  handleActiveIndex: (i: number) => void
}) {
  const [visibleAddAddress, setVisibleAddAddress] = useState(false)
  const { data: addressCustomerRequest } = useFetchRequestGetAddressCustomer()
  const addressList: AddressList | undefined = addressCustomerRequest
  const cartSteps = useCartStepsStore(state => state)

  return (
    <div className="checkout-stage">
      <div className="checkout-stage-heading">
        <div>
          <h2>Onde você quer receber?</h2>
          <p>Selecione um endereço cadastrado ou adicione um novo.</p>
        </div>
        <ZButton
          label="Adicionar endereço"
          icon="pi pi-plus"
          outlined
          type="button"
          onClick={() => setVisibleAddAddress(true)}
        />
      </div>

      <Formik
        enableReinitialize
        initialValues={{ address_selected: cartSteps.cartSteps.address_selected }}
        validationSchema={schema}
        onSubmit={() => handleActiveIndex(2)}
      >
        {({ setFieldValue, errors, submitCount }) => (
          <Form>
            {errors.address_selected && submitCount > 0 && (
              <div className="checkout-inline-error" role="alert">
                {errors.address_selected}
              </div>
            )}

            {addressList?.customer?.address_customer.length === 0 && <NotFoundAddress />}
            <div className="checkout-card-grid" role="radiogroup" aria-label="Endereços de entrega">
              {addressList?.customer?.address_customer?.map(item => (
                <CardAddress
                  key={item.id}
                  item={item}
                  setFieldValue={(field, value) => {
                    void setFieldValue(field, value)
                  }}
                />
              ))}
            </div>

            <div className="checkout-actions">
              <ZButton label="Voltar" security="secondary" type="button" onClick={() => handleActiveIndex(0)} />
              <ZButton label="Continuar para entrega" />
            </div>
          </Form>
        )}
      </Formik>

      <ModalAddressCustomer visible={visibleAddAddress} onHide={() => setVisibleAddAddress(false)} />
    </div>
  )
}
