import Image from 'next/image'
import heroTexture from '@/assets/img/home/hero/hero_texture.png'
import './store_hero.css'

export default function StoreHero() {
  return (
    <section className="store-hero" aria-labelledby="store-hero-title">
      <Image
        src={heroTexture}
        alt=""
        aria-hidden="true"
        fill
        priority
        sizes="100vw"
        className="store-hero__texture"
      />

      <div className="store-hero__content">
        <h1 id="store-hero-title" className="store-hero__title">
          Design que transforma<br />muito mais que resíduos.
        </h1>
      </div>
    </section>
  )
}
