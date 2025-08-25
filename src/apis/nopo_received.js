// // src/apis/nopo_received.js
// import { instance } from "./instance";

// /* ---- URL 헬퍼 (community.js와 동일한 규칙) ---- */
// const API_BASE = import.meta.env.VITE_API_BASE_URL || "";
// const isAbs = (u = "") =>
//   /^https?:\/\//i.test(u) || String(u).startsWith("data:");
// const toAbsoluteUrl = (u = "") =>
//   !u
//     ? ""
//     : isAbs(u)
//     ? u
//     : API_BASE
//     ? new URL(u, API_BASE).toString()
//     : `/api/${u.replace(/^\//, "")}`;

// /* outcomes 한 건 정규화 */
// function normalizeOutcome(row = {}) {
//   const id = row.outcome_id ?? row.id;
//   const thumb =
//     row.cover_image_url ??
//     row.thumbnail_url ??
//     row.image_url ??
//     row.thumbnail ??
//     row.image ??
//     "";

//   return {
//     outcomeId: id,
//     id,
//     title: row.title ?? row.request_title ?? "",
//     storeName: row.store_name ?? row.merchant_name ?? "",
//     thumbnailUrl: toAbsoluteUrl(thumb),
//     category: row.category,
//     categoryDisplay: row.category_display,
//     nopoPick: row.nopo_pick ?? false,
//     createdAt: row.created_at,
//   };
// }

// /** 받은 콘텐츠 리스트 GET: /nopo/received  */
// export async function getReceivedList() {
//   const { data } = await instance.get("/nopo/received");
//   const raw = Array.isArray(data?.outcomes) ? data.outcomes : [];
//   const items = raw.map(normalizeOutcome);
//   return {
//     ongoingCount: data?.ongoing_count ?? 0,
//     items,
//   };
// }

// /** 활용하기(원클릭 다운로드): /nopo/received/<id>/download  */
// export async function oneClickDownloadOutcome(outcomeId) {
//   if (!outcomeId) throw new Error("outcomeId required");

//   const res = await instance.get(`/nopo/received/${outcomeId}/download`, {
//     responseType: "blob",
//   });

//   const blob = new Blob([res.data], {
//     type: res.headers["content-type"] || "application/octet-stream",
//   });

//   // 파일명 파싱 (Content-Disposition)
//   let filename = `outcome_${outcomeId}.zip`;
//   const cd = res.headers["content-disposition"] || "";
//   const m = cd.match(/filename\*?=(?:UTF-8'')?("?)([^";]+)\1/i);
//   if (m) filename = decodeURIComponent(m[2]);

//   const url = window.URL.createObjectURL(blob);
//   const a = document.createElement("a");
//   a.href = url;
//   a.download = filename;
//   document.body.appendChild(a);
//   a.click();
//   a.remove();
//   window.URL.revokeObjectURL(url);
// }

// /** 피드백 폼 데이터 GET: /nopo/received/<id>/form-data  (후기 페이지에서 사용) */
// export async function getReceivedFormData(outcomeId) {
//   if (!outcomeId) throw new Error("outcomeId required");
//   const { data } = await instance.get(`/nopo/received/${outcomeId}/form-data`);
//   return data;
// }

// /* ----- (폴백) 결과물 파일 목록 ----- */
// export async function getOutcomeFiles(outcomeId) {
//   if (!outcomeId) throw new Error("outcomeId required");

//   // 별도 files 엔드포인트가 없을 때 form-data 응답을 재활용
//   const { data } = await instance.get(`/nopo/received/${outcomeId}/form-data`);
//   const raw =
//     (Array.isArray(data?.files) && data.files) ||
//     (Array.isArray(data?.outcome?.files) && data.outcome.files) ||
//     [];

//   const files = raw.map((f) => ({
//     id: f.id,
//     kind: f.kind,
//     name: f.name,
//     size: f.size,
//     download_url: toAbsoluteUrl(
//       f.download_url ||
//         (f.id
//           ? `/nopo/received/file/${f.id}/download`
//           : `/${String(f.name || "").replace(/^\//, "")}`)
//     ),
//   }));

//   return { files };
// }

// /* ----- 후기 저장 ----- */
// // export async function postReceivedFeedback(payload) {
// //   if (!payload?.outcome_id) throw new Error("outcome_id required");
// //   const { data } = await instance.post("/nopo/received/feedback", payload);
// //   return data; // 서버가 내려주는 저장 결과/메시지
// // }

