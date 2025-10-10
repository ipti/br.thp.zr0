'use client'

import { acessReadPage } from "@/app/middleware/use_acess_page";
import { Profile } from "@/app/middleware/use_permission";
import { usePathname } from "next/navigation";
import { Unauthorized } from "./unauthorized/unauthorized";

export const AccessPage = ({ profile, children }: { profile: Profile | undefined, children: React.ReactNode }) => {
    const pathname = usePathname();
    const isAcesss = acessReadPage(profile, pathname)
    return isAcesss ? <>{children}</> : (
        <Unauthorized />
    )
}