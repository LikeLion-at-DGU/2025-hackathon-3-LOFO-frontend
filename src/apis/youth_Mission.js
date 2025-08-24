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


//--------------- 포트폴리오를 Post 후 AI 피드백을 응답으로 받습니다. --------------//

export async function postMissionFeedback({ missionId, stepNo, files, note }) {
  const token = localStorage.getItem("accessToken");
  const headers = token ? { Authorization: `Bearer ${token}` } : undefined;

 if (!Number.isInteger(stepNo) || stepNo < 1 || stepNo > 3) {
   throw new Error("step_no는 1~3의 정수여야 합니다.");
 }

  const form = new FormData();
  //form.append("file", file);
  form.append("mission_id", String(missionId));
  form.append("step_no", String(stepNo));
  if (note) form.append("note", note);
  files.forEach(f => form.append("files", f));

  const { data } = await instance.post("/youth/mission/feedback", form, {
    headers: {
      ...headers,
      "Content-Type": "multipart/form-data",
    },
  });
  return data; // { mission_id, step_no, feedback: {...}, feedback_count }
}


//--------------- 1,2단계 결과물을 POST하여 완료합니다. --------------//

export async function postMissionDone({ missionId, stepNo }) {
  const { data } = await instance.post("/youth/mission/done", {
    mission_id: missionId,
    step_no: stepNo,
  });
  return data; // { detail, mission_id, step_no, status, completed_at, all_steps }
}

// --------------- 최종 제출 (Outcome 생성 + 미션/스텝 DONE) --------------//
export async function postMissionSubmit({ missionId, files }) {
  if (!missionId) throw new Error("mission_id가 필요합니다.");
  if (!Array.isArray(files) || files.length === 0) {
    throw new Error("최종 제출에는 files가 필요합니다.");
  }

  const token = localStorage.getItem("accessToken");
  const headers = token ? { Authorization: `Bearer ${token}` } : undefined;

  const form = new FormData();
  form.append("mission_id", String(missionId));
  files.forEach(f => form.append("files", f));

  const res = await instance.post("/youth/mission/submit", form, {
    headers: {
      ...headers,
      "Content-Type": "multipart/form-data",
    },
  });
  // 성공: 201
  return res.data; // { detail, outcome_id, files:[...], mission_status, steps:[...], request_status }
}
