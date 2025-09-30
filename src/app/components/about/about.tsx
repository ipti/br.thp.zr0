import "./about.css";
import '../home.css'

export default function About() {
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
                  Design original, propósito social e produção sustentável estão na essência dos produtos ZR0. Assim como cada peça é única e feita a partir de plástico reciclado, nossas coleções permitem diversas possibilidades de aplicação — de carteiras escolares a móveis exclusivos.
                </p>
              </div>
              <div className="mb-3">
                <p>
                  Ao escolher a ZR0, você apoia mulheres artesãs da Pedra Furada e contribui para um planeta mais limpo.
                </p>
              </div>
              <button className="btn-sobre">Saiba mais <i className="pi pi-arrow-right" /></button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
