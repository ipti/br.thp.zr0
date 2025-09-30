import { SliderBarType } from "@/components/slider_bar/type";

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
 
 export const acessReadPage = (perfil?:Perfil, page: string ) => {
    return perfil?.page.find(props => props.page === page)?.read 
 }