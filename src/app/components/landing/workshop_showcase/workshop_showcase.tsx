import Image from 'next/image'
import workshopLeft from '@/assets/img/home/foto-left.svg'
import workshopPressing from '@/assets/img/home/foto1.svg'
import workshopCutting from '@/assets/img/home/foto2.svg'
import workshopWashing from '@/assets/img/home/foto3.svg'
import workshopRight from '@/assets/img/home/foto-right.svg'
import '../landing.css'
import './workshop_showcase.css'

const workshopImages = [
  {
    alt: 'Mulheres e crianças reunidas em uma oficina comunitária',
    className: 'landing-workshop-showcase__image--community-left',
    src: workshopLeft,
  },
  {
    alt: 'Artesã lavando resíduos plásticos triturados em um recipiente',
    className: 'landing-workshop-showcase__image--washing',
    src: workshopWashing,
  },
  {
    alt: 'Artesã cortando uma placa de plástico reciclado com uma serra',
    className: 'landing-workshop-showcase__image--cutting',
    src: workshopCutting,
  },
  {
    alt: 'Artesãs operando uma máquina durante a produção de uma peça',
    className: 'landing-workshop-showcase__image--pressing',
    src: workshopPressing,
  },
  {
    alt: 'Resíduos plásticos preparados para um novo ciclo produtivo',
    className: 'landing-workshop-showcase__image--residue-right',
    src: workshopRight,
  },
]

export default function WorkshopShowcase() {
  return (
    <section
      className="landing-section landing-workshop-showcase"
      aria-labelledby="landing-workshop-showcase-title"
    >
      <div className="landing-workshop-showcase__card">
        <header className="landing-workshop-showcase__header">
          <p className="landing-workshop-showcase__eyebrow">Oficina de Transformação</p>
          <h2 id="landing-workshop-showcase-title" className="landing-workshop-showcase__title">
            <span>Onde os resíduos</span>
            <span>ganham um novo destino.</span>
            <span>E as pessoas também.</span>
          </h2>
        </header>

        <div
          className="landing-workshop-showcase__gallery"
          role="list"
          aria-label="Registros das Oficinas de Transformação"
        >
          {workshopImages.map((image) => (
            <figure className="landing-workshop-showcase__media" role="listitem" key={image.alt}>
              <Image
                src={image.src}
                alt={image.alt}
                sizes="(max-width: 599px) 46vw, (max-width: 1199px) 28vw, 19vw"
                className={`landing-workshop-showcase__image ${image.className}`}
              />
            </figure>
          ))}
        </div>

        <div className="landing-workshop-showcase__body">
          <p className="landing-workshop-showcase__lead">A OT é a alma da ZR0.</p>
          <p>
            Mais do que um espaço de produção, ela é uma tecnologia social desenvolvida para ser
            acessível, eficiente e replicável.
          </p>
          <p>
            Cada unidade reúne produção colaborativa e geração de renda em um modelo capaz de
            transformar resíduos em bens duráveis com valor agregado.
          </p>
          <p>
            Ao mesmo tempo em que amplia o ciclo de vida dos materiais, fortalece comunidades por
            meio do conhecimento, do trabalho e da autonomia de mulheres artesãs.
          </p>
          <p>
            Seu modelo combina simplicidade operacional, baixo custo e alto potencial de
            replicação, permitindo que diferentes comunidades desenvolvam uma cadeia produtiva
            própria.
          </p>
          <p>
            Ao conectar catadores, cooperativas, mulheres artesãs, poder local e consumidores, a
            ZR0 cria um ecossistema onde todos participam da construção de um futuro mais
            sustentável.
          </p>
        </div>
      </div>
    </section>
  )
}
