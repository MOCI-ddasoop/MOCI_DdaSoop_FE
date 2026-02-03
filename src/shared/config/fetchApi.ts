import { BASE_URL } from "../constants/api";

export const fetchApi = (url: string, options: RequestInit = {}) => {
  const baseURL = BASE_URL;

  return fetch(`${baseURL}${url}`, {
    ...options,
    credentials: "include",
  });
};
