import { useCallback, useMemo, useState } from "react";
import { postMissionDone } from "../apis/youth_Mission";

// 버튼 라벨/비활성화 계산 (필요 시 공용 utils/steps로 이동)
export function getStepButtonState({ status, deadline }) {
  const now = new Date();
  const due = deadline ? new Date(deadline) : null;
  const isClosed = due && now > due;
  //if (isClosed) return { label: "업로드 완료", disabled: true,  variant: "ghost" };
  if (status === "DONE") return { label: "추가 업로드", disabled: false, variant: "secondary" };
  return { label: "미션 업로드",   disabled: false, variant: "primary" };
}

/**
 * 미션 단계 업로드/완료를 관리하는 훅
 * - 1·2단계: 파일 선택 시 UploadModal 내부에서 AI 피드백 자동요청(이미 구현)
 * - 완료 버튼 클릭 시 /youth/mission/done 호출
 */
export function useStepUpload({
  missionId,
  stepNo,         // 숫자 (1|2|3)
  status,         // "TODO" | "DONE"
  deadline,       // "YYYY-MM-DD"
  onStepsChange,  // (all_steps) => void
}) {
  const [open, setOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const numericStep = useMemo(() => Number(stepNo), [stepNo]);

  const btnState = getStepButtonState({ status, deadline });

  // 업로드 버튼
  const onClick = useCallback(() => setOpen(true), []);

  // 모달 완료(= 사용자가 파일 업로드 후 '완료' 클릭)
  // UploadModal이 { file, feedback }을 넘겨줌. 완료 시 서버에 '단계 완료'만 보내면 됨.
  const onSubmit = useCallback(
    async ({ file, feedback }) => {
      // file/feedback은 이미 서버로 올라가 AI 피드백 받은 상태(1·2단계)라고 가정.
      // 단계 완료 API 호출
      try {
        setSubmitting(true);
        const res = await postMissionDone({
          missionId,
          stepNo: numericStep,
        });
        // 부모에게 최신 단계 상태 반영
        onStepsChange?.(res.all_steps);
      } catch (err) {
        // 400/404/409 등 공통 에러 메시지 대응
        const msg = err?.response?.data?.detail || err.message || "단계 완료 실패";
        alert(msg); // 토스트 대체
      } finally {
        setSubmitting(false);
        setOpen(false);
      }
    },
    [missionId, numericStep, onStepsChange]
  );

  // UploadModal에 그대로 넘길 props
  const modalProps = {
    open,
    onClose: () => setOpen(false),
    onSubmit,                 // 여기서 postMissionDone 실행
    title: numericStep === 3 ? "최종 미션 제출하기" : "미션 제출하기",
    variant: numericStep === 3 ? "purple" : "blue",
    missionId,
    stepNo: numericStep <= 2 ? numericStep : undefined, // 1·2단계만 AI 피드백 자동
    showFeedbackAction: false,                           // 자동 피드백이라 버튼 불필요
  };

  // 업로드 버튼에 줄 props
  const buttonProps = {
    onClick,
    disabled: btnState.disabled || submitting,
    label: submitting ? "완료 중…" : btnState.label,
    variant: btnState.variant,
  };

  return { buttonProps, modalProps };
}
