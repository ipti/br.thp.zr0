'use client'
import './impact.css'
import '../home.css'
import { useEffect } from 'react';
export default function Impact() {

    useEffect(() => {
    const items = document.querySelectorAll(".impact-item");

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            // Adiciona a classe "active" ao elemento visível
            entry.target.classList.add("active");

            // Opcional: Desconectar o observer após ativar a animação
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.2 } // Ativa quando 20% do item está visível
    );

    items.forEach((item) => observer.observe(item));

    return () => observer.disconnect(); // Cleanup ao desmontar o componente
  }, []);


    const impactStats = [
        { number: '200', label: 'Peças transformadas' },
        { number: '4', label: 'Anos de experiência' },
        { number: '5.650', label: 'Clientes satisfeitos' },
        { number: '10.00', label: 'Avaliação média' }
    ]
    return (
        <section className='section-home'>
            <div className="impact-section">
                <div>
                    <div className="impact-container">
                        <div className="impact-header">
                            <h2>Impacto</h2>
                        </div>
                        <div className="impact-grid">
                            {impactStats.map((stat, index) => (
                                <div key={index} className="impact-item">
                                    <div className="impact-number">{stat.number}</div>
                                    <div className="impact-label">{stat.label}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}