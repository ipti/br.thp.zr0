'use client'
import ZSplitter from '@/components/splitter/splitter'
import home_right from '../../../assets/img/home_right.png'
import home_left from '../../../assets/img/left-home.png'
import logo_white from '../../../assets/img/logo_white.png'
import Image from 'next/image'
import './splitter_home.css'
import ZSplitterPanel from '@/components/splitter_panell/splitter_panel'

export default function SplitterHome() {
  return (
    <section className="section-home">
      <div className="container_splitter_home">
        <div className="container_logo">
          <Image alt="Logo white" src={logo_white} width={256} height={200} />
          <h1>Transformando plástico em oportunidades</h1>
          <button onClick={() => (window.location.href = `/product`)}>
            Conheça nossos produtos
          </button>
        </div>
        <div className="h-full">
          <ZSplitter className="h-full">
            <ZSplitterPanel className="relative  h-full w-full" size={25}>
              <Image
                alt=""
                fill
                style={{ objectFit: 'cover' }}
                src={home_right}
              />
            </ZSplitterPanel>
            <ZSplitterPanel className="relative  h-full w-full" size={75}>
              <Image
                alt=""
                fill
                style={{ objectFit: 'cover' }}
                src={home_left}
              />
            </ZSplitterPanel>
          </ZSplitter>
        </div>
      </div>
    </section>
  )
}
