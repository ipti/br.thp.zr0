import pingos from '@/assets/img/home/pingos.svg'
import '../landing.css'
import './manifesto.css'

export default function Manifesto() {
  return (
    <section
      className="landing-section landing-manifesto"
      aria-labelledby="landing-manifesto-title"
    >
      <div className="landing-manifesto__decor" aria-hidden="true">
        <svg
          className="landing-manifesto__pingos"
          viewBox="0 0 1920 1980"
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          <defs>
            <filter
              id="landing-manifesto-palette"
              x="0"
              y="0"
              width="1920"
              height="1980"
              filterUnits="userSpaceOnUse"
              colorInterpolationFilters="sRGB"
            >
              <feColorMatrix
                type="matrix"
                values="0.2126 0.7152 0.0722 0 0 0.2126 0.7152 0.0722 0 0 0.2126 0.7152 0.0722 0 0 0 0 0 1 0"
              />
              <feComponentTransfer>
                <feFuncR type="linear" slope="0.781" intercept="0.257" />
                <feFuncG type="linear" slope="0.469" intercept="0.431" />
                <feFuncB type="linear" slope="0.541" intercept="0.247" />
              </feComponentTransfer>
            </filter>
          </defs>
          <image
            href={pingos.src}
            width="1920"
            height="1980"
            preserveAspectRatio="none"
            filter="url(#landing-manifesto-palette)"
          />
        </svg>
      </div>

      <div className="landing-content landing-manifesto__inner">
        <h2 id="landing-manifesto-title" className="landing-manifesto__title">
          Um novo jeito de enxergar os resíduos.
        </h2>

        <div className="landing-manifesto__body">
          <p>
            Durante muito tempo, aprendemos que resíduos representam o fim de um ciclo. Mas nós
            acreditamos exatamente no contrário.
          </p>
          <p>Eles são matéria-prima para uma nova forma de gerar valor.</p>
          <p>Valor para o meio ambiente, ao ampliar o ciclo de vida dos materiais.</p>
          <p>Valor para cooperativas e catadores, que passam a integrar uma cadeia mais justa.</p>
          <p>
            Valor para mulheres artesãs, que encontram novas possibilidades de trabalho, renda e
            autonomia.
          </p>
          <p>
            Valor para as comunidades, que fortalecem sua própria economia a partir do
            conhecimento compartilhado.
          </p>
          <p>Foi dessa visão que nasceu a ZRO.</p>
          <p>
            Um modelo de transformação local de resíduos sólidos que conecta pessoas, materiais
            descartados na natureza e economia por meio das OTs – Oficinas de Transformação,
            criando um ciclo capaz de regenerar territórios e ampliar oportunidades.
          </p>
        </div>
      </div>
    </section>
  )
}
