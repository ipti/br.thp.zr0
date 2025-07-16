"use client"
import { User } from "@/app/seller/user/type"
import ZAvatar from "@/components/avatar/avatar"
import { useFetchUserToken } from "@/service/global_request/query"
import CardProfile from "./card_profile/card_profile"

export default function ProfileComponent() {

    const { data: userRequest } = useFetchUserToken()

    const user: User | undefined = userRequest

    const itens = [{
        title: "Dados de cadastro",
        description: "Nome de preferência e dados para te identificar.",
        icon: true,
        src: "pi pi-user",
        link: "/profile/your_information"
    }, {
        title: "Endereços",
        description: "Endereços salvos na sua conta.",
        icon: true,
        src: "pi pi-map-marker"
    }, {
        title: "Teste",
        description: "Teste para a descriç,ão do card da tela de perfil",
        icon: true,
        src: "pi pi-user"
    }, {
        title: "Teste",
        description: "Teste para a descriç,ão do card da tela de perfil",
        icon: true,
        src: "pi pi-user"
    }]

    return (
        <div className="p-4">
            <div className="flex flex-row gap-3 mb-6 mt-2">
                <ZAvatar label="P" size="xlarge" shape="circle" />
                <div className="flex flex-column justify-content-center">
                    <h3>
                        {user?.name}
                    </h3>
                    <p>{user?.email}</p>
                </div>
            </div>

            <div className="grid">
                {itens.map((item, key) => {
                    return (
                        <div key={key} className="col-12 md:col-4">
                            <CardProfile title={item.title} description={item.description} icon={item.icon} src={item.src} link={item.link} />
                        </div>
                    )
                })}
            </div>
        </div>
    )
}