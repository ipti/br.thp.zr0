import axios from "axios";
import { getToken } from "./localstorage";



const http = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
});

http.interceptors.request.use(async config => {
  const token = getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default http;
