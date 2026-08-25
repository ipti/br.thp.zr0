import Image from 'next/image'
import brazilPresenceMap from '@/assets/img/home/brazil_presence_map.svg'
import '../landing.css'
import './presence.css'

const impactMetrics = [
  { label: 'Toneladas de resíduos processados', value: 'XXXX' },
  { label: 'Cooperativas criadas', value: 'XX' },
  { label: 'Artesãs formadas', value: 'XXX' },
  { label: 'Artesãs formadas', value: 'XXX' },
]

function BrazilPresenceMap() {
  return (
    <figure className="landing-presence__map-figure">
      <Image
        src={brazilPresenceMap}
        alt="Mapa do Brasil com estados destacados"
        sizes="(max-width: 599px) 90vw, 30rem"
        className="landing-presence__map-image"
      />

      <figcaption className="landing-presence__map-caption">
        Estados com presença e expansão das Oficinas de Transformação.
      </figcaption>
    </figure>
  )
}

export default function Presence() {
  return (
    <section
      className="landing-section landing-presence"
      aria-labelledby="landing-presence-title"
    >
      <div className="landing-content landing-presence__inner">
        <header className="landing-presence__header">
          <h2 id="landing-presence-title" className="landing-presence__title">
            Onde estamos
          </h2>
        </header>

        <div className="landing-presence__body">
          <p>
            A primeira OT foi implantada em Pedra Furada, no município de Santa Luzia do Itanhy,
            em Sergipe.
          </p>
          <p>
            Foi ali, ao lado das mulheres da comunidade, que a ZR0 desenvolveu e colocou em prática
            sua metodologia de transformação local. Um modelo construído por mulheres e para
            capacitar mulheres, aumentar sua autonomia e criar as condições para que elas próprias
            transformem resíduos em produtos de qualidade, gerando renda e fortalecendo a economia
            do território.
          </p>
          <p>
            Hoje, essa experiência inspira a implantação de novas Oficinas de Transformação em
            diferentes estados do país. Cada nova unidade amplia uma rede de pessoas, conhecimento
            e oportunidades, além de gerar resultados que comprovam o potencial desse modelo:
          </p>
        </div>

        <dl className="landing-presence__metrics">
          {impactMetrics.map((metric, index) => (
            <div className="landing-presence__metric" key={`${metric.label}-${index}`}>
              <dt>{metric.label}</dt>
              <dd>{metric.value}</dd>
            </div>
          ))}
        </dl>

        <BrazilPresenceMap />
      </div>
    </section>
  )
}
