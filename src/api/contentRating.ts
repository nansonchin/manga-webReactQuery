export const ALLOWED_CONTENT_RATINGS=["sage","suggestive"] as const;

export function appendContentRatings(params:URLSearchParams):void{
    ALLOWED_CONTENT_RATINGS.forEach((rating)=>{
        params.append("contentRating[]",rating)
    })
}

