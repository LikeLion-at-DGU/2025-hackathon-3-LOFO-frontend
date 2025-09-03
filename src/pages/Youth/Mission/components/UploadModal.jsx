import * as S from "./UploadModalStyle";
import UploadIcon from '../../../../assets/Upload.svg?react';
import { useEffect, useRef, useState, useMemo } from "react";
import { useAiFeedback } from "../../../../hooks/useAiFeedback";

/**
 * props
 * - open, onClose, onSubmit({ files, feedback })
 * - title?: string
 * - variant?: "blue" | "purple"
 * - allowMultiple?: boolean
 * - manualFeedback?: boolean   // 3단계 등 수동 버튼으로 피드백 받을 때
 * - missionId: number
 * - stepNo: 1 | 2 | 3
 */
export default function UploadModal({
  open, onClose, onSubmit,
  title = "미션 제출하기",
  variant = "blue",
  allowMultiple = false,
  manualFeedback = false,
  missionId,
  stepNo,
}) {
  const [files, setFiles] = useState([]);       // File[]
  const [preview, setPreview] = useState([]);   // [{file,name,isImage,url}]
  const fileInputRef = useRef(null);

  const stepNum = useMemo(() => Number(stepNo), [stepNo]);
  const isAutoFeedbackStep = stepNum === 1 || stepNum === 2;
  // 서버는 1/2만 허용 → 3단계에서도 보낼 땐 2로 매핑
  const stepForFeedback = isAutoFeedbackStep ? stepNum : 2;

  const {
    feedback,            // { summary, bullets }
    loading: fbLoading,  // boolean
    error: fbError,      // string
    requestFeedback,
    reset: resetFeedback,
  } = useAiFeedback({ missionId, stepNo: stepForFeedback });

  // ✅ 허용 확장자/타입 + input accept 문자열 + 로컬 에러 //제거?
  const ALLOWED_EXTS  = ["png", "jpg", "jpeg", "pdf", "mp4", "txt"];
  const ALLOWED_TYPES = ["image/png", "image/jpeg", "application/pdf", "video/mp4", "text/plain"];
  const ACCEPT_STR    = ".png,.jpg,.jpeg,.pdf,.mp4,.txt";
  const [localError, setLocalError] = useState("");

  const isAllowed = (f) => {
    const ext = (f.name.split(".").pop() || "").toLowerCase();
    return ALLOWED_EXTS.includes(ext) || ALLOWED_TYPES.includes(f.type);
  };

  const clearAll = () => {
    preview.forEach(p => p?.url && URL.revokeObjectURL(p.url));
    setFiles([]);
    setPreview([]);
    if (fileInputRef.current) fileInputRef.current.value = "";
    setLocalError("");          // 로컬 에러 리셋
    resetFeedback();            // 훅 상태 리셋
  };

  // 모달 닫히면 초기화
  useEffect(() => { if (!open) clearAll(); }, [open]);

  // 프리뷰 빌드
  const buildPreview = (list) =>
    Array.from(list).map(f => {
      const isImg = (f.type || "").startsWith("image/");
      return { file: f, name: f.name, isImage: isImg, url: isImg ? URL.createObjectURL(f) : null };
    });

  const handleAddFiles = (list) => {
    if (!list || list.length === 0) return;
    const items = buildPreview(list);
    setFiles(prev => [...prev, ...items.map(i => i.file)]);
    setPreview(prev => [...prev, ...items]);
  };

  // ✅ 파일 선택/드롭 공통 처리 (로컬 검증 + 1·2단계 자동요청)
  const handlePick = async (fileList) => {
    const arr     = Array.from(fileList || []);
    const valid   = arr.filter(isAllowed);
    const invalid = arr.filter(f => !isAllowed(f));

    if (invalid.length) {
      setLocalError(`허용되지 않는 확장자: ${invalid.map(f => f.name).join(", ")}`);
    } else {
      setLocalError("");
    }
    if (!valid.length) return;

    handleAddFiles(valid);

    if (isAutoFeedbackStep) {
      try {
        await requestFeedback({ files: valid, note: "" });
      } catch { /* 훅이 error 관리 */ }
    }
  };

  const removeAt = (idx) => {
    const p = preview[idx];
    if (p?.url) URL.revokeObjectURL(p.url);
    setPreview(prev => prev.filter((_, i) => i !== idx));
    setFiles(prev => prev.filter((_, i) => i !== idx));
  };

  // 3단계 수동 피드백 버튼
  const handleAskFeedbackManually = async () => {
    if (!files.length) return;
    try { await requestFeedback({ files, note: "" }); } catch {}
  };

  if (!open) return null;

  // 테마
  const THEME = variant === "purple"
    ? { accent: "#8B6FD4", bg: "#F0EAFF", border: "#8B6FD4", chip: "#8B6FD4" }
    : { accent: "#2D5CF6", bg: "#EAF3FD", border: "#368FEF", chip: "#368FEF" };

  const handleBgClick = (e) => { if (e.target === e.currentTarget) onClose?.(); };

  return (
    <S.ModalBackdrop onClick={handleBgClick}>
      <S.ModalCard role="dialog" aria-modal="true" aria-labelledby="upload-title">
        <S.ModalHeader>
          <h3 id="upload-title">{title}</h3>
          <S.CloseBtn aria-label="닫기" onClick={() => { clearAll(); onClose?.(); }}>×</S.CloseBtn>
        </S.ModalHeader>

        <S.Dropzone
          $t={THEME}
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => {
            e.preventDefault();
            const list = e.dataTransfer.files;
            if (list?.length) handlePick(list);
          }}
        >
          {preview.length ? (
            <S.PreviewWrapGrid>
              {preview.map((p, i) => (
                <S.PreviewItem key={i}>
                  <S.RemoveBtn onClick={() => removeAt(i)} $t={THEME}>×</S.RemoveBtn>
                  {p.isImage ? <S.PreviewImg src={p.url} alt={p.name} /> : <S.FileInfo>📄 {p.name}</S.FileInfo>}
                </S.PreviewItem>
              ))}
              <label>
                <S.HiddenInput
                  ref={fileInputRef}
                  type="file"
                  multiple={allowMultiple}
                  accept={ACCEPT_STR}                // ✅ accept 추가
                  onChange={(e) => handlePick(e.target.files)}
                />
                <S.UploadChip $t={THEME}>파일 추가</S.UploadChip>
              </label>
            </S.PreviewWrapGrid>
          ) : (
            <>

              <S.CloudIcon 
              $t={THEME}
              as={UploadIcon} style={{ color: THEME.accent }} />

              <p>작업한 파일을 업로드해 주세요</p>
              <label>
                <S.HiddenInput
                  ref={fileInputRef}
                  type="file"
                  multiple={allowMultiple}
                  accept={ACCEPT_STR}                // ✅ accept 추가
                  onChange={(e) => handlePick(e.target.files)}
                />
                <S.UploadChip $t={THEME}>Upload</S.UploadChip>
              </label>
            </>
          )}
        </S.Dropzone>

        {manualFeedback && (
          <S.Actions>
            <S.SecondaryBtn
              $t={THEME}
              disabled={!files.length || fbLoading}
              onClick={handleAskFeedbackManually}
            >
              {fbLoading ? "분석 중…" : "피드백 받기"}
            </S.SecondaryBtn>
          </S.Actions>
        )}

        <S.FieldLabel>AI 피드백</S.FieldLabel>
        <S.FeedbackBox
        $t={THEME}>
          {fbLoading && <span className="placeholder">분석 중…</span>}

          {/* 로컬 확장자 에러 또는 서버 에러 */}
          {!fbLoading && (localError || fbError) && (
            <div style={{ color: "#ef4444" }}>{localError || fbError}</div>
          )}

          {!fbLoading && !localError && !fbError && feedback?.summary ? (
  <>
    {/* summary 줄글 → 문단 배열로 쪼갬 */}
    {feedback.summary
      .split(/\n+/)                 // 연속 줄바꿈 기준 분리
      .filter(Boolean)              // 빈 문자열 제거
      .map((para, idx) => (
        <p key={idx} style={{ marginBottom: "6px" }}>
          {para}
        </p>
      ))}

    {/* bullets 리스트 */}
    {feedback.bullets?.length > 0 && (
      <ul>
        {feedback.bullets.map((b, i) => (
          <li key={i}>{b}</li>
        ))}
      </ul>
    )}
  </>
) : (!fbLoading && !localError && !fbError && (
  <span className="placeholder">
    {isAutoFeedbackStep
      ? "파일을 업로드하면 자동 피드백이 표시됩니다."
      : "최종 작업물을 업로드 한 후 피드백 받기를 눌러주세요!"}
  </span>
))}
        </S.FeedbackBox>

        <S.Footer>
          <S.PrimaryBtn
            $t={THEME}
            disabled={!files.length}
            onClick={() => { onSubmit?.({ files, feedback }); clearAll(); onClose?.(); }}
          >
            {manualFeedback ? "상인에게 전달하기" : "완료"}
          </S.PrimaryBtn>
        </S.Footer>
      </S.ModalCard>
    </S.ModalBackdrop>
  );
}

