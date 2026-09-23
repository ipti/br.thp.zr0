import { buildWhatsAppLink } from '@/lib/whatsapp'
import './header_social.css'

const whatsappNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER

const socialLinks = [
  {
    label: 'WhatsApp',
    href: whatsappNumber
      ? buildWhatsAppLink(whatsappNumber, 'Olá! Gostaria de saber mais sobre os produtos da ZR0.')
      : undefined,
    iconClassName: 'pi pi-whatsapp',
  },
  {
    label: 'Instagram',
    href: process.env.NEXT_PUBLIC_INSTAGRAM_URL,
    iconClassName: 'pi pi-instagram',
  },
]

export default function HeaderSocial() {
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
