import { instance } from "./instance";
import { buildPostQuery } from "./filters";

const API_BASE = import.meta.env.VITE_API_BASE_URL;

function toAbsoluteUrl(pathOrUrl) {
  if (!pathOrUrl) return "";
  try { return new URL(pathOrUrl, API_BASE).toString(); }
  catch { return pathOrUrl; }
}

function normalizePost(row = {}) {
  return {
    id: row.id,
    storeName: row.store_name ?? "",
    content: row.content ?? "",
    savedCount: row.saved_count ?? 0,
    title: row.title ?? "",
    category: row.category_display ?? row.category ?? "",
    region: row.store_name ?? "",
    thumbnailUrl: toAbsoluteUrl(row.image ?? row.thumbnail),
    url: row.url ?? "",
    status: row.status_display ?? row.status ?? "",
  };
}

//------------------------ 생성된 상인요청 게시글을 get으로 불러옵니다. ------------------------//

export const getPostList = async ({ category, sort = "latest", page, pageSize }) => {
  const params = buildPostQuery({ category, sort, page, pageSize });
  
  const res = await instance.get("/youth/home", { params });

  console.log("🎯 상인요청 데이터:", res.data);

  const raw = Array.isArray(res.data) ? res.data : (res.data?.items ?? []);
  const items = raw.map(normalizePost);
  const total = res.data?.total ?? items.length;

  return { items, total };
};

//------------------------- 생성된 ai미션 게시글을 get으로 불러옵니다. -------------------------//

export const getAiPostList = async ({ category, sort = "latest", page, pageSize }) => {
  const params = buildPostQuery({ category, sort, page, pageSize });
  
  const res = await instance.get("/youth/home/ai-mission", { params });

  console.log("🎯 AI미션 데이터:", res.data);

  const raw = Array.isArray(res.data) ? res.data : (res.data?.items ?? []);
  const items = raw.map(normalizePost);
  const total = res.data?.total ?? items.length;

  return { items, total };
};