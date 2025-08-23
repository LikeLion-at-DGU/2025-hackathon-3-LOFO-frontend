// src/apis/nopo_received.js
import { instance } from "./instance";

/* ---------- helpers (단 한 번만 선언) ---------- */
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
    : `/api/${String(u).replace(/^\//, "")}`;

const baseName = (path = "") => {
  const s = String(path).split("/");
  return s[s.length - 1] || path;
};

function directDownload(url, suggestedName) {
  const a = document.createElement("a");
  a.href = url;
  if (suggestedName) a.setAttribute("download", suggestedName);
  a.rel = "noopener noreferrer";
  document.body.appendChild(a);
  a.click();
  a.remove();
}

/* ---------- normalizer ---------- */
function normalizeReceived(row = {}) {
  const img =
    row.thumbnail_url ??
    row.image_url ??
    row.image ??
    row.thumbnail ??
    row.preview ??
    "";
  return {
    id: row.outcome_id ?? row.id,
    outcome_id: row.outcome_id ?? row.id,
    title: row.title ?? row.request_title ?? row.category_label ?? "",
    store_name: row.store_name ?? row.merchant_name ?? "",
    thumbnailUrl: toAbsoluteUrl(img),
  };
}

/* ---------- APIs ---------- */

// 받은 작업물 목록
export async function getReceivedList() {
  const res = await instance.get("/nopo/received");
  const raw = Array.isArray(res.data)
    ? res.data
    : res.data?.items ?? res.data?.results ?? [];
  return { items: (raw || []).map(normalizeReceived) };
}

// 후기 폼 데이터 (콘솔 확인용)
export async function getReceivedFormData(outcome_id) {
  const { data } = await instance.get(`/nopo/received/${outcome_id}/form-data`);
  return data;
}

// 후기 저장
export async function postReceivedFeedback({
  outcome_id,
  satisfaction,
  reflection,
  usability,
  content,
}) {
  const payload = { outcome_id, satisfaction, reflection, usability, content };
  const { data } = await instance.post("/nopo/received/feedback", payload);
  return data;
}

// ZIP(또는 단일 파일 스트림) 엔드포인트 URL
export function getOutcomeDownloadUrl(outcome_id) {
  return toAbsoluteUrl(`/nopo/received/${outcome_id}/download`);
}

// 파일 목록(JSON) 조회: { files:[{id,kind,name,size,download_url?}], zip|archive_url? }
export async function getOutcomeFiles(outcome_id) {
  const { data } = await instance.get(`/nopo/received/${outcome_id}/download`, {
    headers: { Accept: "application/json" },
  });
  const files = Array.isArray(data?.files) ? data.files : [];
  const zipUrl = data?.zip || data?.archive_url || null;
  return { files, zipUrl };
}

// 개별 파일 다운로드 URL 생성
export function buildFileDownloadUrl(file) {
  if (file?.download_url) return toAbsoluteUrl(file.download_url);
  if (file?.id) return toAbsoluteUrl(`/nopo/received/file/${file.id}/download`);
  if (file?.name)
    return toAbsoluteUrl(`/${String(file.name).replace(/^\//, "")}`);
  return "";
}

/* === 원클릭 다운로드 ===
   1) JSON에 zip 있으면 zip 다운로드
   2) files 배열만 있으면 각 파일 개별 다운로드(브라우저가 다중 다운로드 경고할 수 있음)
   3) JSON이 없거나 실패하면 zip 엔드포인트로 폴백
*/
export async function oneClickDownloadOutcome(outcome_id) {
  try {
    const { files, zipUrl } = await getOutcomeFiles(outcome_id);

    if (zipUrl) {
      directDownload(toAbsoluteUrl(zipUrl));
      return;
    }

    if (files?.length) {
      for (const f of files) {
        const url = buildFileDownloadUrl(f);
        if (!url) continue;
        // 연속 클릭 안전을 위해 살짝 텀
        await new Promise((r) => setTimeout(r, 120));
        directDownload(url, baseName(f.name));
      }
      return;
    }
  } catch (e) {
    console.warn("[oneClickDownloadOutcome] JSON 목록 없음, zip로 폴백", e);
  }

  // 최종 폴백: ZIP 스트림
  directDownload(getOutcomeDownloadUrl(outcome_id));
}
