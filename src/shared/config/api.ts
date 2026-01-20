import axios from "axios";
import { getServerURL } from "../utils/getServerURL";
import { useAuthStore } from "@/store/authStore";

export const api = axios.create({
	baseURL: getServerURL(),
	headers: {
		"Content-Type": "application/json",
	},
	withCredentials: true,
});

api.interceptors.request.use(
	(config) => {
		const token = useAuthStore.getState().accessToken; // 현재 저장된 토큰 가져오기
		if (token) {
			config.headers.Authorization = `Bearer ${token}`;
		}
		return config;
	},
	(error) => {
		return Promise.reject(error);
	}
);

// formData interceptor (이미지파일 업로드용)
api.interceptors.request.use((config) => {
	if (config.data instanceof FormData) {
		delete config.headers["Content-Type"];
	}
	return config;
});

api.interceptors.response.use(
	(response) => response,

	async (error) => {
		const originalRequest = error.config;
		//401 에러가 아니면 그냥 실패
		if (error.response?.status !== 401) {
			return Promise.reject(error);
		}
		// 이미 재시도한 요청이면 로그아웃 처리
		if (originalRequest._retry) {
			useAuthStore.getState().clearAuth();
			return Promise.reject(error);
		}

		if (originalRequest.url?.includes("/api/auth/refresh")) {
			useAuthStore.getState().clearAuth();
			return Promise.reject(error);
		}
		originalRequest._retry = true;

		try {
			const res = await api.post("/api/auth/refresh");
			const authHeader = res.headers["authorization"];
			if (!authHeader?.startsWith("Bearer ")) {
				throw new Error("토큰 형식이 올바르지 않습니다.");
			}
			const token = authHeader.replace("Bearer ", "");
			useAuthStore.getState().setAccessToken(token); // 토큰 갱신

			originalRequest.headers.Authorization = `Bearer ${token}`;
			return api(originalRequest);
		} catch (refreshError) {
			useAuthStore.getState().clearAuth();
			return Promise.reject(refreshError);
		}
	}
);
