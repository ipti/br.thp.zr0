import communityImage from '@/assets/img/home/pessoas_zr0.svg'
import brandLogo from '@/assets/img/ZR0_logotipo.png'
import Image from 'next/image'
import './closing_statement.css'

export default function ClosingStatement() {
  return (
    <section
      className="landing-closing-statement landing-section"
      aria-labelledby="landing-closing-title"
    >
      <div className="landing-closing-statement__inner landing-content">
        <div className="landing-closing-statement__content">
          <h2
            id="landing-closing-title"
            className="landing-closing-statement__title"
          >
            Acreditamos que a sustentabilidade vai além da redução de impactos.
          </h2>

          <p className="landing-closing-statement__copy">
            É sobre criar soluções capazes de regenerar comunidades, ampliar
            oportunidades e transformar realidades por muito tempo.
          </p>

          <div className="landing-closing-statement__signature">
            <Image
              className="landing-closing-statement__logo"
              src={brandLogo}
              alt="ZR0"
            />
            <p>Do descarte à permanência.</p>
          </div>
        </div>

        <figure className="landing-closing-statement__figure">
          <Image
            className="landing-closing-statement__image"
            src={communityImage}
            alt="Mulheres e crianças reunidas em uma oficina comunitária"
            sizes="(max-width: 699px) 100vw, 48vw"
          />
        </figure>
      </div>
    </section>
  )
}
