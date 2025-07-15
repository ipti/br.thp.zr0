"use client"
import { User } from "@/app/seller/user/type"
import ZAvatar from "@/components/avatar/avatar"
import { useFetchUserToken } from "@/service/global_request/query"
import CardProfile from "./card_profile/card_profile"

export default function ProfileComponent() {

    const { data: userRequest } = useFetchUserToken()

    const user: User | undefined = userRequest

    const itens = [{
        title: "Teste",
        description: "Teste para a descriç,ão do card da tela de perfil"
    }, {
        title: "Teste",
        description: "Teste para a descriç,ão do card da tela de perfil"
    }, {
        title: "Teste",
        description: "Teste para a descriç,ão do card da tela de perfil"
    }, {
        title: "Teste",
        description: "Teste para a descriç,ão do card da tela de perfil"
    }]

    return (
        <div className="p-4">
            <div className="flex flex-row gap-3 mb-5">
                <ZAvatar label="P" size="xlarge" shape="circle" />
                <div className="flex flex-column justify-content-center">
                    <h2>
                        {user?.name}
                    </h2>
                </div>
            </div>

            <div className="grid">
                {itens.map((item, key) => {
                    return (
                        <div key={key} className="col-12 md:col-4">
                            <CardProfile title={item.title} description={item.description} />
                        </div>
                    )
                })}
            </div>
        </div>
    )
}