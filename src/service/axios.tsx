import axios from "axios";
import Cookies from 'js-cookie';
import { apiUrl } from "./url_api";

const http = axios.create({
  baseURL: apiUrl,
});

http.interceptors.request.use(async config => {
  const token = Cookies.get('access_token');
  if (!config.skipAuth && token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default http;
