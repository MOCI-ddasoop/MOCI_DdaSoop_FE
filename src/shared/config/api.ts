import axios from "axios";
import { getServerURL } from "../utils/getServerURL";
import { config } from "process";

export const api = axios.create({
	baseURL: getServerURL(),
	headers: {
		"Content-Type": "application/json",
	},
});

api.interceptors.request.use(
	(config) => {
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
