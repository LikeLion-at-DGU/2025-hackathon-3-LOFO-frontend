// UI ↔ API 매핑과 쿼리 유틸의 단일 소스
export const UI_CATEGORIES = [
  "전체","포스터·전단","SNS 이미지","인테리어 제안","홍보기획","광고문구"
];

// 백엔드 enum 매핑 (필요시 값만 맞춰 수정)
export const CATEGORY_TO_API = {
  "포스터·전단": "POSTER_FLYER",
  "SNS 이미지": "SNS_IMAGE",
  "홍보기획": "PROMOTION_PLANNING",
  "광고문구": "AD_COPY",
  "인테리어 제안": "INTERIOR_PROPOSAL",
};
//"홍보영상": "PROMOTION_VIDEO",

export function toApiCategory(uiLabel) {
  if (!uiLabel || uiLabel === "전체") return undefined;
  return CATEGORY_TO_API[uiLabel] ?? uiLabel;
}

export const SORT_OPTIONS = [
  { label: "최신순", value: "latest" },
  { label: "찜많은순", value: "popular" },
];

export function normalizeSort(s) {
  return SORT_OPTIONS.some(o => o.value === s) ? s : "latest";
}

export function buildPostQuery({ category, sort, page, pageSize }) {
  const params = { page, pageSize };
  const apiCategory = toApiCategory(category);
  if (apiCategory) params.category = apiCategory;
  if (sort) params.sort = normalizeSort(sort);
  return params;
}
