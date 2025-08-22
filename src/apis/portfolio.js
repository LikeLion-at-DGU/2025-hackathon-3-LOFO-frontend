import { instance } from "./instance";

/** 내 포트폴리오 목록 */
export async function fetchMyPortfolio() {
  // 엔드포인트: GET /youth/mypage/portfolio
  const { data } = await instance.get("/youth/mypage/portfolio");
  // data가 배열이라고 가정(스크린샷 구조)
  return Array.isArray(data) ? data : (data?.results ?? []);
}
