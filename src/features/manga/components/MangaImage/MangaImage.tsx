import { useState } from "react";
import "./MangaImage.scss";


type MangaImageProps = {
  src: string | null;
  srcSet?: string;
  sizes?: string;
  alt: string;
  className?: string;
};


function MangaImage({
  src,
  srcSet,
  sizes,
  alt,
  className,
}: MangaImageProps) {
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);


  /*
   * No source or image failed to load.
   *
   * We keep the same aspect ratio as the normal image
   * so the surrounding layout does not jump.
   */
  if (!src || error) {
    return (
      <div
        className="manga-image manga-image--fallback"
        role="img"
        aria-label={alt || "Image unavailable"}
      >
        <div className="manga-image__fallback-content">
          <div className="manga-image__fallback-mark">
            B
          </div>


          <span className="manga-image__fallback-label">
            Image unavailable
          </span>
        </div>
      </div>
    );
  }


  return (
    <div
      className={`manga-image ${
        loaded ? "manga-image--loaded" : "manga-image--loading"
      }`}
    >
      {!loaded && (
        <div
          className="manga-image__skeleton"
          aria-hidden="true"
        >
          <div className="manga-image__skeleton-shine" />
        </div>
      )}


      <img
        src={src}
        srcSet={srcSet}
        sizes={sizes}
        alt={alt}
        loading="lazy"
        decoding="async"
        className={`manga-image__img ${
          className ?? ""
        }`}
        onLoad={() => setLoaded(true)}
        onError={() => setError(true)}
      />


      <div
        className="manga-image__corner"
        aria-hidden="true"
      />
    </div>
  );
}


export default MangaImage;





