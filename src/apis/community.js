import { instance } from "./instance";

/* ---------- helpers ---------- */
const API_BASE = import.meta.env.VITE_API_BASE_URL || "";
const isAbs = (u = "") =>
  /^https?:\/\//i.test(u) || String(u).startsWith("data:");
export const toAbsoluteUrl = (u = "") =>
  !u
    ? ""
    : isAbs(u)
    ? u
    : API_BASE
    ? new URL(u, API_BASE).toString()
    : `/api/${u.replace(/^\//, "")}`;

// 간단 MIME 추정 (미리보기용)
const guessMime = (name = "") => {
  const ext = String(name).split(".").pop()?.toLowerCase();
  if (!ext) return "*/*";
  if (["jpg", "jpeg", "png", "gif", "webp", "bmp"].includes(ext))
    return `image/${ext === "jpg" ? "jpeg" : ext}`;
  if (["mp4", "webm", "mov"].includes(ext)) return `video/${ext}`;
  if (ext === "pdf") return "application/pdf";
  return "*/*";
};

/* ---------- normalizers ---------- */
// 카드 1개 정규화
export const normalizeCommunity = (row = {}) => {
  const firstFilePath = Array.isArray(row.files)
    ? row.files.find((f) => (f.kind || "").toUpperCase() === "IMAGE")?.name ||
      row.files[0]?.name
    : "";

  const image =
    row.cover_image_url ??
    row.thumbnail_url ??
    row.image_url ??
    row.thumbnail ??
    row.image ??
    firstFilePath ??
    "";

  return {
    id: row.outcome_id ?? row.id ?? null, // 좋아요는 id 있을 때만 사용
    title:
      row.title ??
      row.request_title ??
      row.category_display ??
      row.category_label ??
      "",
    storeName:
      row.store_name ?? row.merchant_name ?? row.request_store_name ?? "",
    imageUrl: toAbsoluteUrl(image),
    category: row.category ?? "",
    categoryLabel:
      row.category_display ?? row.category_label ?? row.category ?? "",
    savedCount: Number(row.saved_count ?? row.likes ?? 0) || 0,
    createdAt: row.created_at ?? row.submitted_at ?? row.createdAt ?? "",
    key:
      (row.outcome_id ?? row.id)?.toString() ??
      `${toAbsoluteUrl(image)}|${
        Date.parse(row.created_at ?? row.submitted_at ?? "") || 0
      }`,
    // 파일이 이미 붙어 내려오는 경우(있으면 모달에서 바로 씀)
    files: Array.isArray(row.files)
      ? row.files.map((f) => ({
          url: toAbsoluteUrl(f.url || f.download_url || f.name),
          name: f.name || f.url || f.download_url,
          type: f.type || guessMime(f.name || f.url || f.download_url),
          kind: (f.kind || "").toUpperCase(),
        }))
      : undefined,
  };
};

// /youth/mission/submit 응답 → 카드로 변환(낙관적 반영용)
export const normalizeFromSubmitResponse = (submitRes = {}, extras = {}) =>
  normalizeCommunity({
    outcome_id: submitRes.outcome_id,
    files: submitRes.files,
    title: submitRes.title ?? extras.title ?? "",
    store_name: submitRes.store_name ?? extras.storeName ?? "",
    category: submitRes.category ?? extras.category ?? "",
    submitted_at: new Date().toISOString(),
    saved_count: 0,
  });

const unwrap = (data) =>
  Array.isArray(data)
    ? data
    : data?.outcomes ??
      data?.items ??
      data?.results ??
      data?.data ??
      data?.list ??
      data?.rows ??
      [];

/* ---------- APIs ---------- */
/** 전체 피드 (트레일링 슬래시 중요: 장고가 /comunity/ 를 매칭) */
export async function getCommunityList(params = {}) {
  const cfg = {
    ...(Object.keys(params).length ? { params } : {}),
    headers: { Accept: "application/json" },
  };
  const res = await instance.get("/comunity/", cfg);

  // 개발 중 HTML이 오면 바로 에러로 처리
  if (typeof res.data === "string") {
    throw new Error("Expected JSON but got HTML from /comunity/");
  }

  const raw = unwrap(res.data);
  const mapped = (raw || []).map(normalizeCommunity);

  // key로 중복 제거
  const seen = new Set();
  const items = mapped.filter((it) =>
    seen.has(it.key) ? false : (seen.add(it.key), true)
  );

  return { items };
}

/**  좋아요(+1) — 장고 라우트가 'comunity/<int:id>/like' */
export async function likeCommunity(id) {
  if (!id) throw new Error("id required");
  const { data } = await instance.post(`/comunity/${id}/like`);
  return data; // { saved_count: number } 예상
}

/** 좋아요 취소(-1) — DELETE가 없다면 POST undo로 폴백 */
export async function unlikeCommunity(id) {
  if (!id) throw new Error("id required");
  try {
    const { data } = await instance.delete(`/comunity/${id}/like`);
    return data; // { saved_count: number } 기대
  } catch (e) {
    const st = e?.response?.status;
    if (st === 405 || st === 404) {
      // 서버가 DELETE를 지원하지 않으면 undo 플래그로 POST 재시도
      const { data } = await instance.post(`/comunity/${id}/like`, {
        undo: true,
      });
      return data;
    }
    throw e;
  }
}

/** 📷 미리보기용 파일 목록 가져오기
 * - 여러 엔드포인트를 순차 시도해서 최대한 확보
 * - 아무것도 못 얻으면 썸네일로 폴백
 */
export async function getOutcomeFilesForPreview(outcomeId, fallbackImageUrl) {
  if (!outcomeId && !fallbackImageUrl) return { files: [] };

  // 이미지를 최소 1장은 보장하려는 폴백 빌더
  const ensureAtLeastOne = (arr = []) => {
    if (arr.length > 0) return arr;
    if (fallbackImageUrl)
      return [
        {
          url: toAbsoluteUrl(fallbackImageUrl),
          name: "thumbnail",
          type: guessMime(fallbackImageUrl),
        },
      ];
    return [];
  };

  // 1) 가장 가능성 높은 경로들 순차 시도
  const candidates = [
    `/comunity/${outcomeId}/files`, // 커스텀 파일 리스트
    `/youth/outcomes/${outcomeId}`, // 상세에 files 포함될 수 있음
    `/youth/outcome/${outcomeId}`,
    `/outcomes/${outcomeId}`,
    `/nopo/outcomes/${outcomeId}`,
    `/nopo/outcome/${outcomeId}`,
  ].filter(Boolean);

  for (const path of candidates) {
    try {
      const { data } = await instance.get(path, {
        headers: { Accept: "application/json" },
      });
      // 다양한 포맷에서 files 꺼내기
      const root =
        data?.files ??
        data?.outcome?.files ??
        data?.data?.files ??
        (Array.isArray(data) ? data : null);

      if (!root) continue;

      const files = root
        .map((f) => ({
          url: toAbsoluteUrl(f.url || f.download_url || f.name),
          name: f.name || f.url || f.download_url,
          type: f.type || guessMime(f.name || f.url || f.download_url),
        }))
        .filter((x) => x.url);

      if (files.length) return { files };
    } catch (_) {
      // 시도 실패 -> 다음 후보로
    }
  }

  // 2) 전부 실패하면 썸네일 폴백
  return { files: ensureAtLeastOne([]) };
}
