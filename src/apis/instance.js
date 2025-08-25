import axios from "axios";

export const instance = axios.create({
  //baseURL: import.meta.env.VITE_API_BASE_URL,
  baseURL: "/api",
  timeout: 10000,
  withCredentials: true, // ✅ 세션 쿠키를 보내려면 필수
  //headers: {"Content-Type": "application/json",},
});

//응답 확인용
instance.interceptors.request.use((cfg) => {
  console.log("[axios:req]", cfg.method?.toUpperCase(), cfg.url, cfg);
  return cfg;
});

//홍연 추가수정
// 요청 로깅 + FormData일 때 Content-Type 제거(= boundary 자동)
// +instance.interceptors.request.use((cfg) => {
//   const isFormData =
//     typeof FormData !== "undefined" && cfg.data instanceof FormData;
//   if (isFormData && cfg.headers) {
//     delete cfg.headers["Content-Type"];
//     delete cfg.headers["content-type"];
//   }
//   console.log("[axios:req]", cfg.method?.toUpperCase(), cfg.url, cfg);
//   return cfg;
// });
instance.interceptors.response.use(
  (res) => {
    console.log("[axios:res]", res.status, res.config.url, res.data);
    return res;
  },
  (error) => {
    const r = error.response;
    console.log(
      "[axios:res:err]",
      r?.status,
      r?.config?.url,
      r?.data || error.message
    );
    return Promise.reject(error);
  }
);
