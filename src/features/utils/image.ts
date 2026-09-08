export function buildCoverSrcSet(
    small:string|null,
    large:string|null,
){
    return[
        small && `${small} 256w`,
        large && `${large} 512w`
    ].filter(Boolean).join(",")
}