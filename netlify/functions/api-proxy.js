// netlify/functions/api-proxy.js
const ORIGIN = "https://2025-hackathon-3-lofo.netlify.app";
const BACKEND = process.env.BACKEND_ORIGIN;

// 백엔드로 넘길 최소 헤더만
function pickForwardHeaders(incoming = {}) {
  const allow = new Set([
    "accept",
    "accept-language",
    "content-type",    // ← multipart boundary 포함, 필수
    "cookie",          // ← 세션 방식이면 필요
    "x-csrftoken",     // ← Django CSRF
    "origin",
    "referer",         // ← Django CSRF(https)에서 중요
    "authorization",   // ← JWT 쓰면
    "x-requested-with" // ← 선택
    // 필요하면 'user-agent'만 추가
  ]);
  const h = new Headers();
  for (const [k, v] of Object.entries(incoming || {})) {
    if (!v) continue;
    const key = k.toLowerCase();
    if (!allow.has(key)) continue;
    if (key === "content-length" || key === "host") continue;
    h.set(key, String(v));
  }
  return h;
}

export async function handler(event) {
  try {
    // 1) OPTIONS (CORS 프리플라이트)
    if (event.httpMethod === "OPTIONS") {
      return {
        statusCode: 204,
        headers: {
          "access-control-allow-origin": event.headers?.origin ?? ORIGIN,
          "access-control-allow-credentials": "true",
          "access-control-allow-methods": "GET,POST,PUT,PATCH,DELETE,OPTIONS",
          // ✅ 정확한 헤더명: X-CSRFToken
          "access-control-allow-headers":
            "Content-Type, Authorization, X-Requested-With, X-CSRFToken",
          "access-control-max-age": "86400",
        },
        body: "",
      };
    }

    if (!BACKEND) {
      return {
        statusCode: 500,
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ error: "BACKEND_ORIGIN is not set" }),
      };
    }

    // 2) 경로 매핑 (/api 및 함수 prefix 제거)
    const prefix = "/.netlify/functions/api-proxy";
    let rawPath = event.path?.startsWith(prefix)
      ? event.path.slice(prefix.length)
      : event.path || "/";
    if (rawPath.startsWith("/api/")) rawPath = rawPath.slice(4);
    const subpath = rawPath.startsWith("/") ? rawPath : `/${rawPath}`;
    const qs = event.rawQueryString ? `?${event.rawQueryString}` : "";
    const url = `${BACKEND}${subpath}${qs}`;

    // 3) 헤더/바디 준비
    const headers = pickForwardHeaders(event.headers);
    const hasBody = !["GET", "HEAD"].includes(event.httpMethod);
    const body = hasBody
      ? (event.isBase64Encoded
          ? Buffer.from(event.body || "", "base64")
          : event.body ?? "")
      : undefined;

    // 4) 백엔드 호출
    const resp = await fetch(url, {
      method: event.httpMethod,
      headers,
      body,
      redirect: "manual",
    });

    // 5) 응답 가공
    const buf = Buffer.from(await resp.arrayBuffer());
    const out = {};
    resp.headers.forEach((v, k) => (out[k] = String(v)));
    delete out["content-length"]; // 재계산되도록

    // CORS 보강
    out["access-control-allow-origin"] = event.headers?.origin ?? ORIGIN;
    out["access-control-allow-credentials"] = "true";

    // 항상 base64로 반환(바이너리 안전)
    return {
      statusCode: resp.status,
      headers: out,
      body: buf.toString("base64"),
      isBase64Encoded: true,
    };
  } catch (e) {
    return {
      statusCode: 502,
      headers: {
        "content-type": "application/json",
        "access-control-allow-origin": event.headers?.origin ?? ORIGIN,
        "access-control-allow-credentials": "true",
      },
      body: JSON.stringify({ error: "proxy_failed", message: String(e?.message || e) }),
    };
  }
}
