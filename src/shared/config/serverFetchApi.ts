import { BASE_URL } from "../constants/api";

export const serverFetchApi = async (
  url: string,
  options: RequestInit = {},
) => {
  const baseURL = BASE_URL;

  const response = await fetch(`${baseURL}${url}`, {
    ...options,
    cache: "no-store",
  });

  return response;
};
