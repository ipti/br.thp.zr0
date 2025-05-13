export interface SliderBarType {
    itens: Array<ItensSlideBarType>
}

interface ItensSlideBarType {
    label: string,
    icon: React.ReactNode
    link: string
}