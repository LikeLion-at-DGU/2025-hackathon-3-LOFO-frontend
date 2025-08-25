import { instance } from "./instance";

/** outcomeId로 피드백 상세 조회 */
export async function fetchFeedbackDetail(outcomeId) {
  const { data } = await instance.get(`/feedback/${outcomeId}`);
  return data;
}
