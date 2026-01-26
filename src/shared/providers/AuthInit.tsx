"use client";

import { use, useEffect, useState } from "react";
import { useAuthStore } from "@/store/authStore";
import { api } from "../config/api";
import { usePathname } from "next/navigation";

const NO_REFRESH_PATHS = ["/login","/login-additional"]; // refresh 하지 않을 path 

export default function AuthInit() {
  const fetchMe = useAuthStore((s) => s.fetchMe);
  const clearAuth = useAuthStore((s) => s.clearAuth);
  const setAccessToken = useAuthStore((s) => s.setAccessToken);
  const [isInitialized, setInitialized] = useState(false);
  const pathname = usePathname();
  
  useEffect(()=> {
    if(NO_REFRESH_PATHS.includes(pathname)){
      setInitialized(true);
      return;
    }

    const initAuth = async () => {
      try{
        const res = await api.post("/api/auth/refresh");
        const authHeader = res.headers["authorization"];

        if(authHeader?.startsWith("Bearer ")){
          const token = authHeader.replace("Bearer ", "");
          setAccessToken(token);
          await fetchMe();
        }
      }catch(error){
        clearAuth();
      }finally{
        setInitialized(true);
      }
    }
    initAuth();
  },[pathname]);
  if(!isInitialized){
    return null;
  }
  return null;
}