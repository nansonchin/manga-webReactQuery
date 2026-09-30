import {
  useState,
} from "react";


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
  /**
   * 图片是否已经成功加载。
   */
  const [
    loaded,
    setLoaded,
  ] = useState(false);


  /**
   * 图片是否加载失败。
   */
  const [
    error,
    setError,
  ] = useState(false);


  /**
   * ---------------------------------------------------------
   * Image load
   * ---------------------------------------------------------
   */
  const handleLoad =
    () => {
      setLoaded(true);
      setError(false);
    };


  /**
   * ---------------------------------------------------------
   * Image error
   * ---------------------------------------------------------
   */
  const handleError =
    () => {
      setLoaded(false);
      setError(true);
    };


  /**
   * ---------------------------------------------------------
   * 当前 page 不需要加载。
   * ---------------------------------------------------------
   *
   * 这里只显示 placeholder。
   *
   * 但是仍然保留固定的 page ratio，
   * 避免 Virtualizer 看到：
   *
   * 0px
   * ↓
   * 240px
   * ↓
   * 800px
   *
   * 这种高度变化。
   */
  if (!shouldLoad) {
    return (
      <div
        className="
          reader-image
          reader-image--placeholder
        "
        aria-hidden="true"
      >
        <div className="reader-image-wrapper">
          <div className="reader-image__placeholder" />
        </div>
      </div>
    );
  }


  /**
   * ---------------------------------------------------------
   * Error
   * ---------------------------------------------------------
   */
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


  /**
   * ---------------------------------------------------------
   * Normal image
   * ---------------------------------------------------------
   */
  return (
    <div
      className={[
        "reader-image",


        loaded
          ? "reader-image--loaded"
          : "reader-image--loading",
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


      /**
       * 这里加入 wrapper。
       *
       * CSS 可以保证 page 在 image load
       * 之前就有稳定高度。
       */
      <div className="reader-image-wrapper">
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
    </div>
  );
}


export default ReaderImage;





