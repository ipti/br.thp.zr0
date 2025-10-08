import { apiUrl } from "@/service/url_api"


export const Permission = async (token: { name: string, value: string }) => {

    const res = await fetch(`${apiUrl}user-bff/profile`, {
        method: "GET", // Método da requisição (opcional; GET é o padrão)
        cache: "no-store", // Força rodar em runtime, não no build
        headers: {
            "Authorization": `Bearer ${token.value}`, // Adiciona o token no cabeçalho
            "Content-Type": "application/json"  // Define o content type
        }
    });

    const profile: Profile | undefined = await res.json()

    return profile
}

export interface Profile {
  id: number
  role: string
  createdAt: string
  updatedAt: string
  menu: Menu[]
  pages: Page[]
}

export interface Menu {
  id: number
  profileId: number
  label: string
  link: string
  icon: string
  order: number
}

export interface Page {
  id: number
  profileId: number
  page: string
  create: boolean
  read: boolean
  update: boolean
  delete: boolean
}

