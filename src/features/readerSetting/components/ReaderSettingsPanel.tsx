import { useReaderSettings } from "../context/ReaderSettingContext";
import "./ReaderSettingsPanel.scss";


function ReaderSettingsPanel() {
  const { settings, dispatch } = useReaderSettings();


  return (
    <aside className="reader-settings" aria-label="Reader settings">
      <div className="reader-settings__header">
        <div>
          <span className="reader-settings__eyebrow">
            READER SYSTEM
          </span>


          <h2 className="reader-settings__title">
            Settings
          </h2>
        </div>


        <div className="reader-settings__crest" aria-hidden="true">
          B
        </div>
      </div>


      <div className="reader-settings__divider" />


      {/* =====================================================
          PAGE MODE
      ====================================================== */}


      <section className="reader-settings__section">
        <div className="reader-settings__section-heading">
          <span className="reader-settings__section-number">
            01
          </span>


          <span className="reader-settings__section-title">
            Page Mode
          </span>
        </div>


        <div className="reader-settings__options">
          <button
            type="button"
            className={`reader-settings__option ${
              settings.pageMode === "long-strip"
                ? "reader-settings__option--active"
                : ""
            }`}
            onClick={() =>
              dispatch({
                type: "SET_PAGE_MODE",
                payload: "long-strip",
              })
            }
            aria-pressed={settings.pageMode === "long-strip"}
          >
            <span className="reader-settings__option-indicator" />


            <span className="reader-settings__option-content">
              <span className="reader-settings__option-title">
                Long Strip
              </span>


              <span className="reader-settings__option-description">
                Continuous vertical reading
              </span>
            </span>
          </button>


          <button
            type="button"
            className={`reader-settings__option ${
              settings.pageMode === "single-page"
                ? "reader-settings__option--active"
                : ""
            }`}
            onClick={() =>
              dispatch({
                type: "SET_PAGE_MODE",
                payload: "single-page",
              })
            }
            aria-pressed={settings.pageMode === "single-page"}
          >
            <span className="reader-settings__option-indicator" />


            <span className="reader-settings__option-content">
              <span className="reader-settings__option-title">
                Single Page
              </span>


              <span className="reader-settings__option-description">
                One page at a time
              </span>
            </span>
          </button>
        </div>
      </section>


      {/* =====================================================
          THEME
      ====================================================== */}


      <section className="reader-settings__section">
        <div className="reader-settings__section-heading">
          <span className="reader-settings__section-number">
            02
          </span>


          <span className="reader-settings__section-title">
            Appearance
          </span>
        </div>


        <div className="reader-settings__theme-options">
          <button
            type="button"
            className={`reader-settings__theme ${
              settings.theme === "light"
                ? "reader-settings__theme--active"
                : ""
            }`}
            onClick={() =>
              dispatch({
                type: "SET_COLOR",
                payload: "light",
              })
            }
            aria-pressed={settings.theme === "light"}
          >
            <span className="reader-settings__theme-preview reader-settings__theme-preview--light">
              <span />
            </span>


            <span className="reader-settings__theme-name">
              Light
            </span>
          </button>


          <button
            type="button"
            className={`reader-settings__theme ${
              settings.theme === "dark"
                ? "reader-settings__theme--active"
                : ""
            }`}
            onClick={() =>
              dispatch({
                type: "SET_COLOR",
                payload: "dark",
              })
            }
            aria-pressed={settings.theme === "dark"}
          >
            <span className="reader-settings__theme-preview reader-settings__theme-preview--dark">
              <span />
            </span>


            <span className="reader-settings__theme-name">
              Dark
            </span>
          </button>
        </div>
      </section>


      {/* =====================================================
          RESET
      ====================================================== */}


      <div className="reader-settings__footer">
        <button
          type="button"
          className="reader-settings__reset"
          onClick={() =>
            dispatch({
              type: "RESET",
            })
          }
        >
          <span>Reset settings</span>


          <span
            className="reader-settings__reset-arrow"
            aria-hidden="true"
          >
            ↻
          </span>
        </button>
      </div>
    </aside>
  );
}


export default ReaderSettingsPanel;



