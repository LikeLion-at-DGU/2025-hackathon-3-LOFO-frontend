import axios from "axios";

export const instance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  withCredentials: false,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000,
});


//instance.js에서 가장 초기 BASE URL을 설정함