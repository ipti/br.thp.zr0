import "./card.css";

interface ZCardProps {
    title?: string,
    description?: string,
    count?: number
    icon?: boolean
    img?: boolean,
    path_img_or_icon?: string
}


export default function ZCard(props: ZCardProps) {
    return (
        <div className="p-card flex flex-row cursor-pointer align-content-center">
            <div className="flex flex-row align-content-center">
           
            <div className={`boxQuantity`}>
                {props.img && <img src={props.path_img_or_icon} alt="" style={{ height: 40 }} />}
                {props.icon && <i className={props.path_img_or_icon} style={{ fontSize: "32px" }} />}
            </div>
            <div className="p-3" />
            <div className="flex flex-row justify-content-between align-content-center" id="space-between" style={{ width: "100%" }}>
                <div id="space-between">
                    <h2>{props.title}</h2>
                    <div className="p-2" />
                    <p style={{ fontSize: "14px" }}>{props.description}</p>
                </div>
                <div id="center">
                    <h1>{props.count}</h1>
                </div>
            </div>
                 
            </div>
        </div>
    )
}