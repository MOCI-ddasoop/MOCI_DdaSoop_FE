import axios from "axios";
import { getServerURL } from "../utils/getServerURL";

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
