'use client'
import './about.css'
import '../home.css'
import { useEffect } from 'react'

export default function About() {
  useEffect(() => {
    // Selecionar todos os elementos que queremos observar
    const elements = document.querySelectorAll(
      '.section-sobre h2, .section-sobre p'
    )

    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            // Quando o elemento é visível no viewport, adiciona a classe "animate"
            entry.target.classList.add('animate')

            // Opcional: Desconectar o observer após a animação ser ativada
            observer.unobserve(entry.target)
          }
        })
      },
      { threshold: 0.2 } // Ativa quando 20% do elemento estiver visível
    )

    // Passa o observer em cada elemento
    elements.forEach(el => observer.observe(el))

    // Cleanup do observer ao desmontar o componente
    return () => observer.disconnect()
  }, [])

  return (
    <section className="section-home">
      <div className="section-sobre">
        <div className="content">
          <div className="grid">
            <div className="flex flex-column justify-content-center align-items-start">
              <h2>Sobre a Zro</h2>
            </div>
            <div>
              <div className="mb-3">
                <p>
                  Design original, propósito social e produção sustentável estão
                  na essência dos produtos ZR0. Assim como cada peça é única e
                  feita a partir de plástico reciclado, nossas coleções permitem
                  diversas possibilidades de aplicação — de carteiras escolares
                  a móveis exclusivos.
                </p>
              </div>
              <div className="mb-3">
                <p>
                  Ao escolher a ZR0, você apoia mulheres artesãs da Pedra Furada
                  e contribui para um planeta mais limpo.
                </p>
              </div>
              <a href="/about-us" className="btn-sobre">
                Saiba mais <i className="pi pi-arrow-right" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
