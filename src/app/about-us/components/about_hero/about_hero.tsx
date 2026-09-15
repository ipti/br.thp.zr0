import Image from 'next/image'
import heroTexture from '@/assets/img/home/hero/hero_texture.png'
import './about_hero.css'

export default function AboutHero() {
  return (
    <section id="history" className="about-hero" aria-labelledby="about-hero-title">
      <Image
        src={heroTexture}
        alt=""
        aria-hidden="true"
        fill
        priority
        sizes="100vw"
        className="about-hero__texture"
      />

      <div className="about-us__content about-hero__grid">
        <div
          className="about-hero__media about-hero__media--chair"
          role="img"
          aria-label="Cadeira de design feita com plástico reciclado"
        />

        <div className="about-hero__text">
          <h1 id="about-hero-title" className="about-hero__title">
            Lixo é uma invenção humana
          </h1>
          <p className="about-hero__subtitle">
            Não transformamos apenas resíduos. Transformamos comunidades.
          </p>
          <p className="about-hero__description">
            A ZR0 transforma o que antes seria descarte em produtos duráveis e de design com valor
            agregado, conectando economia circular, inclusão produtiva e desenvolvimento local.
          </p>
        </div>

        <div
          className="about-hero__media about-hero__media--person"
          role="img"
          aria-label="Pessoa da comunidade parceira da ZR0"
        />
      </div>
    </section>
  )
}
