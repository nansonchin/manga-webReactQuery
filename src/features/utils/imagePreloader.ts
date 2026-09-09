//dedupe

const preloadCache = new Map <string,Promise<void>>();

export function preloadImage(src:string):Promise<void>{
    const existing = preloadCache.get(src)

    if(existing){
        return existing
    }
    const promise = new Promise<void>((resolve,reject)=>{
        const image = new Image();
        image.onload=()=>{
            resolve();
        }

        image.onerror=()=>{
            reject(
                new Error (`failed to preload image:${src}`)
            )
        }
        image.src= src
    })
    preloadCache.set(src,promise)

    return promise
    // const img = new Image();
    // img.src = src
}