import { api } from "@/shared/config/api";
import { create } from "zustand";

export type MembersMe = {
  memberId: number;
  name: string;
  nickname: string;
  email: string;
  profileImageUrl: string;
  role: string;
  lastLoginProvider: string;
  createdAt: string;
  updatedAt: string;
};

type AuthState = {
  accessToken: string | null;
  me: MembersMe | null;
  setAccessToken: (token: string | null) => void; //JWT 토큰 저장 
  fetchMe: () => Promise<MembersMe>;
  logout: () => void;
  clearAuth: () => void;
  login: (memberId: number) => Promise<void>;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  accessToken: null,
  me: null,

  setAccessToken: (token) => set({ accessToken: token }),
  
  login: async (memberId: number) => {
    const res = await api.post(`/api/auth/login`, null, {
      params: { memberId },
    });

    const authHeader = res.headers["authorization"];
    if(authHeader?.startsWith("Bearer ")){
      const token = authHeader.replace("Bearer ", "");
      set({ accessToken: token, me: res.data });
    }
  },

  fetchMe: async () => {
    const res = await api.get<MembersMe>("/api/members/me");
    set({ me: res.data });
    return res.data;
  },
  logout: async ()=>{
    try{
      await api.post("/api/auth/logout");
    }finally{
      get().clearAuth();
    }
  },
  clearAuth: () => set({ accessToken: null, me: null }),
}));
  
