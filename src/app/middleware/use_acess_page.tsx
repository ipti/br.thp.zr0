 interface Perfil {
    role: string;
    page: {
        page: string;
        create: boolean;
        read: boolean;
        update: boolean;
        delete: boolean;
    }[];
    menu: {
        itens: {
            label: string;
            icon: any;
            link: string;
        }[];
    };
}
 
 export const acessReadPage = (perfil:Perfil, page: string ) => {
    return perfil.page.find(props => props.page === page)?.read 
 }