import {
  DraftingCompass,
  Factory,
  GraduationCap,
  Network,
  Recycle,
  Store,
  type LucideIcon,
} from 'lucide-react'
import '../landing.css'
import './how_it_works.css'

type HowItWorksStep = {
  description: string
  icon: LucideIcon
  title: string
}

const steps: HowItWorksStep[] = [
  {
    title: 'Coleta',
    description:
      'Resíduos descartados são coletados e separados por tipo e cor, dando início a um novo ciclo.',
    icon: Recycle,
  },
  {
    title: 'Capacitação',
    description:
      'Mulheres da comunidade recebem formação para operar os equipamentos e transformar materiais.',
    icon: GraduationCap,
  },
  {
    title: 'Produção',
    description:
      'O plástico é triturado, prensado e moldado para se tornar matéria-prima novamente.',
    icon: Factory,
  },
  {
    title: 'Design',
    description:
      'Cada material ganha forma em peças úteis, duráveis e desenvolvidas com design original.',
    icon: DraftingCompass,
  },
  {
    title: 'Comercialização',
    description:
      'Os produtos chegam ao mercado e geram renda para as pessoas que participam dessa cadeia.',
    icon: Store,
  },
  {
    title: 'Escala',
    description:
      'O modelo é replicado em novos territórios, ampliando impacto, autonomia e oportunidades.',
    icon: Network,
  },
]

export default function HowItWorks() {
  return (
    <section
      className="landing-section landing-how-it-works"
      aria-labelledby="landing-how-it-works-title"
    >
      <div className="landing-content landing-how-it-works__inner">
        <header className="landing-how-it-works__header">
          <h2 id="landing-how-it-works-title" className="landing-how-it-works__title">
            Como funciona
          </h2>
          <p className="landing-how-it-works__subtitle">
            Tudo começa com aquilo que muitos deixam para trás.
          </p>
        </header>

        <ol className="landing-how-it-works__grid">
          {steps.map((step) => {
            const Icon = step.icon

            return (
              <li className="landing-how-it-works__card" key={step.title}>
                <Icon className="landing-how-it-works__icon" aria-hidden="true" strokeWidth={1.6} />
                <h3 className="landing-how-it-works__step-title">{step.title}</h3>
                <p className="landing-how-it-works__description">{step.description}</p>
              </li>
            )
          })}
        </ol>
      </div>
    </section>
  )
}
