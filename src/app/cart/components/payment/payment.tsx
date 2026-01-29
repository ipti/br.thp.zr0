import OrderCard from '@/app/profile/order/[id]/components/card/card'
import { ZButton } from '@/components/button/button'
import { CartController } from '../../service/controller'
import { useEffect, useState } from 'react'

export default function Payment({
  handleActiveIndex,
  orders
}: {
  handleActiveIndex: (i: number) => void
  orders: { id: number; uid: string }[]
}) {
  const [ordersData, setOrdersData] = useState<any[]>([])

  const cartController = CartController()

  const getaAllOrdersInformations = async () => {
    const ordersInformaiton = await cartController.GetOrdersInformation(orders)
    setOrdersData(ordersInformaiton)
  }

  useEffect(() => {
    getaAllOrdersInformations()
  }, [])

  return (
    <div>
      {ordersData.map(item => (
        <OrderCard order={item} key={item.id} />
      ))}

      <div className="mt-4 flex flex-row justify-content-end gap-1">
        <ZButton
          label="Voltar"
          security="secondary"
          onClick={() => {
            handleActiveIndex(3)
          }}
        />
      </div>
    </div>
  )
}
