'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'
import './header_navigation.css'

type MenuId = 'shop' | 'project'

const menus = [
  {
    id: 'shop' as const,
    label: 'Compre agora',
    items: [
      { label: 'Vitrine', href: '/product' },
      { label: 'Todos os produtos', href: '/product/all' },
    ],
  },
  {
    id: 'project' as const,
    label: 'Conheça o projeto',
    items: [
      { label: 'Sobre nós', href: '/about-us' },
      { label: 'Nosso compromisso', href: '/about-us#sustentability' },
    ],
  },
]

export default function HeaderNavigation() {
  const pathname = usePathname()
  const navigationRef = useRef<HTMLElement>(null)
  const [openMenu, setOpenMenu] = useState<MenuId | null>(null)

  useEffect(() => {
    setOpenMenu(null)
  }, [pathname])

  useEffect(() => {
    const closeOnOutsideClick = (event: PointerEvent) => {
      if (!navigationRef.current?.contains(event.target as Node)) {
        setOpenMenu(null)
      }
    }

    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') return

      const activeMenu = openMenu
      setOpenMenu(null)
      if (activeMenu) {
        navigationRef.current
          ?.querySelector<HTMLButtonElement>(`[data-menu-trigger="${activeMenu}"]`)
          ?.focus()
      }
    }

    document.addEventListener('pointerdown', closeOnOutsideClick)
    document.addEventListener('keydown', closeOnEscape)

    return () => {
      document.removeEventListener('pointerdown', closeOnOutsideClick)
      document.removeEventListener('keydown', closeOnEscape)
    }
  }, [openMenu])

  return (
    <nav ref={navigationRef} className="header-navigation" aria-label="Navegação principal">
      <ul className="header-navigation__list">
        {menus.map(menu => {
          const isOpen = openMenu === menu.id

          return (
            <li key={menu.id} className="header-navigation__item">
              <button
                type="button"
                className="header-navigation__trigger"
                data-menu-trigger={menu.id}
                aria-expanded={isOpen}
                aria-controls={`header-menu-${menu.id}`}
                onClick={() => setOpenMenu(current => (current === menu.id ? null : menu.id))}
              >
                {menu.label}
                <i className="pi pi-chevron-down" aria-hidden="true" />
              </button>

              <ul
                id={`header-menu-${menu.id}`}
                className="header-navigation__dropdown"
                hidden={!isOpen}
              >
                {menu.items.map(item => (
                  <li key={item.href}>
                    <Link href={item.href} onClick={() => setOpenMenu(null)}>
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}
