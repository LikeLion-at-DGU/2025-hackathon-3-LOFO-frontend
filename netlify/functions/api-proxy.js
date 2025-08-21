export async function handler(event) {
  try {
    const origin = process.env.BACKEND_ORIGIN;
    if (!origin) {
      return { statusCode: 500, body: "BACKEND_ORIGIN is not set" };
    }

    // 원래 요청 경로(/api/xxx)만 추출: "/.netlify/functions/api-proxy/..." 제거
    const prefix = "/.netlify/functions/api-proxy";
    const subpath = event.path.startsWith(prefix) ? event.path.slice(prefix.length) : event.path;
    const url = origin + subpath + (event.rawQuery ? `?${event.rawQuery}` : "");

    // hop-by-hop/금지 헤더 정리
    const { host, connection, "content-length": _, ...headers } = event.headers || {};

    const init = {
      method: event.httpMethod,
      headers,
      body: ["GET", "HEAD"].includes(event.httpMethod) ? undefined : event.body,
    };

    const resp = await fetch(url, init);

    // 응답 헤더 그대로 전달(세트쿠키 포함)
    const respHeaders = {};
    resp.headers.forEach((v, k) => { respHeaders[k] = v; });

    const arrayBuffer = await resp.arrayBuffer();
    return {
      statusCode: resp.status,
      headers: respHeaders,
      body: Buffer.from(arrayBuffer).toString("base64"),
      isBase64Encoded: true,
    };
  } catch (e) {
    return { statusCode: 502, body: `proxy_error: ${e.message}` };
  }
}
