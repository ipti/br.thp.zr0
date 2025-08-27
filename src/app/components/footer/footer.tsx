import "./footer.css"
import logo from '../../../assets/img/logo_white.png'
import Image from "next/image"

export default function Footer() {
const currentYear = new Date().getFullYear()

  const socialLinks = [
    // { icon: Facebook, href: '#', label: 'Facebook' },
    // { icon: Instagram, href: '#', label: 'Instagram' },
    // { icon: Twitter, href: '#', label: 'Twitter' },
    // { icon: Youtube, href: '#', label: 'YouTube' }
  ]

  const companyLinks = [
    { name: 'Sobre nós', href: '#' },
    { name: 'Nossa história', href: '#' },
    { name: 'Sustentabilidade', href: '#' },
    { name: 'Carreiras', href: '#' }
  ]

  const supportLinks = [
    { name: 'Central de ajuda', href: '#' },
    { name: 'Trocas e devoluções', href: '#' },
    { name: 'Política de privacidade', href: '#' },
    { name: 'Termos de uso', href: '#' }
  ]

  const productLinks = [
    { name: 'Sofás', href: '#' },
    { name: 'Poltronas', href: '#' },
    { name: 'Mesas', href: '#' },
    { name: 'Estantes', href: '#' }
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
                            Design original produzido através de processo sustentável.
                            Somos uma empresa brasileira comprometida com a qualidade
                            e o meio ambiente.
                        </p>

                        {/* Contact Info */}
                        {/* <div className="footer-contact">
                            <div className="contact-item">
                                <MapPin size={16} />
                                <span>São Paulo, SP - Brasil</span>
                            </div>
                            <div className="contact-item">
                                <Phone size={16} />
                                <span>(11) 9999-9999</span>
                            </div>
                            <div className="contact-item">
                                <Mail size={16} />
                                <span>contato@zio.com.br</span>
                            </div>
                        </div> */}

                        {/* Social Media */}
                        <div className="footer-socials">
                            {socialLinks?.map((social) => (
                                <a key={social.label} href={social.href} aria-label={social.label}>
                                    <social.icon size={18} />
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Company Links */}
                    <div className="footer-column">
                        <h4>Empresa</h4>
                        <ul>
                            {companyLinks.map((link) => (
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
                            {productLinks.map((link) => (
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
                            {supportLinks.map((link) => (
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
                        © {currentYear} ZIo. Todos os direitos reservados.
                    </div>

                    {/* Pagination Dots */}
                    <div className="footer-dots">
                        <div className="dot active"></div>
                        <div className="dot"></div>
                        <div className="dot"></div>
                        <div className="dot inactive"></div>
                    </div>

                    <div className="footer-made">
                        Feito com ❤️ no Brasil
                    </div>
                </div>
            </div>
        </footer>

    )
}