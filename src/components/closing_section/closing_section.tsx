import Image from 'next/image'
import brandLogo from '@/assets/img/ZR0_logotipo.png'
import communityImage from '@/assets/img/home/pessoas_zr0.svg'
import './closing_section.css'

interface ClosingSectionProps {
  id?: string
}

export default function ClosingSection({ id }: ClosingSectionProps) {
  return (
    <section
      id={id}
      className="closing-section"
      aria-labelledby="closing-section-title"
    >
      <div className="closing-section__inner">
        <div className="closing-section__content">
          <h2 id="closing-section-title" className="closing-section__title">
            Acreditamos que a sustentabilidade vai além da redução de impactos.
          </h2>

          <p className="closing-section__copy">
            É sobre criar sistemas capazes de regenerar comunidades, ampliar oportunidades e
            transformar resíduos em futuro.
          </p>

          <div className="closing-section__signature">
            <Image
              src={brandLogo}
              alt="ZR0"
              className="closing-section__logo"
              sizes="(max-width: 1023px) 112px, 176px"
            />
            <p>Do descarte à permanência.</p>
          </div>
        </div>

        <figure className="closing-section__figure">
          <Image
            src={communityImage}
            alt="Pessoas da comunidade parceira da ZR0"
            className="closing-section__image"
            sizes="(max-width: 1023px) calc(100vw - 2rem), 710px"
          />
        </figure>
      </div>
    </section>
  )
}
