"use client"
import { ZButton } from "@/components/button/button"
import { useRouter } from "next/navigation"
import "./unauthorized.css"

export const Unauthorized = () => {

    const navigate = useRouter();
    return (
        <div className="container-unauthorized text-center flex flex-column align-items-center justify-content-center gap-2 mt-5">
            <i className="pi pi-exclamation-triangle" style={{color: "#F07724", fontSize: "3.5rem"}}/>
            <h2 className="mt-3">Usuário não autorizado</h2>
            <p style={{color: "#BABFC2"}}>O usuário não tem acesso a página</p>
            <div className="flex flex-row justify-content-center">
            <ZButton label="Voltar" className="mt-3" onClick={() => { navigate.back() }} />
            </div>
        </div>
    )
}