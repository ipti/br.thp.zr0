import { apiUrl } from "@/service/url_api"
import { User } from "../seller/user/type"
import { Perfil } from "./use_acess_page"

export const Permission = async (token: { name: string, value: string }) => {

    const res = await fetch(`${apiUrl}user-bff/token`, {
        method: "GET", // Método da requisição (opcional; GET é o padrão)
        cache: "no-store", // Força rodar em runtime, não no build
        headers: {
            "Authorization": `Bearer ${token.value}`, // Adiciona o token no cabeçalho
            "Content-Type": "application/json"  // Define o content type
        }
    });

    const user: User = await res.json()

    return user ? perfis.find(perfil => perfil.role === user.role) : undefined
}

const perfis: Perfil[] = [
    {
        role: 'ADMIN', page: [{ page: '*' }], menu: {
            itens: [
                {
                    label: "Oficinas de Transformações",
                    icon: <i className="pi pi-warehouse"></i>,
                    link: "/seller/transformation-workshop",
                },
                {
                    label: "Pedidos da OT",
                    icon: <i className="pi pi-receipt"></i>,
                    link: "/seller/transformation-workshop/orders",
                },
                {
                    label: "Produtos da OT",
                    icon: <i className="pi pi-th-large"></i>,
                    link: "/seller/transformation-workshop/product",
                },
                {
                    label: "Membros da OT",
                    icon: <i className="pi pi-users"></i>,
                    link: "/seller/transformation-workshop/member",
                },
                {
                    label: "Categorias",
                    icon: <i className="pi pi-sitemap"></i>,
                    link: "/seller/category",
                },
                {
                    label: "Produtos",
                    icon: <i className="pi pi-th-large"></i>,
                    link: "/seller/product",
                },

                {
                    label: "Usuários",
                    icon: <i className="pi pi-users"></i>,
                    link: "/seller/user",
                },
            ]
        }
    },
    {
        role: 'SELLER_MANAGER',
        page: [
            {
                page: "category",
                create: false,
                read: true,
                update: false,
                delete: false
            },
            {
                page: "category/create",
                create: false,
                read: false,
                update: false,
                delete: false
            },
            {
                page: "category/update",
                create: false,
                read: false,
                update: false,
                delete: false
            },
            {
                page: "home",
                create: false,
                read: true,
                update: false,
                delete: false
            },
            {
                page: "product",
                create: false,
                read: true,
                update: false,
                delete: false
            },
            {
                page: "product/create",
                create: false,
                read: false,
                update: false,
                delete: false
            },
            {
                page: "product/update",
                create: false,
                read: false,
                update: false,
                delete: false
            },
            {
                page: "product/one",
                create: false,
                read: false,
                update: false,
                delete: false
            },
            {
                page: "transformation-workshop",
                create: false,
                read: true,
                update: true,
                delete: false
            },
            {
                page: "transformation-workshop/create",
                create: false,
                read: true,
                update: true,
                delete: false
            },
            {
                page: "transformation-workshop/member",
                create: true,
                read: true,
                update: true,
                delete: true
            },
            {
                page: "transformation-workshop/orders",
                create: true,
                read: true,
                update: true,
                delete: true
            },
            {
                page: "transformation-workshop/one",
                create: true,
                read: true,
                update: true,
                delete: true
            },
            {
                page: "transformation-workshop/product",
                create: true,
                read: true,
                update: true,
                delete: true
            },
            {
                page: "transformation-workshop/update",
                create: true,
                read: true,
                update: true,
                delete: true
            },
            {
                page: "user",
                create: false,
                read: true,
                update: false,
                delete: false
            },
            {
                page: "user/create",
                create: false,
                read: true,
                update: false,
                delete: false
            },
            {
                page: "user/update",
                create: false,
                read: true,
                update: false,
                delete: false
            },
        ],
        menu: {
            itens: [
                {
                    label: "Oficinas de Transformações",
                    icon: <i className="pi pi-warehouse"></i>,
                    link: "/seller/transformation-workshop",
                },
                {
                    label: "Pedidos da OT",
                    icon: <i className="pi pi-receipt"></i>,
                    link: "/seller/transformation-workshop/orders",
                },
                {
                    label: "Produtos da OT",
                    icon: <i className="pi pi-th-large"></i>,
                    link: "/seller/transformation-workshop/product",
                },
                {
                    label: "Membros da OT",
                    icon: <i className="pi pi-users"></i>,
                    link: "/seller/transformation-workshop/member",
                },
                {
                    label: "Usuários",
                    icon: <i className="pi pi-users"></i>,
                    link: "/seller/user",
                },
            ],
        }
        ,
    },
    {
        role: 'SELLER',
        page: [
            {
                page: "category",
                create: false,
                read: false,
                update: false,
                delete: false
            },
            {
                page: "category/create",
                create: false,
                read: false,
                update: false,
                delete: false
            },
            {
                page: "category/update",
                create: false,
                read: false,
                update: false,
                delete: false
            },
            {
                page: "home",
                create: false,
                read: false,
                update: false,
                delete: false
            },
            {
                page: "product",
                create: false,
                read: true,
                update: false,
                delete: false
            },
            {
                page: "product/create",
                create: false,
                read: false,
                update: false,
                delete: false
            },
            {
                page: "product/update",
                create: false,
                read: false,
                update: false,
                delete: false
            },
            {
                page: "product/one",
                create: false,
                read: false,
                update: false,
                delete: false
            },
            {
                page: "transformation-workshop",
                create: false,
                read: true,
                update: true,
                delete: false
            },
            {
                page: "transformation-workshop/create",
                create: false,
                read: true,
                update: true,
                delete: false
            },
            {
                page: "transformation-workshop/member",
                create: true,
                read: true,
                update: true,
                delete: true
            },
            {
                page: "transformation-workshop/orders",
                create: true,
                read: true,
                update: true,
                delete: true
            },
            {
                page: "transformation-workshop/one",
                create: true,
                read: true,
                update: true,
                delete: true
            },
            {
                page: "transformation-workshop/product",
                create: false,
                read: true,
                update: false,
                delete: false
            },
            {
                page: "transformation-workshop/update",
                create: false,
                read: true,
                update: false,
                delete: false
            },
            {
                page: "user",
                create: false,
                read: false,
                update: false,
                delete: false
            },
            {
                page: "user/create",
                create: false,
                read: false,
                update: false,
                delete: false
            },
            {
                page: "user/update",
                create: false,
                read: false,
                update: false,
                delete: false
            },
        ],
        menu: {
            itens: [
                {
                    label: "Oficinas de Transformações",
                    icon: <i className="pi pi-warehouse"></i>,
                    link: "/seller/transformation-workshop",
                },
                {
                    label: "Pedidos da OT",
                    icon: <i className="pi pi-receipt"></i>,
                    link: "/seller/transformation-workshop/orders",
                },
                {
                    label: "Produtos da OT",
                    icon: <i className="pi pi-th-large"></i>,
                    link: "/seller/transformation-workshop/product",
                },
                {
                    label: "Membros da OT",
                    icon: <i className="pi pi-users"></i>,
                    link: "/seller/transformation-workshop/member",
                },
                {
                    label: "Usuários",
                    icon: <i className="pi pi-users"></i>,
                    link: "/seller/user",
                },
            ],
        }
    },
    { role: 'USER', page: [{ page: '*' }], },
]