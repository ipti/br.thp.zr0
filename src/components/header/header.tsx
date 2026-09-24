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

const SCROLL_SHRINK_THRESHOLD = 48
const SCROLL_EXPAND_THRESHOLD = 16
const HEADER_RESIZE_SETTLE_MS = 320

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
    let frameId: number | null = null
    let compact = false
    let ignoreScrollExpansionUntil = 0
    let touchStartY = 0
    const header = document.querySelector<HTMLElement>('.site-header')

    const getScrollTop = () =>
      Math.max(
        document.documentElement.scrollTop,
        document.body.scrollTop,
        window.scrollY,
        document.querySelector<HTMLElement>('main')?.scrollTop ?? 0
      )

    const setCompact = (next: boolean) => {
      if (compact === next) return
      compact = next
      // A mudança de altura pode zerar o scroll de páginas curtas.
      if (next) ignoreScrollExpansionUntil = performance.now() + HEADER_RESIZE_SETTLE_MS
      setIsScrolled(next)
    }

    const updateScrolled = () => {
      const scrollTop = getScrollTop()
      if (!compact && scrollTop >= SCROLL_SHRINK_THRESHOLD) {
        setCompact(true)
      } else if (
        compact &&
        scrollTop <= SCROLL_EXPAND_THRESHOLD &&
        performance.now() >= ignoreScrollExpansionUntil
      ) {
        setCompact(false)
      }
      frameId = null
    }

    const handleScroll = (event: Event) => {
      const target = event.target
      if (
        target !== window &&
        target !== document &&
        target !== document.documentElement &&
        target !== document.body &&
        target !== document.querySelector('main')
      ) return
      if (frameId !== null) return
      frameId = window.requestAnimationFrame(updateScrolled)
    }

    const isPageInteraction = (target: EventTarget | null) => {
      if (!(target instanceof Node) || header?.contains(target)) return false
      const main = document.querySelector('main')
      return !main || main.contains(target) || target === document || target === document.body
    }

    // Se o conteúdo passou a caber após encolher, o gesto para cima ainda reabre o header.
    const handleWheel = (event: WheelEvent) => {
      if (
        compact && event.deltaY < 0 &&
        getScrollTop() <= SCROLL_EXPAND_THRESHOLD &&
        isPageInteraction(event.target)
      ) setCompact(false)
    }

    const handleTouchStart = (event: TouchEvent) => {
      touchStartY = event.touches[0]?.clientY ?? 0
    }

    const handleTouchMove = (event: TouchEvent) => {
      if (
        compact &&
        (event.touches[0]?.clientY ?? 0) > touchStartY + 8 &&
        getScrollTop() <= SCROLL_EXPAND_THRESHOLD &&
        isPageInteraction(event.target)
      ) setCompact(false)
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      const target = event.target
      if (
        !compact || getScrollTop() > SCROLL_EXPAND_THRESHOLD ||
        !isPageInteraction(target) ||
        (target instanceof HTMLElement && (target.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(target.tagName)))
      ) return
      if (['ArrowUp', 'PageUp', 'Home'].includes(event.key) || (event.key === ' ' && event.shiftKey)) {
        setCompact(false)
      }
    }

    updateScrolled()
    // capture recebe o scroll do main em carrinho, perfil e pagamento.
    document.addEventListener('scroll', handleScroll, { passive: true, capture: true })
    document.addEventListener('wheel', handleWheel, { passive: true, capture: true })
    document.addEventListener('touchstart', handleTouchStart, { passive: true })
    document.addEventListener('touchmove', handleTouchMove, { passive: true })
    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.removeEventListener('scroll', handleScroll, { capture: true })
      document.removeEventListener('wheel', handleWheel, { capture: true })
      document.removeEventListener('touchstart', handleTouchStart)
      document.removeEventListener('touchmove', handleTouchMove)
      document.removeEventListener('keydown', handleKeyDown)
      if (frameId !== null) window.cancelAnimationFrame(frameId)
    }
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
