import './contact.css'
import '../home.css'
import ZInputText from '@/components/input/input'
import ZInputTextArea from '@/components/input_text_area/input_text_area'

export default function Contact() {
  return (
    <section className="screen_container">
      <div className="product-header">
        <h2>Cada peça carrega uma história</h2>
        <p>
          Produzido artesanalmente com plástico reciclado, cada móvel é único e
          feito com propósito.
        </p>
      </div>
      <div className="container_contact">
        <div className="grid w-full md:w-6">
          <div className="col-12 md:col-6">
            <ZInputText placeholder="Nome" />
          </div>
          <div className="col-12 md:col-6">
            <ZInputText placeholder="Assunto" />
          </div>
          <div className="col-12">
            <ZInputText placeholder="Email" />
          </div>
          <div className="col-12">
            <ZInputTextArea
              autoResize
              cols={30}
              style={{ maxHeight: '256px' }}
              rows={5}
              placeholder="Mensagem"
            />
          </div>
        </div>
      </div>
    </section>
  )
}
