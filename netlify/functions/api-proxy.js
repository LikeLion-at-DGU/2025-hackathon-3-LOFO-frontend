export async function handler(event) {
  
  // 1) OPTIONS 프리플라이트 처리 (CORS)
  // CORS 프리플라이트
  if (event.httpMethod === "OPTIONS") {
    return {
      statusCode: 204,
      headers: {
        "access-control-allow-origin": event.headers?.origin ?? "*",
        "access-control-allow-credentials": "true",
        "access-control-allow-methods": "GET,POST,PUT,PATCH,DELETE,OPTIONS",
        "access-control-allow-headers": "Content-Type, Authorization, X-Requested-With, X-CSRF-Token",
        "access-control-max-age": "86400",
      },
      body: "",
    };
  }

  // 2) 헬스체크: 함수가 살아있는지 확인용 (백엔드 불필요)
  // 헬스체크 (함수 자체 확인)
  if (event.path.endsWith("/.netlify/functions/api-proxy/ping") || event.path.endsWith("/api/ping")) {
    return {
      statusCode: 200,
      headers: {
        "content-type": "text/plain",
        "access-control-allow-origin": event.headers?.origin ?? "*",
        "access-control-allow-credentials": "true",
      },
      body: "pong",
    };
  }

  const origin = process.env.BACKEND_ORIGIN;
  if (!origin) return { statusCode: 500, body: "BACKEND_ORIGIN is not set" };

  // 3) "/.netlify/functions/api-proxy" 제거하여 나머지 경로만 추출
  const prefix = "/.netlify/functions/api-proxy";
  
  let rawPath = event.path.startsWith(prefix) ? event.path.slice(prefix.length) : event.path;
  if (rawPath.startsWith("/api/")) rawPath = rawPath.slice(4);

  const subpath = rawPath.startsWith("/") ? rawPath : `/${rawPath}`;

  // 4) 최종 백엔드 URL 구성 (쿼리스트링은 rawQueryString)
  const qs = event.rawQueryString ? `?${event.rawQueryString}` : "";
  const url = `${origin}${subpath}${qs}`;

  // 5) 금지/문제 헤더 제거
  const { host, connection, "content-length": _cl, "accept-encoding": _ae, ...headers } = event.headers || {};

  // 6) 백엔드로 전달
  const init = {
    method: event.httpMethod,
    headers,
    body: ["GET", "HEAD"].includes(event.httpMethod) ? undefined : event.body,
  };

  try {
    const resp = await fetch(url, init);

    // 응답 본문/헤더 전달 (Set-Cookie 포함)
    const respHeaders = {};
    resp.headers.forEach((v, k) => (respHeaders[k] = v));

    // 프런트에서 쿠키를 받게 하려면 CORS 보정이 필요할 수 있음
    respHeaders["access-control-allow-origin"] = event.headers?.origin ?? respHeaders["access-control-allow-origin"] ?? "*";
    respHeaders["access-control-allow-credentials"] = "true";

    // 바이너리/텍스트 대응
    const buf = Buffer.from(await resp.arrayBuffer());
    const isText = /^text\/|application\/(json|xml|javascript)/i.test(resp.headers.get("content-type") || "");
    return {
      statusCode: resp.status,
      headers: respHeaders,
      body: isText ? buf.toString("utf8") : buf.toString("base64"),
      isBase64Encoded: !isText,
    };
  } catch (e) {
    return {
      statusCode: 502,
      headers: {
        "content-type": "text/plain",
        "access-control-allow-origin": event.headers?.origin ?? "*",
        "access-control-allow-credentials": "true",
      },
      body: `proxy_error: ${e.message}`,
    };
  }
}
