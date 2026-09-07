import { useParams } from "react-router-dom"
import { useMangaDetail } from "../features/manga/hooks/useMangaDetails"

function MangaDetailPage(){
    const {id} = useParams()

    const {data, isPending,isError,error} = useMangaDetail(id!)

    if(isPending){
        return(
            <div>
                Loading...
            </div>
        )
    }

    if(isError){
        return (
            <div>
                error: {error.message}
            </div>
        )
    }
    return(
        <div>
            <div>
               {
                data.coverLargeUrl && <img src={data.coverLargeUrl} alt={data.title} loading="lazy" decoding="async"/>
               }
               <h1>{data.title}</h1>
               <p>{data.description}</p>
               <div>
                Status: {data.status}
               </div>
               <div>
                Author:{
                    data.author.map(author =>(
                        <span key={author}>{author}</span>
                    ))
                }
               </div>
               <div>
                Artist: {
                    data.artist.map(artist=>(
                        <span key={artist}>{artist}</span>
                    ))
                }
               </div>
                  <div>
                Tags: {
                    data.tags.map(tag=>(
                        <span key={tag}>{tag}</span>
                    ))
                }
               </div>
            </div>
        </div>
    )
}

export default MangaDetailPage