import { useState } from "react";
import "./ReaderImage.scss";


type ReaderImageProps = {
  src: string;
  alt: string;
  shouldLoad: boolean;
};


function ReaderImage({
  src,
  alt,
  shouldLoad,
}: ReaderImageProps) {
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);


  const handleLoad = () => {
    setLoaded(true);
    setError(false);
  };


  const handleError = () => {
    setLoaded(false);
    setError(true);
  };

  if (!shouldLoad) {
    return (
      <div
        className="reader-image reader-image--placeholder"
        aria-hidden="true"
      >
        <div className="reader-image__placeholder" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="reader-image reader-image--error">
        <div
          className="reader-image__error"
          role="alert"
        >
          <div className="reader-image__error-mark">
            !
          </div>


          <div className="reader-image__error-content">
            <div className="reader-image__error-title">
              Unable to load page
            </div>


            <div className="reader-image__error-description">
              The image could not be loaded.
            </div>
          </div>
        </div>
      </div>
    );
  }


  return (
    <div
      className={[
        "reader-image",
        loaded ? "reader-image--loaded" : "reader-image--loading",
      ].join(" ")}
    >
      {!loaded && (
        <div
          className="reader-image__skeleton"
          aria-hidden="true"
        >
          <div className="reader-image__skeleton-shine" />
        </div>
      )}


      <img
        src={src}
        alt={alt}
        className="reader-image__img"
        loading="lazy"
        decoding="async"
        draggable={false}
        onLoad={handleLoad}
        onError={handleError}
      />
    </div>
  );
}


export default ReaderImage;
