import { createContext, useContext, useEffect, useReducer, type Dispatch, type ReactNode } from "react";
import type { ReaderPageMode, ReaderSettings, typeReaderTheme } from "../type";

type ReaderSettingsAction =
  | {
      type: "SET_PAGE_MODE";
      payload: ReaderPageMode;
    }
  | {
      type: "SET_COLOR";
      payload: typeReaderTheme;
    }
  | {
      type: "RESET";
    };


type ReadersSettingsContextValue ={
    settings:ReaderSettings;
    dispatch:Dispatch<ReaderSettingsAction>
};

type ReaderSettingsProviderProps={
    children:ReactNode
}

export const initialReaderSettings: ReaderSettings = {
  pageMode: "long-strip",
  theme: "light",
};

const READER_SETTINGS_STORAGE_KEY = "manga-reader-settings"

function isReaderSettings(
  value:unknown
):value is ReaderSettings{
  if(!value || typeof value !== "object"){
    return false;
  }

  const settings = value  as Record<string,unknown>

  const validPageMode = settings.pageMode ==="long-strip" || settings.pageMode === "single-page"

  const validTheme = settings.theme === "light" || settings.theme === "dark"

  return validPageMode && validTheme
}

function loadReaderSettings():ReaderSettings{
  const stored = localStorage.getItem(READER_SETTINGS_STORAGE_KEY)

  if(!stored){
    return initialReaderSettings;
  }

  try{
    const parsed:unknown = JSON.parse(stored)

    if(!isReaderSettings(parsed)){
      return initialReaderSettings
    }

    return parsed
  }catch{
    return initialReaderSettings
  }
}

function saveReaderSettings(
  settings:ReaderSettings,
):void{
  localStorage.setItem(READER_SETTINGS_STORAGE_KEY,JSON.stringify(settings))
}

const ReaderSettingContext =
    createContext<ReadersSettingsContextValue | null>( null)


function readerSettingsReducer(
  state: ReaderSettings,
  action: ReaderSettingsAction,
): ReaderSettings {
  switch (action.type) {
    case "SET_PAGE_MODE":
      return {
        ...state,
        pageMode: action.payload,
      };

    case "SET_COLOR":
      return {
        ...state,
        theme: action.payload,
      };
    case "RESET":
      return initialReaderSettings;

    default:
      return state;
  }
}

export function ReaderSettingsProvider({
    children
}:ReaderSettingsProviderProps){
    const [settings,dispatch] = useReducer(
        readerSettingsReducer,
        undefined,
        loadReaderSettings
    )

    useEffect(()=>{
      saveReaderSettings(settings)
    },[settings])

    return(
        <ReaderSettingContext.Provider value={{settings,dispatch}}>
                {children}
        </ReaderSettingContext.Provider>
    )
}

export function useReaderSettings(){
    const context = useContext(
        ReaderSettingContext
    )

    if(!context){
        throw new Error(`useReaderSettings must be used inside ReaderSettingsProvider`)
    }
    return context;
}