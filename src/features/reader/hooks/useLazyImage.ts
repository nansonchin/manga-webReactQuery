import { useEffect, useRef, useState } from "react";

export function useLazyImage() {
  // to determine this image element <img> should be show out to user now or later

  const [visible, setVisible] = useState(false);

  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) {
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          console.log("lazy", element);
          console.log("lazy", element.getBoundingClientRect().top);
          console.log(
 element.parentElement?.getBoundingClientRect()
)
          setVisible(true);
          observer.disconnect();
        }
      },
      {
        threshold: 0,
        rootMargin:"300px"
      },
    );
    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, []);

  return {
    ref,
    visible,
  };
}
