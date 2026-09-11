import { createContext, useContext, useReducer, type Dispatch, type ReactNode } from "react";
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

const initialReaderSettings: ReaderSettings = {
  pageMode: "long-strip",
  theme: "light",
};

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

type ReadersSettingsContextValue ={
    settings:ReaderSettings;
    dispatch:Dispatch<ReaderSettingsAction>
};

const ReaderSettingContext =
    createContext<ReadersSettingsContextValue | null>( null)

type ReaderSettingsProviderProps={
    children:ReactNode
}

export function ReaderSettingsProvider({
    children
}:ReaderSettingsProviderProps){
    const [settings,dispatch] = useReducer(
        readerSettingsReducer,
        initialReaderSettings
    )

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