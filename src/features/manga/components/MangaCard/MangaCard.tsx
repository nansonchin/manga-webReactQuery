import './MangaCard.scss'

type MangaCardProps ={
    title:string,
    description:string,
    coverUrl:string |null
}

function MangaCard({title,description,coverUrl}:MangaCardProps){
    return(
        <article className="manga-card">
            <div className="manga-card_cover">
                {
                    coverUrl? 
                    <img src={coverUrl} alt={title}/> 
                    : <span>No Cover Yet</span>
                }
                
            </div>

            <div className="manga-card_body">
                <div className="manga-card_title">{title}</div>
                <div className="manga-card_description">{description}</div>
            </div>
        </article>
    )
}

export default MangaCard