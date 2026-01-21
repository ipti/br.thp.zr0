import './footer.css'
import logo from '../../../assets/img/logo_white.png'
import Image from 'next/image'
import { ISocialLinks, ILinks } from './types'
import { Facebook, Instagram, Twitter, Youtube } from 'lucide-react'

export default function Footer() {
  const currentYear = new Date().getFullYear()

  const socialLinks: ISocialLinks[] = [
    { icon: <Facebook />, href: '#', label: 'Facebook' },
    { icon: <Instagram />, href: '#', label: 'Instagram' },
    { icon: <Twitter />, href: '#', label: 'Twitter' },
    { icon: <Youtube />, href: '#', label: 'YouTube' }
  ]

  const companyLinks: ILinks[] = [
    { name: 'Sobre nós', href: '/about-us' },
    { name: 'Nossa história', href: '/about-us#history' },
    { name: 'Sustentabilidade', href: '/about-us#sustentability' },
    { name: 'Contate-nos', href: '/contact' }
  ]

  const supportLinks: ILinks[] = [
    { name: 'Central de ajuda', href: '#' },
    { name: 'Trocas e devoluções', href: '#' },
    { name: 'Política de privacidade', href: '#' },
    { name: 'Termos de uso', href: '#' }
  ]

  const productLinks: ILinks[] = [
    { name: 'Sofás', href: '/product?category=sofas' },
    { name: 'Poltronas', href: '/product?category=poltronas' },
    { name: 'Mesas', href: '/product?category=mesas' },
    { name: 'Estantes', href: '/product?category=estantes' }
  ]

  return (
    <footer className="footer">
      {/* Main Footer Content */}
      <div className="footer-container">
        <div className="footer-grid">
          {/* Brand Section */}
          <div className="footer-brand">
            <div className="footer-logo">
              <Image height={18} width={18} src={logo} alt="ZIo" />
            </div>
            <p className="footer-text">
              Design original produzido através de processo sustentável. Somos
              uma empresa brasileira comprometida com a qualidade e o meio
              ambiente.
            </p>

            {/* Social Media */}
            <div className="footer-socials">
              {socialLinks?.map(social => (
                <a
                  key={social.label}
                  href={social.href}
                  aria-label={social.label}
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Company Links */}
          <div className="footer-column">
            <h4>Empresa</h4>
            <ul>
              {companyLinks.map(link => (
                <li key={link.name}>
                  <a href={link.href}>{link.name}</a>
                </li>
              ))}
            </ul>
          </div>

          {/* Products Links */}
          <div className="footer-column">
            <h4>Produtos</h4>
            <ul>
              {productLinks.map(link => (
                <li key={link.name}>
                  <a href={link.href}>{link.name}</a>
                </li>
              ))}
            </ul>
          </div>

          {/* Support Links */}
          <div className="footer-column">
            <h4>Suporte</h4>
            <ul>
              {supportLinks.map(link => (
                <li key={link.name}>
                  <a href={link.href}>{link.name}</a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="footer-bottom">
        <div className="footer-bottom-container">
          <div className="footer-copy">
            © {currentYear} Zr0. Todos os direitos reservados.
          </div>

          <div className="footer-made">
            Feito com ❤️ em Santa Luzia do Itanhy
          </div>
        </div>
      </div>
    </footer>
  )
}
