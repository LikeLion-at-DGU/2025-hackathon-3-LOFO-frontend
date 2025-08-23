export async function handler(event) {
  
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

  const prefix = "/.netlify/functions/api-proxy";
  const rawPath = event.path.startsWith(prefix) ? event.path.slice(prefix.length) : event.path;
  const subpath = rawPath.startsWith("/") ? rawPath : `/${rawPath}`;
  const qs = event.rawQueryString ? `?${event.rawQueryString}` : "";
  const url = `${origin}${subpath}${qs}`;

  // 문제 헤더 제거
  const { host, connection, "content-length": _cl, "accept-encoding": _ae, ...headers } = event.headers || {};
  const init = {
    method: event.httpMethod,
    headers,
    body: ["GET", "HEAD"].includes(event.httpMethod) ? undefined : event.body,
  };

  try {
    const resp = await fetch(url, init);
    const respHeaders = {};
    resp.headers.forEach((v, k) => (respHeaders[k] = v));
    respHeaders["access-control-allow-origin"] = event.headers?.origin ?? respHeaders["access-control-allow-origin"] ?? "*";
    respHeaders["access-control-allow-credentials"] = "true";

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
