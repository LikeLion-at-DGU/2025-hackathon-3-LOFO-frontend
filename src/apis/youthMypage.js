import { instance } from "./instance";

//----------------- 내 포트폴리오 목록을 get으로 불러옵니다 -----------------//

// apis/youthMypage.js
export async function fetchMyPortfolio({ page = 1, pageSize = 50 } = {}) {
  const res = await instance.get("/youth/mypage/portfolio", {
    params: { page, page_size: pageSize },
  });
  const data = res?.data;

  // 디버깅용 로그(배포에서 필요없으면 주석)
  console.log("[portfolio:data]", data);

  // 여러 케이스 지원
  if (Array.isArray(data)) return data;

  const candidates = ["results", "items", "data", "list", "content", "portfolios"];
  for (const key of candidates) {
    if (Array.isArray(data?.[key])) return data[key];
  }

  // 숫자 기반 페이지네이션 {count, results} 방어
  if (typeof data === "object" && data) {
    const firstArray = Object.values(data).find(Array.isArray);
    if (Array.isArray(firstArray)) return firstArray;
  }

  return [];
}


//----------------- 성장지표에 해당하는 내용을 get으로 불러옵니다 -----------------//

export async function fetchGrowthInsights() {
  const { data } = await instance.get("/youth/mypage/insights");
  return data;
}


//----------------- 내 활동 : 찜/좋아요 목록을 get으로 불러옵니다 -----------------//

export async function getMySaved() {
  const { data } = await instance.get("/youth/mypage/saved");
  return data;
}
