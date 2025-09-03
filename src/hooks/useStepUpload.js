import { useCallback, useMemo, useState } from "react";
import { postMissionDone, postMissionSubmit } from "../apis/youth_Mission";
import { getMissionButtonState } from "../utils/steps";

export function useStepUpload({
  missionId,
  stepNo,                // 1 | 2 | 3
  status,                // "TODO" | "DONE"
  onStepsChange,         // (allSteps) => void
  onMissionSubmitted,    // (res?) => void
  missionDone,           // boolean
}) {
  const [open, setOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const nStep = Number(stepNo);

  const btn = useMemo(
    () => getMissionButtonState({ stepNo: nStep, status, missionDone }),
    [nStep, status, missionDone]
  );

  const onClick = useCallback(() => {
    if (!btn.disabled && !missionDone && !submitting) setOpen(true);
  }, [btn.disabled, missionDone, submitting]);

  const onSubmit = useCallback(
    async ({ files, file, feedback }) => {
      try {
        setSubmitting(true);

        if (nStep === 3) {
          // 최종 제출
          const list = files ?? (file ? [file] : []);
          const res = await postMissionSubmit({ missionId, files: list, feedback });
          const all = res?.steps || res?.all_steps || [];
          onStepsChange?.(all);
          onMissionSubmitted?.(res); // 상위에서 missionDone=true로 전환
        } else {
          // 1·2단계 완료
          const res = await postMissionDone({ missionId, stepNo: nStep, files, feedback });
          const all = res?.steps || res?.all_steps || [];
          onStepsChange?.(all);
        }
      } catch (err) {
        const msg = err?.response?.data?.detail || err?.message || "단계 완료 실패";
        alert(msg);
      } finally {
        setSubmitting(false);
        setOpen(false);
      }
    },
    [missionId, nStep, onStepsChange, onMissionSubmitted]
  );

  const modalProps = {
    open,
    onClose: () => setOpen(false),
    onSubmit,
    title: nStep === 3 ? "최종 미션 제출하기" : "미션 제출하기",
    variant: nStep === 3 ? "purple" : "blue",
    missionId,
    stepNo: nStep,               // 1·2 자동 피드백, 3은 수동 버튼 노출
    manualFeedback: nStep === 3, // 3단계에만 '피드백 받기'
    allowMultiple: nStep === 3,
  };

  const buttonProps = {
    onClick,
    disabled: missionDone || btn.disabled || submitting,
    label: submitting ? "완료 중…" : (missionDone ? "업로드 완료" : btn.label),
    variant: btn.variant,
  };

  return { buttonProps, modalProps };
}
