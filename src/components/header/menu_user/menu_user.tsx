import { User } from "@/app/seller/user/type"
import { useFetchUserToken } from "@/service/global_request/query"
import ZAvatar from "@/components/avatar/avatar"
import "./menu_user.css"
import ZDivider from "@/components/divider/divider"
import { logout } from "@/service/cookies"
import { useRouter } from "next/navigation"

export default function MenuUser() {

    const history = useRouter()

    const {data: userRequest} = useFetchUserToken()

    const user: User | undefined = userRequest


    return (
        <div className="menu_user">
             <div className="item_menu" onClick={() => {
                history.push("/profile")
             }}>
                <ZAvatar label={user?.name?.slice(0,1)} shape="circle" size="large" />
                <div className="flex flex-column">
                <p>{user?.name}</p>
                <p className="cursor-pointer mt-0">Meu perfil {">"}</p>
                </div>
            </div>
            <ZDivider />
            <div className="item_menu">
                <div
                    style={{
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "center",
                    }}
                    onClick={() => {history.push("/cart")}}
                >
                    <i className="pi pi-shopping-cart" />
                </div>
                <p>Carrinho</p>
            </div>
            <div className="item_menu">
                <div
                    style={{
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "center",
                    }}
                    onClick={() => {history.push("/profile/order")}}
                >
                    <i className="pi pi-box" />
                </div>
                <p>Pedidos</p>
            </div>
             <div className="item_menu" onClick={() => {logout(); window.location.reload()}}>
                <div
                    style={{
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "center",
                    }}
                >
                    <i className="pi pi-sign-out" />
                </div>
                <p>Sair</p>
            </div>
        </div>
    )
}