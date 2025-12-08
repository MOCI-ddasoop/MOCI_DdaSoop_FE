import { useState, useEffect } from "react";
import { throttle } from "../utils/throttle";

export const useMobileDetection = (breakpoint: number = 768) => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < breakpoint);

    checkMobile();

    const throttledCheckMobile = throttle(checkMobile, 100);
    
    window.addEventListener("resize", throttledCheckMobile);

    return () => window.removeEventListener("resize", throttledCheckMobile);
  }, [breakpoint]);

  return isMobile;
};