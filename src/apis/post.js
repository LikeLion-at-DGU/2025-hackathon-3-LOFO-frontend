import { instance } from "./instance";

const API_BASE = import.meta.env.VITE_API_BASE_URL;

// UI에서 필요한 모습: { store_name, content, saved_count }
function toAbsoluteUrl(pathOrUrl) {
  if (!pathOrUrl) return "";
  try { return new URL(pathOrUrl, API_BASE).toString(); }
  catch { return pathOrUrl; }
}

function normalizePost(row = {}) {
  return {
    id: row.id,
    // 📌 카드에서 쓸 필드들
    storeName: row.store_name ?? "",
    content: row.content ?? "",
    savedCount: row.saved_count ?? 0,

    // 기존 필드도 유지(원하면 쓰거나 지워도 됨)
    title: row.title ?? "",
    category: row.category_display ?? row.category ?? "",
    region: row.store_name ?? "",
    thumbnailUrl: toAbsoluteUrl(row.image ?? row.thumbnail),
    url: row.url ?? "",
    status: row.status_display ?? row.status ?? "",
  };
}

export const getPostList = async ({ category, page, pageSize }) => {
  const params = {
    page,
    pageSize,
    ...(category && category !== "전체" ? { category } : {}),
  };
  const res = await instance.get("/youth/home", { params });

  console.log("🎯 데이터만:", res.data); // response 말고 data만 확인!

  const raw = Array.isArray(res.data) ? res.data : (res.data?.items ?? []);
  const items = raw.map(normalizePost);
  const total = res.data?.total ?? items.length;

  return { items, total };
};