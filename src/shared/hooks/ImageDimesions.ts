import { useEffect, useState } from "react";

interface ImageDimensions {
  width: number;
  height: number;
  aspectRatio: number;
}

const useImageDimensions = (src: string) => {
  const [dimensions, setDimensions] = useState<ImageDimensions | null>(null);
  const [loading, setLoading] = useState(!!src);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!src) {
      return () => {
        setDimensions(null);
        setLoading(false);
        setError(null);
      };
    }

    const img = new Image();
    
    img.onload = () => {
      setDimensions({
        width: img.naturalWidth,
        height: img.naturalHeight,
        aspectRatio: img.naturalWidth / img.naturalHeight,
      });
      setLoading(false);
      setError(null);
    };

    img.onerror = () => {
      setError(new Error(`Failed to load image: ${src}`));
      setLoading(false);
      setDimensions(null);
    };

    // 동기적 상태 업데이트 제거하고 초기 상태를 useState에서 처리
    img.src = src;

    return () => {
      img.onload = null;
      img.onerror = null;
    };
  }, [src]);

  return { dimensions, loading, error };
};

export default useImageDimensions;