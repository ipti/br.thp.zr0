'use client'

import { useEffect, useState } from 'react'
import { buildWhatsAppLink } from '@/lib/whatsapp'
import './header_social.css'

const buildTimeWhatsappNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || null
const buildTimeInstagramUrl = process.env.NEXT_PUBLIC_INSTAGRAM_URL || null

type SocialConfig = {
  whatsappNumber: string | null
  instagramUrl: string | null
}

export default function HeaderSocial() {
  const [config, setConfig] = useState<SocialConfig>({
    whatsappNumber: buildTimeWhatsappNumber,
    instagramUrl: buildTimeInstagramUrl,
  })

  useEffect(() => {
    if (buildTimeWhatsappNumber && buildTimeInstagramUrl) return

    const controller = new AbortController()

    const loadRuntimeConfig = async () => {
      try {
        const response = await fetch('/api/runtime-config/social', {
          cache: 'no-store',
          signal: controller.signal,
        })
        const runtimeConfig = (await response.json()) as Partial<SocialConfig>

        if (!response.ok) return

        setConfig(current => ({
          whatsappNumber: current.whatsappNumber ?? runtimeConfig.whatsappNumber ?? null,
          instagramUrl: current.instagramUrl ?? runtimeConfig.instagramUrl ?? null,
        }))
      } catch (error) {
        if (!(error instanceof DOMException && error.name === 'AbortError')) {
          // Mantém o fallback já presente em `config`; nada a fazer aqui.
        }
      }
    }

    void loadRuntimeConfig()
    return () => controller.abort()
  }, [])

  const socialLinks = [
    {
      label: 'WhatsApp',
      href: config.whatsappNumber
        ? buildWhatsAppLink(config.whatsappNumber, 'Olá! Gostaria de saber mais sobre os produtos da ZR0.')
        : undefined,
      iconClassName: 'pi pi-whatsapp',
    },
    {
      label: 'Instagram',
      href: config.instagramUrl ?? undefined,
      iconClassName: 'pi pi-instagram',
    },
  ]

  return (
    <div className="header-social" aria-label="Contato e redes sociais">
      {socialLinks.map(({ label, href, iconClassName }) =>
        href ? (
          <a
            key={label}
            className="header-social__link"
            href={href}
            target="_blank"
            rel="noreferrer"
            aria-label={label === 'WhatsApp' ? 'Falar com a ZR0 no WhatsApp' : `Abrir ${label} da ZR0`}
          >
            <i className={iconClassName} aria-hidden="true" />
          </a>
        ) : (
          <span
            key={label}
            className="header-social__link header-social__link--disabled"
            title={`${label} indisponível`}
            aria-hidden="true"
          >
            <i className={iconClassName} />
          </span>
        )
      )}
    </div>
  )
}
