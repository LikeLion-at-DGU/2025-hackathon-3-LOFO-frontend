import { instance } from "./instance";

//--------------- 요청 상세내용을 POST로 불러옵니다. --------------//

export async function getMissionDetail(id) {
  const res = await instance.get(`/youth/mission/${id}`);
  return res.data; // { id,title,store_name,category,content,status,saved_count,image,url,created_at }
}


//--------------- 진행 중인 미션을 POST로 불러옵니다. --------------//

export async function getMyMission() {
  const token = localStorage.getItem("accessToken");
  const headers = token ? { Authorization: `Bearer ${token}` } : undefined;

  const res = await instance.get("/youth/mymission", {
    headers,
    // withCredentials는 instance에 이미 설정됨
  });
  return res.data; // { exists, mission, request, steps }
}


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


