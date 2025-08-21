import axios from "axios";

export const instance = axios.create({
  //baseURL: import.meta.env.VITE_API_BASE_URL,
  baseURL: "/api",
  timeout: 10000,
  withCredentials: true,   // ✅ 세션 쿠키를 보내려면 필수
  //headers: {"Content-Type": "application/json",},
});