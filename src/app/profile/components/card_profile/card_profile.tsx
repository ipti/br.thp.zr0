import { useRouter } from "next/navigation"
import "./card_profile.css"
export default function CardProfile({ title, description, icon, src, link }: { title: string, description: string, icon: boolean, src: string, link?: string }) {
   const history = useRouter()
    return (
        <div className="card_profile" onClick={() => link ? history.push(link) : alert("click")}>
            {icon ? <i className={src} /> : <img alt="" src={src} />}
            <div className="p-2" />
            <h3>
                {title}
            </h3>
            <div className="p-0" />
            <p>
                {description}
            </p>
        </div>
    )
}