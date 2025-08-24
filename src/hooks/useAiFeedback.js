import { useCallback, useState } from "react";
import { postMissionFeedback } from "../apis/youth_Mission";

const ALLOWED_EXTS = ["png", "jpg", "jpeg", "pdf", "mp4"];
const MAX_SIZE_MB = 6;

function getExt(name = "") {
  const i = name.lastIndexOf(".");
  return i >= 0 ? name.slice(i + 1).toLowerCase() : "";
}

function validateFiles(files = []) {
  for (const f of files) {
    const ext = getExt(f.name);
    if (!ALLOWED_EXTS.includes(ext)) {
      throw new Error(`허용되지 않는 확장자: ${ext}`);
    }
    if (f.size > MAX_SIZE_MB * 1024 * 1024) {
      throw new Error(`파일 용량 초과(>6MB): ${f.name}`);
    }
  }
}

export function useAiFeedback({ missionId, stepNo }) {
  const [feedback, setFeedback] = useState(null); // { summary, bullets }
  const [feedbackCount, setFeedbackCount] = useState(undefined);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const reset = useCallback(() => {
    setFeedback(null);
    setFeedbackCount(undefined);
    setLoading(false);
    setError("");
  }, []);

  const requestFeedback = useCallback(
    async ({ files, note = "" }) => {
      setError("");
      setLoading(true);
      try {
        const step = Number(stepNo);
       if (!missionId) throw new Error("mission_id가 필요합니다.");
       if (!Number.isInteger(step) || ![1, 2].includes(step)) {
         throw new Error("step_no는 1 또는 2의 정수여야 합니다.");
       }

        validateFiles(files);
        const data = await postMissionFeedback({
          missionId,
          stepNo: step,
          files,
          note,
        });
        // 서버 예시 응답 구조:
        // { mission_id, step_no, feedback: { summary, bullets[] }, feedback_count }
        setFeedback(data?.feedback ?? null);
        setFeedbackCount(data?.feedback_count);
        return data;
      } catch (e) {
        // 백엔드 에러 메시지 매핑(예: {"detail": "..."} 형태 고려)
        const msg =
          (e?.response?.data && (e.response.data.detail || JSON.stringify(e.response.data))) ||
          e?.message ||
          "AI 피드백 생성 실패";
        setError(msg);
        throw e;
      } finally {
        setLoading(false);
      }
    },
    [missionId, stepNo]
  );

  return {
    feedback,
    feedbackCount,
    loading,
    error,
    requestFeedback,
    reset,
  };
}
