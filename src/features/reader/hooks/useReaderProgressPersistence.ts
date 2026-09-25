import { useEffect, useRef, useState } from "react";

type ReaderProgressKey ={
    mangaId:string;
    chapterId:string;
}

type SavedReaderProgress={
    mangaId:string;
    chapterId:string;
    page:number;
    updatedAt:number;
}

const READER_PROGRESS_STORAGE_KEY="manga-reader-progress";

function loadAllReaderProgress():SavedReaderProgress[]{
    const stored = localStorage.getItem(READER_PROGRESS_STORAGE_KEY)

    if(!stored){
        return []
    }

    try{
        const parsed:unknown = JSON.parse(stored)
        if(!Array.isArray(parsed)){
            return []
        }

        return parsed.filter(isSavedReaderProgress)
    }catch{
        return []
    }
}

function isSavedReaderProgress(value:unknown):value is SavedReaderProgress{
    if(!value || typeof value !=="object"){
        return false;
    }

    const progress = value as Record<string,unknown>

    return(
        typeof progress.mangaId === "string" &&
        typeof progress.chapterId==="string" &&
        typeof progress.page ==="number" &&
        Number.isInteger(progress.page)&&
        progress.page >=0 && typeof progress.updatedAt === "number"
    )
}

function saveAllReaderProgress(
    progressList:SavedReaderProgress[]
):void{
    localStorage.setItem(READER_PROGRESS_STORAGE_KEY, JSON.stringify(progressList))
}

function loadReaderProgress({
    mangaId,
    chapterId,
}:ReaderProgressKey):number | null{
    const progressList = loadAllReaderProgress()

    const progress = progressList.find((item)=> item.mangaId === mangaId && item.chapterId === chapterId)

    if(!progress){
        return null
    }

    return progress.page;
}

function saveReaderProgress(
    key:ReaderProgressKey,
    page:number
):void{
    const progressList = loadAllReaderProgress();

    const existingIndex = progressList.findIndex((item)=> item.mangaId === key.mangaId && item.chapterId === key.chapterId)

    const newProgress:SavedReaderProgress={
        mangaId:key.mangaId,
        chapterId:key.chapterId,
        page,
        updatedAt:Date.now()
    }

    if(existingIndex >=0){
        progressList[existingIndex]=newProgress;
    }else{
        progressList.push(newProgress)
    }
    saveAllReaderProgress(progressList)
}

export function useReaderProgressPersistence({
    mangaId,
    chapterId,
    currentPage,
    totalPages,
    enabled=true
}:ReaderProgressKey &{
    currentPage:number;
    totalPages:number;
    enabled?:boolean
}){
    // const hasRestoredRef = useRef(false)

    // const restoredPageRef = useRef<number|null>(null)    

    const [restoredPage, setRestoredPage] = useState<number|null>(null)

    const [hasRestored,setHasRestored] = useState(false)
    useEffect(()=>{
        setRestoredPage(null);
        setHasRestored(false)
    },[mangaId, chapterId])

    useEffect(()=>{
        if(!enabled){
            return;
        }

        if(hasRestored){
            return;
        }

        if(totalPages<=0){
            return
        }

        const savedPage=loadReaderProgress({
            mangaId,
            chapterId,
        })

        if(savedPage === null){
            setRestoredPage(null)
            setHasRestored(true)
            return;
        }

        const safePage = Math.min(
            Math.max(savedPage,0),
            totalPages-1
        )

        // restoredPageRef.current = safePage;
        // hasRestoredRef.current=true
        setRestoredPage(safePage)
        setHasRestored(true)
    },[
        mangaId,
        chapterId,
        totalPages,
        enabled
    ])

    useEffect(()=>{
        if(!enabled){
            return
        }

        if(!hasRestored){
            return;
        }

        if(totalPages<=0){
            return;
        }

        if(currentPage<0 || currentPage>= totalPages){
            return
        }

        saveReaderProgress({
            mangaId,
            chapterId
        },currentPage)
    },[mangaId,chapterId,currentPage,totalPages,enabled])

    return{
        restoredPage,
        hasRestored
    }
}