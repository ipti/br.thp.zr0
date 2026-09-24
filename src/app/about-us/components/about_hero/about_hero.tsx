import Image from 'next/image'
import heroTexture from '@/assets/img/home/hero/hero_texture.png'
import heroChair from '@/assets/img/about_us/left.png'
import heroPerson from '@/assets/img/about_us/hero_person_scene.png'
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

      <div className="about-hero__media about-hero__media--chair">
        <Image
          src={heroChair}
          alt="Cadeira de design feita com plástico reciclado"
          priority
          className="about-hero__media-img"
        />
      </div>

      <div className="about-us__content about-hero__grid">
        <div className="about-hero__text">
          <h1 id="about-hero-title" className="about-hero__title">
            <span>Lixo é uma</span>
            <span>invenção humana</span>
          </h1>
          <p className="about-hero__subtitle">
            <span>Não transformamos apenas resíduos.</span>
            <span>Transformamos comunidades.</span>
          </p>
          <p className="about-hero__description">
            A ZR0 transforma o que antes seria descarte em produtos duráveis e de design com valor
            agregado, conectando economia circular, inclusão produtiva e desenvolvimento local.
          </p>
        </div>
      </div>

      <div className="about-hero__media about-hero__media--person">
        <Image
          src={heroPerson}
          alt="Mulher sentada em uma cadeira de plástico reciclado segurando uma xícara"
          priority
          className="about-hero__media-img"
        />
      </div>
    </section>
  )
}
