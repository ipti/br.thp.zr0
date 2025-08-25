import "./about.css";

export default function About() {
  return (
    <section className="section-sobre">
      <div className="content">
        <div className="grid">
          <div>
            <h2>Sobre a Zro</h2>
          </div>
          <div>
            <div className="mb-3">
              <p>
                Design original produzido através de processo sustentável
                onde os dejetos são cuidados pelo meio técnico com
                controle de qualidade, se qualidade se deixa o produto
                não vai ser vendido.
              </p>
            </div>
            <div className="mb-3">
              <p>
                Somos sobre a Zro como uma empresa Brasileira, física, de
                verdade, com operação na vida real e por isso oferecemos
                trabalho de qualidade reconhecida através do Brasil.
              </p>
            </div>
            <button className="btn-sobre">Saiba mais <i className="pi pi-arrow-right" /></button>
          </div>
        </div>
      </div>
    </section>

  );
}
