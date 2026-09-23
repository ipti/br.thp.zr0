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

const SCROLL_EXPAND_THRESHOLD = 16

export default function Header() {
  const [modalLogin, setModalLogin] = useState(false)
  const [menuUser, setMenuUser] = useState(false)
  const [hasToken, setHasToken] = useState(false)
  const [hydrated, setHydrated] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)

  useEffect(() => {
    setHasToken(Boolean(Cookies.get('access_token')))
    setHydrated(true)
  }, [])

  useEffect(() => {
    let ticking = false
    const header = document.querySelector<HTMLElement>('.site-header')
    // Ao encolher, o header reduz a altura da página. Limites separados
    // impedem que essa mudança dispare a expansão logo em seguida.
    const shrinkThreshold = header?.offsetHeight ?? 160

    const getScrollTop = () =>
      Math.max(
        document.documentElement.scrollTop,
        document.body.scrollTop,
        window.scrollY
      )

    const updateScrolled = () => {
      const scrollTop = getScrollTop()
      setIsScrolled(current =>
        current
          ? scrollTop > SCROLL_EXPAND_THRESHOLD
          : scrollTop >= shrinkThreshold
      )
      ticking = false
    }

    const handleScroll = () => {
      if (ticking) return
      ticking = true
      window.requestAnimationFrame(updateScrolled)
    }

    updateScrolled()
    // capture: true — captura o scroll independente de qual elemento rola
    // (window ou um container interno com overflow próprio); scroll não
    // borbulha, então sem capture o listener no document nunca dispararia.
    document.addEventListener('scroll', handleScroll, { passive: true, capture: true })
    return () => document.removeEventListener('scroll', handleScroll, { capture: true })
  }, [])

  const { data: user } = useFetchUserToken(hasToken)
  const cart = useCartStore(state => state.cart)
  const accountLabel = user?.name?.trim() || 'Minha conta'
  const total = cart.length
  const visibleTotal = total > 99 ? '99+' : String(total)

  return (
    <>
      <header className={`site-header${isScrolled ? ' site-header--scrolled' : ''}`}>
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
