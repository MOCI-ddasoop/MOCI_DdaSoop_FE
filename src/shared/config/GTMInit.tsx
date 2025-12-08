"use client";

import { useEffect } from "react";
import TagManager from "react-gtm-module";

function GTMInit() {
  useEffect(() => {
    const gtmId = process.env.NEXT_PUBLIC_GOOGLE_TAG_MANAGER_ID;

    if (gtmId) {
      TagManager.initialize({
        gtmId: gtmId,
      });
    }
  }, []);
  
  return null;
}
export default GTMInit;
