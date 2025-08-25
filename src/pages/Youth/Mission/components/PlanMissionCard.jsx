import * as S from "./PlanMissionCardStyle";
import { useStepUpload } from "../../../../hooks/useStepUpload";
import UploadModal from "./UploadModal";

/**
 * Props
 * - idx: number (1,2,3)
 * - title: string
 * - bullets: string[]
 * - dueDate: "YYYY-MM-DD"
 * - cta: string ("미션 업로드" | "추가 업로드" 등)
 * - onClick: () => void
 * - missionId: number | string
 */
export function PlanMissionCard({
  idx, title, bullets = [], dueDate,
  missionId,
  status,                  // ← 단계 상태("TODO"/"DONE")를 부모가 내려주도록
  onStepsChange,           // ← 완료 후 상위에서 steps 갱신
  missionDone,
  onMissionSubmitted,
}) {
  const { buttonProps, modalProps } = useStepUpload({
    missionId,
    stepNo: idx,
    status,
    deadline: dueDate,
    onStepsChange,
    onMissionSubmitted,
    missionDone,
  });

  return (
    <>
    <S.Card $disabled={missionDone}>   {/* ✅ 회색 처리 */}
      <S.Left>
        <S.IdxBadge>{idx}</S.IdxBadge>

        <S.Content>
          <S.HeaderRow>
            <S.Badge>미션</S.Badge>
            <S.Title href="#" onClick={(e) => e.preventDefault()}>
              {title}
            </S.Title>
          </S.HeaderRow>

          <S.Bullets>
            {bullets.map((b, i) => (
              <li key={i}>{b}</li>
            ))}
          </S.Bullets>
        </S.Content>
      </S.Left>

      <S.Right>
        <S.DuePill>
          <S.CalendarIcon viewBox="0 0 24 24" aria-hidden>
            <path d="M7 2v2M17 2v2M4 7h16M6 12h4M6 16h4M12 12h6M12 16h6M4 5a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V5z" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
          </S.CalendarIcon>
          <span>마감기한</span>
          <strong>{formatKR(dueDate)}</strong>
        </S.DuePill>

        <S.UploadBtn type="button" onClick={buttonProps.onClick} disabled={buttonProps.disabled}>
          <S.UploadIcon viewBox="0 0 24 24" aria-hidden>
            <path d="M12 16V8M8.5 11.5 12 8l3.5 3.5M5 16v2a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-2" 
            fill="none" stroke="currentColor" strokeWidth="1.8" 
            strokeLinecap="round" strokeLinejoin="round"/>
          </S.UploadIcon>
          {buttonProps.label}
        </S.UploadBtn>
      </S.Right>
    </S.Card>

     {/* 부모 onClick이 없을 때만 사실상 쓰이게 됨 */}
     
      <UploadModal {...modalProps} />
    </>
  );
}

/* YYYY-MM-DD → "M월 D일" */
function formatKR(ymd) {
  if (!ymd) return "—";
  const [y, m, d] = ymd.split("-").map(Number);
  return `${m}월 ${d}일`;
}
