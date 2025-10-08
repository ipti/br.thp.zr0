'use client'

import { acessReadPage, Perfil } from "@/app/middleware/use_acess_page"
import { Profile } from "@/app/middleware/use_permission";
import { usePathname } from "next/navigation";

export const AccessPage = ({ profile, children }: { profile: Profile | undefined, children: React.ReactNode }) => {
    const pathname = usePathname();
    const isAcesss = acessReadPage(profile, pathname)
    return isAcesss ? <>{children}</> : (
        <div className="text-center text-red-500 font-bold">Acesso Negado</div>
    )
}