import { SliderBarType } from "@/components/slider_bar/type";
import { Profile } from "./use_permission";

export interface Perfil {
    role: string;
    page: {
        page: string;
        create?: boolean;
        read?: boolean;
        update?: boolean;
        delete?: boolean;
    }[];
    menu?: SliderBarType;
}

export const acessUpdatePage = (perfil?: Profile, page: string) => {
    if (!perfil) return false;
    if (perfil.role === "ADMIN") return true;

    // Filtra todas que casam
    const matches = perfil.pages?.filter((p) => page.includes(p.page));

    if (matches?.length === 0) return false;

    // Escolhe a mais específica (maior comprimento)
    const bestMatch = matches?.reduce((prev, current) =>
        current.page.length > prev.page.length ? current : prev
    );

    return bestMatch.update;
};
 