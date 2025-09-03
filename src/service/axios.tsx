import axios from "axios";
import Cookies from 'js-cookie';

const http = axios.create({
  baseURL: "/api",
});

http.interceptors.request.use(async config => {
  const token = Cookies.get('access_token');
  console.log(process.env.NEXT_PUBLIC_API_URL)
  if (!config.skipAuth && token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default http;
