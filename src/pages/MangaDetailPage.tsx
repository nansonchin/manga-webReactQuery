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
                {data.title}
            </div>
        </div>
    )
}

export default MangaDetailPage