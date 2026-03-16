"use client";

import { useEffect } from "react";
import TagManager from "react-gtm-module";

function GTMInit() {
  useEffect(() => {
    const gtmId = "u8t3nll15o";

    if (gtmId) {
      TagManager.initialize({
        gtmId: gtmId,
      });
    }
  }, []);
  
  return null;
}
export default GTMInit;
