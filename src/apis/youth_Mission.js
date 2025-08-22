import { instance } from "./instance";

//--------------- Request를 Post 후 AI 플랜 생성 (미션 & 스텝 3개 생성)을 응답으로 받습니다. --------------//

/**
 * AI 플랜 생성
 * @param {Object} params
 * @param {number} params.request_id     // 상인의 요청 ID
 * @param {string} params.goal           // 목표
 * @param {string} params.deadline       // YYYY-MM-DD
 * @param {string} [token]               // Bearer 토큰 (없으면 instance가 넣도록)
 */
export async function createAiPlan({ request_id, goal, deadline, token }) {
  const headers = token
    ? { Authorization: `Bearer ${token}` }
    : undefined;

  // 서버 스펙 그대로 전달
  const body = { request_id, goal, deadline };

  const { data, status } = await instance.post("/youth/plan", body, { headers });
  if (status !== 201) {
    throw new Error(`플랜 생성 실패 (status: ${status})`);
  }
  return data; // { mission, steps: [...] }
}


