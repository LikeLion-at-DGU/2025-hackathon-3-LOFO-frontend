// src/apis/nopo_request.js
import { instance } from "./instance";

/**
 * 상인 요청 생성
 * - FormData로 전송 (image 포함)
 * - 실패 시 상세 콘솔 로그(상태/본문/보낸 페이로드) 출력
 */
export async function createRequest({
  store_name,
  title,
  category,
  url,
  content,
  file,
}) {
  const formData = new FormData();
  formData.append("store_name", store_name);
  formData.append("title", title);
  formData.append("category", category);
  formData.append("url", url);
  formData.append("content", content);
  if (file) formData.append("image", file);

  const endpoint = "/nopo/request/create";

  try {
    const { data } = await instance.post(endpoint, formData);
    console.log("[createRequest] ✅ 요청 등록 성공:", data);
    return data;
  } catch (err) {
    // 🔎 무엇을 보냈는지 & 서버가 뭐라 했는지 보기 좋게 출력
    console.group("[createRequest] ❌ 요청 등록 실패");
    console.log("→ endpoint:", endpoint);
    console.log("→ payload:", {
      store_name,
      title,
      category, // ← 백엔드 enum 미스매치 시 여기 값 확인
      url,
      content,
      file: file ? { name: file.name, size: file.size, type: file.type } : null,
    });
    console.log("→ status:", err?.response?.status);
    console.log("→ response.data:", err?.response?.data);

    // 필드 단위 메시지 힌트(특히 category)
    const rd = err?.response?.data;
    if (rd?.category) {
      console.log("→ category error:", rd.category);
    }
    if (rd?.non_field_errors) {
      console.log("→ non_field_errors:", rd.non_field_errors);
    }
    console.groupEnd();

    // 화면단에서 처리하도록 그대로 던짐 (RequestCreate.jsx의 catch에서 메시지 구성)
    throw err;
  }
}

/* ------------------------ 공통 유틸 ------------------------ */
const API_BASE = import.meta.env.VITE_API_BASE_URL || "";
const isAbs = (u = "") =>
  /^https?:\/\//i.test(u) || String(u).startsWith("data:");
function toAbsoluteUrl(u) {
  if (!u) return "";
  if (isAbs(u)) return u; // 절대 URL/data:는 그대로
  // 배포: API_BASE 기준, 개발: vite proxy(/api) 활용
  return API_BASE
    ? new URL(u, API_BASE).toString()
    : `/api/${String(u).replace(/^\//, "")}`;
}
const toKR = (s = "") => {
  const u = String(s).toUpperCase();
  if (u === "OPEN") return "모집중";
  if (u === "ONGOING" || u === "IN_PROGRESS") return "진행중";
  if (u === "CLOSED") return "중단/종료";
  return "모집중";
};

function normalize(row = {}) {
  const img = row.image_url ?? row.thumbnail ?? row.image;
  const statusKR = row.status_label ?? toKR(row.status);
  return {
    // raw (원본 키 보존)
    id: row.id,
    store_name: row.store_name ?? "",
    title: row.title ?? "",
    category: row.category ?? "",
    category_label: row.category_label ?? "",
    status: row.status ?? "", // OPEN | ONGOING | CLOSED
    status_label: statusKR, // 한글 상태
    image_url: toAbsoluteUrl(img),
    url: row.url ?? "",
    saved_count: row.saved_count ?? 0,
    created_at: row.created_at ?? "",
    content: row.content ?? "",

    // UI alias (컴포넌트 호환)
    storeName: row.store_name ?? "",
    categoryLabel: row.category_label ?? row.category ?? "",
    statusCode: row.status ?? "",
    statusKR, // 한글 상태
    status: statusKR, // 기존 컴포넌트가 req.status를 쓰므로 여기도 한글로
    thumbnailUrl: toAbsoluteUrl(img),
    savedCount: row.saved_count ?? 0,
    createdAt: row.created_at ?? "",
    progress: row.progress ?? 0,
  };
}

/* ------------------------ 상인 홈 (최근 N개) GET /nopo/home ------------------------ */
export async function getHomeDashboard() {
  const res = await instance.get("/nopo/home");
  const {
    my_progress = {},
    my_recent_requests = [],
    links = {},
  } = res.data || {};
  const items = (my_recent_requests || []).map(normalize);
  return {
    items,
    links,
    progress: {
      open: my_progress.open ?? 0,
      ongoing: my_progress.ongoing ?? 0,
      closed: my_progress.closed ?? 0,
      total: my_progress.total ?? items.length,
    },
  };
}

/* ------------------------ 요청 탭 (전체) GET /nopo/request ------------------------ */
export async function getRequestTabList(params = {}) {
  const candidates = ["/nopo/request", "/nopo/request/"];
  let lastErr;
  for (const p of candidates) {
    try {
      const res = await instance.get(
        p,
        Object.keys(params).length ? { params } : undefined
      );
      const raw = Array.isArray(res.data)
        ? res.data
        : res.data?.items ??
          res.data?.results ??
          res.data?.my_recent_requests ??
          [];
      const items = (raw || []).map(normalize);
      const total = res.data?.total ?? res.data?.count ?? items.length;
      console.log(
        `[getRequestTabList] used path: ${p}, items: ${items.length}`
      );
      return { items, total };
    } catch (e) {
      if (e?.response?.status !== 404) throw e;
      lastErr = e;
    }
  }
  throw lastErr;
}
export { getRequestTabList as getRequestList };

/* ------------------------ 종료 POST: /nopo/request/:id/end ------------------------ */
export async function endRequest(id) {
  if (!id) throw new Error("id가 필요합니다.");
  const { data } = await instance.post(`/nopo/request/${id}/end`);
  return data;
}

//------------------------ 작성된 상인요청을 patch로 수정합니다. ------------------------//
// "/nopo/request/<int:id>/edit"

//------------------------ 작성된 상인요청을 post로 종료합니다. ------------------------//
// "/nopo/request/<int:id>/end"
