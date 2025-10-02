import ZInputText from "@/components/input/input";
import "./contact.css";
import ZInputTextArea from "@/components/input_text_area/input_text_area";
import '../home.css'

export default function Contact() {
    return (
        <section className="section-home">
            <div className="container_contact">
                <h1>
                    Contato
                </h1>
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
                        <ZInputTextArea autoResize cols={30} style={{ maxHeight: "256px" }} rows={5} placeholder="Mensagem" />
                    </div>
                </div>
            </div>
        </section>
    )
}