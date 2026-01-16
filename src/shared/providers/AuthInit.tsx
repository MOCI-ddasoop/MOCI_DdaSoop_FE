"use client";

import { useEffect, useState } from "react";
import { useAuthStore } from "@/store/authStore";
import { api } from "../config/api";

export default function AuthInit() {
  const fetchMe = useAuthStore((s) => s.fetchMe);
  const clearAuth = useAuthStore((s) => s.clearAuth);
  const setAccessToken = useAuthStore((s) => s.setAccessToken);
  const [isInitialized, setInitialized] = useState(false);

  useEffect(()=> {
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
  },[]);
  if(!isInitialized){
    return null;
  }
  return null;
}