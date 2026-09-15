'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { Popover } from 'react-tiny-popover'
import Cookies from 'js-cookie'
import { useFetchUserToken } from '@/service/global_request/query'
import { useCartStore } from '@/service/store/cart_store'
import zroLogo from '@/assets/img/ZR0_logotipo.png'
import HeaderNavigation from './header_navigation/header_navigation'
import HeaderSocial from './header_social/header_social'
import LoginModal from './login/login_modal'
import MenuUser from './menu_user/menu_user'
import './header.css'

export default function Header() {
  const [modalLogin, setModalLogin] = useState(false)
  const [menuUser, setMenuUser] = useState(false)
  const [hasToken, setHasToken] = useState(false)
  const [hydrated, setHydrated] = useState(false)

  useEffect(() => {
    setHasToken(Boolean(Cookies.get('access_token')))
    setHydrated(true)
  }, [])

  const { data: user } = useFetchUserToken(hasToken)
  const cart = useCartStore(state => state.cart)
  const accountLabel = user?.name?.trim() || 'Minha conta'
  const total = cart.length
  const visibleTotal = total > 99 ? '99+' : String(total)

  return (
    <>
      <header className="site-header">
        <div className="site-header__primary">
          <div className="site-header__side site-header__side--left">
            <HeaderSocial />
          </div>

          <Link href="/" className="site-header__logo" aria-label="Ir para a página inicial">
            <Image src={zroLogo} alt="ZR0" priority />
          </Link>

          <div className="site-header__side site-header__side--right">
            {hydrated ? (
              <Link
                href="/cart"
                className="site-header__action site-header__cart"
                aria-label={`Abrir carrinho com ${total} ${total === 1 ? 'item' : 'itens'}`}
              >
                <i className="pi pi-shopping-cart" aria-hidden="true" />
                {total > 0 && (
                  <span className="site-header__badge" aria-hidden="true">
                    {visibleTotal}
                  </span>
                )}
              </Link>
            ) : (
              <span className="site-header__action" aria-hidden="true">
                <i className="pi pi-shopping-cart" />
              </span>
            )}

            <Popover
              isOpen={menuUser}
              transform={{ top: 12 }}
              transformMode="relative"
              onClickOutside={() => setMenuUser(false)}
              positions={['bottom']}
              containerStyle={{ zIndex: '1000' }}
              content={<MenuUser />}
            >
              <button
                type="button"
                className="site-header__action site-header__account"
                aria-label={hasToken ? `Abrir conta de ${accountLabel}` : 'Entrar na conta'}
                aria-expanded={hasToken ? menuUser : undefined}
                onClick={() => {
                  if (hasToken) {
                    setMenuUser(current => !current)
                    return
                  }

                  setModalLogin(true)
                }}
              >
                <i className="pi pi-user" aria-hidden="true" />
              </button>
            </Popover>
          </div>
        </div>

        <HeaderNavigation />
      </header>

      <LoginModal visible={modalLogin} onHide={() => setModalLogin(false)} />
    </>
  )
}
