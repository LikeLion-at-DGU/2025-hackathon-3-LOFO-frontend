// src/ai/generatePlan.js
import { generatePlanLocal } from "./generatePlan.local";
import { generatePlanServer } from "./generatePlan.server"; // 나중에 다시 쓸 수 있으니 유지

export const useLocalLLM =
  (import.meta.env.VITE_USE_LOCAL_LLM ?? "false").toLowerCase() === "true";

export function getAiMode() {
  if (useLocalLLM) return "local";
  return "server";
}

/** onProgress(text) 콜백을 받아 로딩 문구를 업데이트할 수 있게 함 */
export async function generatePlan(goal, dueDate, onProgress) {
  const mode = getAiMode();

  if (mode === "local") {
    const steps = await generatePlanLocal(goal, dueDate, onProgress);
    return { steps, mode: "local" };
  }

  // (참고) 서버 모드. 유료 API 준비되면 여기로 전환
  const steps = await generatePlanServer(goal, dueDate);
  return { steps, mode: "server" };
}
