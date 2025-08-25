// src/apis/instance.js
import axios from "axios";

const DEBUG = true; // 필요시 false로

export const instance = axios.create({
  baseURL: "/api",          // Netlify 프록시 경유
  withCredentials: true,    // 세션방식이면 true, JWT면 false
  timeout: 30000,
});

function maskHeaders(h = {}) {
  const out = { ...(h || {}) };
  if (out.Authorization) out.Authorization = "[masked]";
  if (out.Cookie) out.Cookie = "[masked]";
  return out;
}

instance.interceptors.request.use((config) => {
  if (DEBUG) {
    console.groupCollapsed(`[AXIOS:REQ] ${config.method?.toUpperCase()} ${config.baseURL || ""}${config.url}`);
    console.log("→ headers:", maskHeaders(config.headers));
    console.log("→ withCredentials:", config.withCredentials);
    console.log("→ params:", config.params);
    if (config.data instanceof FormData) {
      const entries = [];
      config.data.forEach((v, k) => {
        if (v instanceof File) {
          entries.push([k, `{File name=${v.name}, size=${v.size}, type=${v.type}}`]);
        } else {
          entries.push([k, v]);
        }
      });
      console.log("→ FormData:", entries);
    } else {
      console.log("→ data:", config.data);
    }
    console.groupEnd();
  }
  return config;
}, (err) => {
  if (DEBUG) console.error("[AXIOS:REQ-ERR]", err);
  return Promise.reject(err);
});

instance.interceptors.response.use((res) => {
  if (DEBUG) {
    console.groupCollapsed(`[AXIOS:RES] ${res.config?.method?.toUpperCase()} ${res.config?.url} · ${res.status}`);
    console.log("← headers:", res.headers);
    console.log("← data:", res.data);
    console.groupEnd();
  }
  return res;
}, (err) => {
  if (DEBUG) {
    const res = err?.response;
    console.groupCollapsed(`[AXIOS:RES-ERR] ${err?.config?.method?.toUpperCase()} ${err?.config?.url}`);
    console.log("status:", res?.status);
    console.log("headers:", res?.headers);
    console.log("data:", res?.data);
    console.error("error:", err);
    console.groupEnd();
  }
  return Promise.reject(err);
});
