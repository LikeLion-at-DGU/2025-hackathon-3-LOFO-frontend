import { instance } from "./instance";

//----------------- 내 포트폴리오 목록을 get으로 불러옵니다 -----------------//

export async function fetchMyPortfolio() {
  // 엔드포인트: GET /youth/mypage/portfolio
  const { data } = await instance.get("/youth/mypage/portfolio");
  // data가 배열이라고 가정(스크린샷 구조)
  return Array.isArray(data) ? data : (data?.results ?? []);
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
