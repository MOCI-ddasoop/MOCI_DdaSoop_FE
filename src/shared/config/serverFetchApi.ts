import { BASE_URL } from "../constants/api";
import { cookies } from "next/headers";

export const serverFetchApi = async (
  url: string,
  options: RequestInit = {},
) => {
  const baseURL = BASE_URL;
  const cookieStore = await cookies();

  return fetch(`${baseURL}${url}`, {
    ...options,
    headers: {
      ...options.headers,
      Cookie: cookieStore.toString(),
    },
    cache: "no-store",
  });
};
