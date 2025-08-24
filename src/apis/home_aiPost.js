import { instance } from "./instance";


// 서버 파라미터 매핑(필요 시 유지)

const CATEGORY_MAP = {
  "SNS 이미지": "SNS_IMAGE",
  "포스터·전단": "POSTER_FLYER",
  "홍보영상": "PROMO_VIDEO",
  "인테리어 제안": "INTERIOR_PROPOSAL",
  "홍보기획": "PROMOTION_PLAN",
  "광고문구": "AD_COPY",
  // 필요하면 더 추가
};
const SORT_MAP = {
  latest: "-created_at",   // 최근순
  popular: "-saved_count", // 인기순
};

// 서버가 받는 파라미터로 변환
function buildPostQuery({ category, sort, page, pageSize }) {
  const params = {};
  const cat = CATEGORY_MAP[category];    // "전체"는 undefined → 파라미터 생략

  if (cat) params.category = cat;
  if (SORT_MAP[sort]) params.ordering = SORT_MAP[sort];

  if (page) params.page = page;
  if (pageSize) params.page_size = pageSize; // 서버 스펙에 맞춰 snake_case 권장
  return params;
}


//------------------------- 생성된 ai미션 게시글을 get으로 불러옵니다. -------------------------//

// ✅ 백엔드가 fixtures 스타일({ model, fields, pk })로 줄 때도, 평평한 JSON으로 줄 때도 커버
function normalizePost(x) {
  const f = x?.fields ?? x;              // fields가 있으면 그걸 쓰고, 없으면 그대로
  const id = x?.pk ?? x?.id ?? f?.id;    // pk → id 우선
  if (!f) return { id };                 // 방어적

  return {
    id,
    store_name: f.store_name ?? f.storeName ?? "",
    image: f.image ?? f.thumbnail_url ?? f.thumbnailUrl ?? "",
    url: f.url ?? f.link ?? "",
    category: f.category ?? "",
    category_display: f.category_display ?? f.category ?? "",
    status: f.status ?? "",
    status_display: f.status_display ?? f.status ?? "",
    title: f.title ?? "",
    content: f.content ?? f.description ?? "",
    saved_count: f.saved_count ?? f.savedCount ?? 0,
    is_saved: f.is_saved ?? f.savedByMe ?? false,
    created_at: f.created_at ?? null,
    updated_at: f.updated_at ?? null,
  };
}



export const getAiPostList = async ({ category, sort = "latest", page, pageSize }) => {
  const params = buildPostQuery({ category, sort, page, pageSize });

  // ⚠️ baseURL('/api')와 합쳐지도록 앞 슬래시 제거
  const res = await instance.get("youth/home/ai-mission", { params });

  // ✅ 가능성 전부 커버: 배열/fixtures 배열/객체.items/객체.results
  let raw = [];
  if (Array.isArray(res.data)) {
    raw = res.data;
  } else if (Array.isArray(res.data?.items)) {
    raw = res.data.items;
  } else if (Array.isArray(res.data?.results)) {
    raw = res.data.results;
  } else if (res.data?.fields) {
    raw = [res.data]; // 단일 객체일 수도 있을 때
  }

  const items = raw.map(normalizePost);
  const total =
    res.data?.total ??
    res.data?.count ??
    items.length;

  return { items, total };
};