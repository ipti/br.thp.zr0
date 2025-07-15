import "./card_profile.css"
export default function CardProfile({title, description}:{title: string, description: string}){
    return(
        <div className="card_profile">
           <h3>
             {title}
            </h3>
            <p>
                {description}
            </p>
        </div>
    )
}