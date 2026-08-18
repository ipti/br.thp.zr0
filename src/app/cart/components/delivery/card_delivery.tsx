import { ShippingGetType, ValidOption } from '@/app/product/service/type'
import ZCard from '@/components/card/card'
import ZRadioButton from '@/components/radio_button/radio_button'
import { Dispatch, SetStateAction } from 'react'
import { formatCurrency } from '../../utils'
import { DeliverySelectedType, useCartStepsStore } from '../../zustand/zustand'

type CardDeliveryProps = {
  shippingItem: ShippingGetType
  shippingSelect: DeliverySelectedType[]
  setShippingSelect: Dispatch<SetStateAction<DeliverySelectedType[]>>
  handleSelectOptions: (value: DeliverySelectedType) => DeliverySelectedType[]
}

export function CardDelivery({
  shippingItem,
  shippingSelect,
  setShippingSelect,
  handleSelectOptions
}: CardDeliveryProps) {
  const cartSteps = useCartStepsStore(state => state)
  const groupId = `delivery-group-${shippingItem.productId}-${shippingItem.workshopId}`

  const selectOption = (option: ValidOption) => {
    const newState = handleSelectOptions({
      productId: shippingItem.productId,
      workshopId: shippingItem.workshopId,
      validOptions: option,
      productName: shippingItem.productName,
      workshopName: shippingItem.workshopName,
      quantity: shippingItem.quantity
    })
    setShippingSelect(newState)
    cartSteps.updateCartSteps({
      ...cartSteps.cartSteps,
      deliverySelected: newState
    })
  }

  return (
    <div role="radiogroup" aria-labelledby={groupId}>
      <div className="delivery-group-heading" id={groupId}>
        <h3>{shippingItem.productName}</h3>
        <p>
          {shippingItem.workshopName} · {shippingItem.quantity}{' '}
          {shippingItem.quantity === 1 ? 'unidade' : 'unidades'}
        </p>
      </div>

      {shippingItem.result?.validOptions?.map(option => {
        const radioId = `delivery-${shippingItem.productId}-${shippingItem.workshopId}-${option.serviceCode}`
        const optionLabelId = `${radioId}-label`
        const isSelected = shippingSelect.some(select =>
          select.productId === shippingItem.productId &&
          select.workshopId === shippingItem.workshopId &&
          select.validOptions.serviceCode === option.serviceCode
        )

        return (
          <ZCard
            key={option.serviceCode}
            className={`checkout-selectable-card delivery-option-card${isSelected ? ' is-selected' : ''}`}
            onClick={() => selectOption(option)}
          >
            <div className="delivery-option-content">
              <ZRadioButton
                inputId={radioId}
                name={`delivery-${shippingItem.productId}-${shippingItem.workshopId}`}
                value={option.serviceCode}
                checked={isSelected}
                aria-labelledby={optionLabelId}
                onChange={() => selectOption(option)}
              />
              <div className="delivery-option-name" id={optionLabelId}>
                <strong>{option.carrier}</strong>
                <span>{option.service}</span>
              </div>
              <div className="delivery-option-price">
                <strong>{formatCurrency(option.cost)}</strong>
                <span>Estimativa: {option.deliveryTime} dias úteis</span>
              </div>
            </div>
          </ZCard>
        )
      })}
    </div>
  )
}
