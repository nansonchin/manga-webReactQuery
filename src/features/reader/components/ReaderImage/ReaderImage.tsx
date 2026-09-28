import { useState } from "react";
import { useLazyImage } from "../../hooks/useLazyImage";
import "./ReaderImage.scss";

type ReaderImageProps = {
  src: string;
  alt: string;
  shouldLoad: boolean;
};

function ReaderImage({ src, alt, shouldLoad }: ReaderImageProps) {
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);

  // const { ref, visible } = useLazyImage();

  if (error) {
    return (
      <div className="reader-image-error" role="alert">
        Failed to load Image
      </div>
    );
  }

  return (
    <div className="reader-image">
      <div className="reader-image-wrapper">
        {!shouldLoad && <div className="reader-placeholder" />}
        {shouldLoad && !loaded && <div className="reader-image-skeleton" />}
        {shouldLoad && (
          <img
            src={src}
            alt={alt}
            loading="lazy"
            decoding="async"
            className={loaded ? "loaded" : ""}
            onLoad={() => setLoaded(true)}
            onError={() => setError(true)}
          />
        )}
      </div>
    </div>
  );
}

export default ReaderImage;
