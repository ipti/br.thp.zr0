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
    if(!perfil) return false
    if(perfil.role === 'ADMIN') return true
    console.log('Page:', page);
    console.log(perfil?.page.find(props => page.includes(props.page))?.read )
    return perfil?.page.find(props => page.includes(props.page))?.read 
 }