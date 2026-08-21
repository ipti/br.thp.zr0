'use client'
import { useCartStore } from '@/service/store/cart_store'
import Cookies from 'js-cookie'
import { usePathname, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import zioLogo from '../../assets/img/ZR0_logotipo.png'
import './header.css'
import Image from 'next/image'
import { Popover } from 'react-tiny-popover'
import MenuUser from './menu_user/menu_user'
import LoginModal from './login/login_modal'
import { ZButton } from '../button/button'
import { useFetchUserToken } from '@/service/global_request/query'

export default function Header() {
  const pathname = usePathname()
  const useNavigate = useRouter()
  const [modalLogin, setModalLogin] = useState(false)
  const [menuUser, setMenuUser] = useState(false)
  const [hasToken, setHasToken] = useState(false)

  const [hydrated, setHydrated] = useState(false)
  useEffect(() => {
    setHasToken(Boolean(Cookies.get('access_token')))
    setHydrated(true)
  }, [])

  const { data: user } = useFetchUserToken(hasToken)
  const accountLabel = user?.name?.trim() || 'Minha conta'

  const cart = useCartStore(state => state.cart)

  const isProductPage = pathname === '/product'

  const total = cart.length
  return (
    <>
      <header className="header">
        <div className="header-container">
          {/* Left - Navigation */}
          <div className="header-left">
            {!isProductPage && (
              <ZButton
                // onClick={onNavigateToProducts}
                onClick={() => useNavigate.push('/product')}
                className="nav-button"
              >
                <p>Produtos</p>
              </ZButton>
            )}
          </div>

          {/* Center - Logo */}
          <div className="header-logo">
            <button
              className="logo-button"
              onClick={() => useNavigate.push('/')}
            >
              <Image height={48} src={zioLogo} alt="ZR0" />
            </button>
          </div>
          <div className="header-right">
            <Popover
              isOpen={menuUser}
              transform={{ top: 30 }}
              transformMode="relative"
              onClickOutside={() => setMenuUser(false)}
              positions={['bottom']}
              containerStyle={{ zIndex: 1000 }}
              content={<MenuUser />}
            >
              <button
                type="button"
                className="cart-button account-button"
                aria-label={hasToken ? 'Abrir minha conta' : 'Entrar na conta'}
                aria-expanded={hasToken ? menuUser : undefined}
                onClick={() => {
                  if (hasToken) {
                    setMenuUser(current => !current)
                    return
                  }
                  setModalLogin(true)
                }}
              >
                <i className="cart-icon pi pi-user cursor-pointer" />
                {hydrated && (
                  <span
                    className="account-text"
                    title={hasToken ? accountLabel : undefined}
                  >
                    {hasToken ? accountLabel : 'Entrar'}
                  </span>
                )}
              </button>
            </Popover>
            {hydrated && (
              <button
                className="cart-button"
                onClick={() => useNavigate.push('/cart')}
              >
                <div className="cart-icon pi pi-shopping-cart" />
                <span className="cart-text">Carrinho ({total})</span>
                <span className="cart-text-mobile">({total})</span>
                {total > 0 && <span className="cart-badge">{total}</span>}
              </button>
            )}
          </div>
        </div>
      </header>
      <LoginModal
        visible={modalLogin}
        onHide={() => setModalLogin(false)}
      />
    </>
  )
}
