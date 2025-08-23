// src/apis/community.js
import { instance } from "./instance";

/* ---- helpers ---- */
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

/* 결과물 한 건 정규화 */
function normalizeCommunity(row = {}) {
  // 대표 이미지: image_url/thumbnail/files[0] 등에서 추출
  const firstFilePath = Array.isArray(row.files)
    ? row.files.find((f) => (f.kind || "").toUpperCase() === "IMAGE")?.name ||
      row.files[0]?.name
    : "";

  const image =
    row.thumbnail_url ??
    row.image_url ??
    row.thumbnail ??
    row.image ??
    firstFilePath ??
    "";

  return {
    id: row.id,
    title: row.title ?? row.request_title ?? row.category_label ?? "", // 카드 타이틀
    storeName: row.store_name ?? row.merchant_name ?? "", // 가게명
    imageUrl: toAbsoluteUrl(image),
    // 카테고리(라벨/코드 모두 보존)
    category: row.category ?? "",
    categoryLabel: row.category_label ?? row.category ?? "",
    // 좋아요(하트)
    savedCount: row.saved_count ?? row.likes ?? 0,
    createdAt: row.created_at ?? row.createdAt ?? "",
  };
}

/* 전체 리스트(탭/정렬 파라미터가 있으면 넘겨도 됨) */
export async function getCommunityList(params = {}) {
  const res = await instance.get(
    "/comunity",
    Object.keys(params).length ? { params } : undefined
  );
  const raw = Array.isArray(res.data)
    ? res.data
    : res.data?.items ?? res.data?.results ?? [];
  const items = (raw || []).map(normalizeCommunity);
  return { items };
}

/* 좋아요(+1) */
export async function likeCommunity(id) {
  if (!id) throw new Error("id required");
  const { data } = await instance.post(`/comunity/${id}/like`);
  // 백이 최신 카운트를 내려주면 활용하고, 아니면 호출 성공만 신뢰
  return data; // e.g. { saved_count: 11 } or {}
}
