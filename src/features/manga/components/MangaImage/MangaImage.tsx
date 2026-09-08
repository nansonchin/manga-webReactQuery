import { useState } from "react"

type MangaImageProps={
    src:string|null
    srcSet?:string
    sizes?:string
    alt:string
    className?:string
}

function MangaImage({
    src,
    srcSet,
    sizes,
    alt,
    className
}:MangaImageProps){
    // use browser cache image to handle the loading image instead of using the react query isPending, isLoading for image handling as the image is not from json format.
    const [loaded,setLoaded] = useState(false)
    const [ error,setError] = useState(false)
    if(!src || error){
        return (
            <div className="image-fallback">
                No Image
            </div>
        )
    }

    return(
        <div className="image-wrapper">
            {
                !loaded && (
                    <div className="image-skeleton"/>
                )
            }
        <img src={src} alt={alt} srcSet={srcSet} sizes={sizes}
            loading="lazy" decoding="async" 
            className={`${className ?? ""} ${loaded? "loaded": ""}`}
            onLoad={()=>setLoaded(true)}
            onError={()=>setError(true)}
            />
                
        </div>
    )
}

export default MangaImage