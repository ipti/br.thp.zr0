import CardComponent from "@/components/card/card";
import "./login.css"
import "../globals.css"

export default function Login() {
    return (
        <div className="container">

            <CardComponent>
                <div className="flex-direction-column" style={{}}>

                    <label>Email</label>
                    <input>
                    </input>
                    <label>Senha</label>

                    <input>
                    </input>
                <button>Entrar</button>
                </div>
            </CardComponent>
        </div>
    )
}