import { Facebook, Instagram } from 'lucide-react'
import './header_social.css'

const socialLinks = [
  {
    label: 'Facebook',
    href: process.env.NEXT_PUBLIC_FACEBOOK_URL,
    icon: Facebook,
  },
  {
    label: 'Instagram',
    href: process.env.NEXT_PUBLIC_INSTAGRAM_URL,
    icon: Instagram,
  },
]

export default function HeaderSocial() {
  return (
    <div className="header-social" aria-label="Redes sociais">
      {socialLinks.map(({ label, href, icon: Icon }) =>
        href ? (
          <a
            key={label}
            className="header-social__link"
            href={href}
            target="_blank"
            rel="noreferrer"
            aria-label={`Abrir ${label} da ZR0`}
          >
            <Icon aria-hidden="true" />
          </a>
        ) : (
          <span
            key={label}
            className="header-social__link header-social__link--disabled"
            title={`${label} indisponível`}
            aria-hidden="true"
          >
            <Icon />
          </span>
        )
      )}
    </div>
  )
}
