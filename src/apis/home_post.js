import { instance } from "./instance";
import { buildPostQuery } from "./filters";

const API_BASE = import.meta.env.VITE_API_BASE_URL;

function toAbsoluteUrl(pathOrUrl) {
  if (!pathOrUrl) return "";
  try { return new URL(pathOrUrl, API_BASE).toString(); }
  catch { return pathOrUrl; }
}

function normalizePost(row = {}) {
  const savedCnt = (typeof row.saved_count === "number" ? row.saved_count : row.savedCount) ?? 0;
  const isSaved  = (typeof row.is_saved === "boolean" ? row.is_saved : row.savedByMe) ?? false;

  return {
    id: row.id,
    store_name: row.store_name, 
    storeName: row.store_name ?? row.storeName ?? "",
    content: row.content ?? "",
    saved_count: savedCnt,
    savedCount: savedCnt,
    is_saved: !!isSaved,
    savedByMe: !!isSaved, 
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