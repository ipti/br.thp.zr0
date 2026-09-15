import Image from 'next/image'
import communityImage from '@/assets/img/home/pessoas_zr0.svg'
import brandLogo from '@/assets/img/ZR0_logotipo.png'
import './about_closing.css'

export default function AboutClosing() {
  return (
    <section id="sustentability" className="about-closing" aria-labelledby="about-closing-title">
      <div className="about-us__content about-closing__inner">
        <div className="about-closing__content">
          <h2 id="about-closing-title" className="about-closing__title">
            Acreditamos que a sustentabilidade vai além da redução de impactos.
          </h2>

          <p className="about-closing__copy">
            É sobre criar sistemas capazes de regenerar comunidades, ampliar oportunidades e
            transformar resíduos em futuro.
          </p>

          <div className="about-closing__signature">
            <Image className="about-closing__logo" src={brandLogo} alt="ZR0" />
            <p>Do descarte à permanência.</p>
          </div>
        </div>

        <figure className="about-closing__figure">
          <Image
            className="about-closing__image"
            src={communityImage}
            alt="Fotografia de pessoas da comunidade parceira da ZR0"
            sizes="(max-width: 1023px) 100vw, 48vw"
          />
        </figure>
      </div>
    </section>
  )
}
