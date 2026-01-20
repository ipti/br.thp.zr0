import { User } from '@/app/seller/user/type'
import { useFetchUserToken } from '@/service/global_request/query'
import ZAvatar from '@/components/avatar/avatar'
import './menu_user.css'
import ZDivider from '@/components/divider/divider'
import { logout } from '@/service/cookies'
import { useRouter } from 'next/navigation'

type ItemsMenu = {
  router: string
  label: string
  icon: string
  type?: 'Normal' | 'Exit'
}
export default function MenuUser() {
  const history = useRouter()

  const { data: userRequest } = useFetchUserToken()

  const user: User | undefined = userRequest

  const itemsMenu: ItemsMenu[] = [
    {
      icon: 'pi pi-shopping-cart',
      label: 'Carrinho',
      router: '/cart',
      type: 'Normal'
    },
    {
      icon: 'pi pi-box',
      label: 'Pedidos',
      router: '/profile/order',
      type: 'Normal'
    },
    {
      icon: 'pi pi-sign-out',
      label: 'Sair',
      router: '',
      type: 'Exit'
    }
  ]

  return (
    <div className="menu_user">
      <div
        className="item_menu"
        onClick={() => {
          history.push('/profile')
        }}
      >
        <ZAvatar label={user?.name?.slice(0, 1)} shape="circle" size="large" />
        <div className="flex flex-column">
          <p>{user?.name}</p>
          <p className="cursor-pointer mt-0">Meu perfil {'>'}</p>
        </div>
      </div>
      <ZDivider />

      {itemsMenu.map(item => {
        return (
          <div
            key={item.label}
            className="item_menu"
            onClick={
              item.type === 'Exit'
                ? () => {
                    logout()
                    window.location.reload()
                  }
                : () => {
                    history.push(item.router)
                  }
            }
          >
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center'
              }}
            >
              <i className={item.icon} />
            </div>
            <p>{item.label}</p>
          </div>
        )
      })}
    </div>
  )
}
