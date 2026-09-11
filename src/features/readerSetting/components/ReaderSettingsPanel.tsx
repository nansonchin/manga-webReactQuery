import { useReaderSettings } from "../context/ReaderSettingContext";

function ReaderSettingsPanel(){
    const {settings, dispatch} = useReaderSettings();

    return (
        <aside className="reader-settings">
            <div className="reader-settings-section">
                <div>Page Mode</div>

                <div className="reader-settings-options">
                    <button 
                        type="button" 
                        className={settings.pageMode === "long-strip"? "active":""}
                        onClick={()=>dispatch({
                            type:"SET_PAGE_MODE",
                            payload:"long-strip"
                        })}
                    >
                        Long Strip
                    </button>
                    <button 
                        type="button" 
                        className={settings.pageMode === "single-page"? "active":""}
                        onClick={()=>dispatch({
                            type:"SET_PAGE_MODE",
                            payload:"single-page"
                        })}
                    >
                        Single Page
                    </button>
                </div>
                <div className="reader-settings-options">
                    <div>Theme</div>
                    <button
                        type="button"
                        className={
                            settings.theme ==="light"? "active":""
                        }
                        onClick={()=> dispatch({
                            type:"SET_COLOR",
                            payload:"light"
                        })}
                    >
                        Light
                    </button>
                     <button
                        type="button"
                        className={
                            settings.theme ==="dark"? "active":""
                        }
                        onClick={()=> dispatch({
                            type:"SET_COLOR",
                            payload:"dark"
                        })}
                    >
                        Dark
                    </button>
                </div>
                <div className="reader-settings-section">
                    <button 
                        type="button"
                        className="reader-settings-reset"
                        onClick={()=>dispatch({type:"RESET"})}
                    >
                        Reset Settings
                    </button>
                </div>
            </div>
        </aside>
    )

}

export default ReaderSettingsPanel;