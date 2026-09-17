import Image from 'next/image'
import manifestoVisual from '@/assets/img/product-store/manifesto-visual.jpg'
import './store_manifesto.css'

export default function StoreManifesto() {
  return (
    <section className="store-manifesto" aria-labelledby="store-manifesto-title">
      <div className="store-manifesto__inner">
        <div className="store-manifesto__text">
          <h2 id="store-manifesto-title" className="store-manifesto__title">
            Cada produto começa muito antes de chegar às suas mãos.
          </h2>

          <p className="store-manifesto__body">
            Ele nasce do trabalho de cooperativas, passa pela dedicação de mulheres artesãs e
            carrega o conhecimento compartilhado nas Oficinas de Transformação.
          </p>

          <p className="store-manifesto__body">
            Mais do que mobiliário, cada peça representa uma cadeia construída sobre colaboração,
            desenvolvimento local e economia circular.
          </p>

          <p className="store-manifesto__body">
            Ao escolher um produto ZR0, você leva para a sua casa não apenas um objeto de design,
            mas o resultado de um modelo que transforma resíduos em oportunidades e fortalece
            comunidades.
          </p>
        </div>

        <div className="store-manifesto__media">
          <Image
            src={manifestoVisual}
            alt="Painel de materiais reciclados exposto em um ambiente da ZR0"
            className="store-manifesto__visual"
            sizes="(max-width: 900px) 100vw, 58vw"
            priority
          />
        </div>
      </div>
    </section>
  )
}
