import { useFetchUserToken } from "@/service/global_request/query"
import { User } from "../seller/user/type"

export const Permission = async () => {
    
     const { data: userRequest } = useFetchUserToken()
    
    const user: User | undefined = userRequest
    
    return user ? perfis.find(perfil => perfil.role === user.role) : undefined
}

const perfis = [
    { role: 'ADMIN', page: [{page: '*'}], menu: ['*'] },
    {
        role: 'SELLERMANAGER',
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
    ,},
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
    { role: 'USER', page: [{page: '*'}], menu: ['*'] },
]