// export async function postReceivedFeedback(payload) {
//   // 서버 스키마에 정확히 맞춰 body 구성
//   const body = {
//     outcome_id: payload.outcome_id ?? payload.outcome, // 혹시 outcome 으로 왔다면 보정
//     overall_satisfaction: payload.overall_satisfaction,
//     reflection_level: payload.reflection_level,
//     practical_use: payload.practical_use,
//     comment: payload.comment ?? payload.content ?? "",
//   };

//   if (!body.outcome_id) throw new Error("outcome_id required");

//   const { data } = await instance.post("/nopo/received/feedback", body);
//   return data;
// }

import { instance } from "./instance";

/* ---- URL 헬퍼 ---- */
const API_BASE = import.meta.env.VITE_API_BASE_URL || "";
const isAbs = (u = "") =>
  /^https?:\/\//i.test(u) || String(u).startsWith("data:");
const toAbsoluteUrl = (u = "") =>
  !u
    ? ""
    : isAbs(u)
    ? u
    : API_BASE
    ? new URL(u, API_BASE).toString()
    : `/api/${u.replace(/^\//, "")}`;

/* outcomes 한 건 정규화 */
function normalizeOutcome(row = {}) {
  const id = row.outcome_id ?? row.id;
  const thumb =
    row.cover_image_url ??
    row.thumbnail_url ??
    row.image_url ??
    row.thumbnail ??
    row.image ??
    "";
  return {
    outcomeId: id,
    id,
    title: row.title ?? row.request_title ?? "",
    storeName: row.store_name ?? row.merchant_name ?? "",
    thumbnailUrl: toAbsoluteUrl(thumb),
    category: row.category,
    categoryDisplay: row.category_display,
    nopoPick: row.nopo_pick ?? false,
    createdAt: row.created_at,
  };
}

/** 받은 콘텐츠 리스트 */
export async function getReceivedList() {
  const { data } = await instance.get("/nopo/received");
  const raw = Array.isArray(data?.outcomes) ? data.outcomes : [];
  const items = raw.map(normalizeOutcome);
  return { ongoingCount: data?.ongoing_count ?? 0, items };
}

/** 원클릭 다운로드 */
export async function oneClickDownloadOutcome(outcomeId) {
  if (!outcomeId) throw new Error("outcomeId required");
  const res = await instance.get(`/nopo/received/${outcomeId}/download`, {
    responseType: "blob",
  });
  const blob = new Blob([res.data], {
    type: res.headers["content-type"] || "application/octet-stream",
  });
  let filename = `outcome_${outcomeId}.zip`;
  const cd = res.headers["content-disposition"] || "";
  const m = cd.match(/filename\*?=(?:UTF-8'')?("?)([^";]+)\1/i);
  if (m) filename = decodeURIComponent(m[2]);
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  window.URL.revokeObjectURL(url);
}

/** 피드백 폼 데이터 */
export async function getReceivedFormData(outcomeId) {
  if (!outcomeId) throw new Error("outcomeId required");
  const { data } = await instance.get(`/nopo/received/${outcomeId}/form-data`);
  return data;
}

/** (폴백) 파일 목록 */
export async function getOutcomeFiles(outcomeId) {
  if (!outcomeId) throw new Error("outcomeId required");
  const { data } = await instance.get(`/nopo/received/${outcomeId}/form-data`);
  const raw =
    (Array.isArray(data?.files) && data.files) ||
    (Array.isArray(data?.outcome?.files) && data.outcome.files) ||
    [];
  const files = raw.map((f) => ({
    id: f.id,
    kind: f.kind,
    name: f.name,
    size: f.size,
    download_url: toAbsoluteUrl(
      f.download_url ||
        (f.id
          ? `/nopo/received/file/${f.id}/download`
          : `/${String(f.name || "").replace(/^\//, "")}`)
    ),
  }));
  return { files };
}

/** 후기 저장 */
export async function postReceivedFeedback(payload) {
  const body = {
    outcome_id: payload.outcome_id ?? payload.outcome, // 안전 보정
    overall_satisfaction: payload.overall_satisfaction, // 예: VERY_GOOD
    reflection_level: payload.reflection_level, // 예: REFLECTED
    practical_use: payload.practical_use, // 예: POSSIBLE
    comment: payload.comment ?? payload.content ?? "",
  };
  if (!body.outcome_id) throw new Error("outcome_id required");
  const { data } = await instance.post("/nopo/received/feedback", body);
  return data;
}
