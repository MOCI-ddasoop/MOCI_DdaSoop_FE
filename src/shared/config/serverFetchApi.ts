import { BASE_URL } from "../constants/api";

export const serverFetchApi = async (
  url: string,
  options: RequestInit = {},
) => {
  const baseURL = BASE_URL;

  const response = await fetch(`${baseURL}${url}`, {
    headers: { "Content-Type": "application/json" },
    ...options,
    cache: "no-store",
  });

  if (!response.ok) throw new Error("API 요청실패");
  return response;
};
