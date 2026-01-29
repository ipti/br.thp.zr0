import ZInputText from '@/components/input/input'
import './contact.css'
import ZInputTextArea from '@/components/input_text_area/input_text_area'
import { ZButton } from '@/components/button/button'

export default function Contact() {
  return (
    <section className="screen_container">
      <div className="product-header">
        <h2>Contate-nos</h2>
        <p>
          Dúvidas, parcerias ou encomendas? Mande uma mensagem e descubra como
          podemos transformar seu ambiente com design consciente e sustentável.
        </p>
      </div>
      <div className="contact_container">
        <h2>Fale conosco</h2>
        {/* Form */}
        <div className="grid">
          <div className="col-12 md:col-6">
            <ZInputText placeholder="Nome" />
          </div>
          <div className="col-12 md:col-6">
            <ZInputText placeholder="Assunto" />
          </div>

          <div className="col-12">
            <ZInputTextArea
              autoResize
              cols={30}
              style={{ maxHeight: '256px', minHeight: '200px' }}
              rows={5}
              placeholder="Mensagem"
            />
          </div>
          <div className="col-12">
            <ZButton
              style={{
                backgroundColor: '#fff',
                width: '100%',
                color: '#000',
                borderRadius: '0.5rem',
                padding: '0.75rem',
                fontSize: '1.25rem'
              }}
            >
              Enviar
            </ZButton>
          </div>
        </div>
      </div>
    </section>
  )
}
