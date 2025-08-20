import { instance } from "./instance";

//------------------------ 새 상인요청을 post로 생성합니다. ------------------------//

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
  if (file) {
    formData.append("image", file);
  }

  const endpoint = "/nopo/request/create"

  try {
    const { data } = await instance.post(endpoint, formData);
    console.log("요청 등록 성공:", data);
    return data;
  } catch (error) {
    // 디버깅에 도움되게 상세 로그
    console.error("요청 등록 실패:", {
      status: error?.response?.status,
      data: error?.response?.data,
      message: error?.message,
    });
    throw error;
  }
}

//------------------------ 작성된 상인요청을 patch로 수정합니다. ------------------------//
// "/nopo/request/<int:id>/edit"


//------------------------ 작성된 상인요청을 post로 종료합니다. ------------------------//
// "/nopo/request/<int:id>/end"


//------------------------ 생성된 상인요청 게시글을 get으로 불러옵니다. ------------------------//

// UI에서 필요한 모습: { store_name, content, saved_count }

const API_BASE = import.meta.env.VITE_API_BASE_URL;

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

  console.log("🎯 데이터만:", res.data);

  const raw = Array.isArray(res.data) ? res.data : (res.data?.items ?? []);
  const items = raw.map(normalizePost);
  const total = res.data?.total ?? items.length;

  return { items, total };
};


