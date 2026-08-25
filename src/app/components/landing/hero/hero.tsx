import Image from 'next/image'
import heroPerson from '@/assets/img/home/hero/hero_person.png'
import heroProductTable from '@/assets/img/home/hero/hero_product_table.png'
import '../landing.css'
import './hero.css'

export default function Hero() {
  return (
    <section className="landing-hero" aria-labelledby="landing-hero-title">
      <div className="landing-hero__blobs" aria-hidden="true">
        <svg
          className="landing-hero__blob landing-hero__blob--green"
          viewBox="0 0 200 160"
          focusable="false"
        >
          <path d="M40,20 C90,-10 160,10 175,60 C190,110 140,140 90,135 C40,130 -10,100 5,60 C15,35 25,30 40,20 Z" />
        </svg>
        <svg
          className="landing-hero__blob landing-hero__blob--tan"
          viewBox="0 0 200 160"
          focusable="false"
        >
          <path d="M40,20 C90,-10 160,10 175,60 C190,110 140,140 90,135 C40,130 -10,100 5,60 C15,35 25,30 40,20 Z" />
        </svg>
      </div>

      <div className="landing-hero__grid">
        <div className="landing-hero__text">
          <h1 id="landing-hero-title" className="landing-hero__title">
            Lixo é uma
            <br />
            Invenção humana
          </h1>
        </div>

        <div className="landing-hero__media landing-hero__media--person">
          <Image
            src={heroPerson}
            alt="Mulher sorridente sentada ao lado de uma mesa feita de plástico reciclado, segurando uma xícara de café"
            priority
            sizes="(max-width: 599px) 90vw, (max-width: 1023px) 45vw, 40vw"
            className="landing-hero__image"
          />
        </div>

        <div className="landing-hero__media landing-hero__media--product">
          <Image
            src={heroProductTable}
            alt="Mesa de centro redonda feita de plástico reciclado, com tampo e pernas em padrão granilite"
            sizes="(max-width: 599px) 60vw, (max-width: 1023px) 30vw, 22vw"
            className="landing-hero__image"
          />
        </div>
      </div>
    </section>
  )
}
