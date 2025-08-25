import styled from "styled-components";
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
    ? { accent: "#8B6FD4", bg: "#F2ECFF", border: "#C7B5F3", chip: "#EAE2FF" }
    : { accent: "#2D5CF6", bg: "#F3F7FF", border: "#9DB7FF", chip: "#E3EEFF" };

  const handleBgClick = (e) => { if (e.target === e.currentTarget) onClose?.(); };

  return (
    <ModalBackdrop onClick={handleBgClick}>
      <ModalCard role="dialog" aria-modal="true" aria-labelledby="upload-title">
        <ModalHeader>
          <h3 id="upload-title">{title}</h3>
          <CloseBtn aria-label="닫기" onClick={() => { clearAll(); onClose?.(); }}>×</CloseBtn>
        </ModalHeader>

        <Dropzone
          $t={THEME}
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => {
            e.preventDefault();
            const list = e.dataTransfer.files;
            if (list?.length) handlePick(list);
          }}
        >
          {preview.length ? (
            <PreviewWrapGrid>
              {preview.map((p, i) => (
                <PreviewItem key={i}>
                  <RemoveBtn onClick={() => removeAt(i)} $t={THEME}>×</RemoveBtn>
                  {p.isImage ? <PreviewImg src={p.url} alt={p.name} /> : <FileInfo>📄 {p.name}</FileInfo>}
                </PreviewItem>
              ))}
              <label>
                <HiddenInput
                  ref={fileInputRef}
                  type="file"
                  multiple={allowMultiple}
                  accept={ACCEPT_STR}                // ✅ accept 추가
                  onChange={(e) => handlePick(e.target.files)}
                />
                <UploadChip $t={THEME}>파일 추가</UploadChip>
              </label>
            </PreviewWrapGrid>
          ) : (
            <>
              <CloudIcon viewBox="0 0 24 24" aria-hidden style={{ color: THEME.accent }}>
                <path d="M6 16a4 4 0 0 1 .9-7.9A5 5 0 0 1 19 9a3 3 0 0 1-.2 6H6z"
                  fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M12 14V8m0 0l-3 3m3-3l3 3"
                  fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
              </CloudIcon>
              <p>작업한 파일을 업로드해 주세요</p>
              <label>
                <HiddenInput
                  ref={fileInputRef}
                  type="file"
                  multiple={allowMultiple}
                  accept={ACCEPT_STR}                // ✅ accept 추가
                  onChange={(e) => handlePick(e.target.files)}
                />
                <UploadChip $t={THEME}>Upload</UploadChip>
              </label>
            </>
          )}
        </Dropzone>

        {manualFeedback && (
          <Actions>
            <SecondaryBtn
              $t={THEME}
              disabled={!files.length || fbLoading}
              onClick={handleAskFeedbackManually}
            >
              {fbLoading ? "분석 중…" : "피드백 받기"}
            </SecondaryBtn>
          </Actions>
        )}

        <FieldLabel>AI 피드백</FieldLabel>
        <FeedbackBox>
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
      : "이 단계는 자동 피드백이 없습니다."}
  </span>
))}
        </FeedbackBox>

        <Footer>
          <PrimaryBtn
            $t={THEME}
            disabled={!files.length}
            onClick={() => { onSubmit?.({ files, feedback }); clearAll(); onClose?.(); }}
          >
            {manualFeedback ? "상인에게 전달하기" : "완료"}
          </PrimaryBtn>
        </Footer>
      </ModalCard>
    </ModalBackdrop>
  );
}

/* --------- styles --------- */
const ModalBackdrop = styled.div`
  position: fixed; inset: 0; background: rgba(0,0,0,.38);
  display: grid; place-items: center; z-index: 1000;
`;
const ModalCard = styled.div`
  max-height: 550px; width: 380px; max-width: calc(100vw - 32px);
  background: #fff; border-radius: 14px; box-shadow: 0 12px 40px rgba(0,0,0,.18);
  padding: 18px; overflow: scroll;
  ::-webkit-scrollbar { width: 1px; background: gray; }
`;
const ModalHeader = styled.div`
  display:flex; align-items:center; justify-content:space-between; margin-bottom: 12px;
  h3 { font-size:16px; font-weight:800; }
`;
const CloseBtn = styled.button`
  border:0; background:transparent; font-size:20px; cursor:pointer; color:#6b7280;
`;

const Dropzone = styled.div`
  margin: 6px 0 10px;
  border: 1.5px dashed ${(p) => p.$t.border};
  border-radius: 12px;
  background: ${(p) => p.$t.bg};
  height: 160px;
  display:grid; place-items:center; text-align:center; gap:10px; padding: 10px;
  position: relative;
  p { font-size:12px; color:#6b7280; }
`;
const CloudIcon = styled.svg`width: 48px; height: 48px;`;
const HiddenInput = styled.input`
  position:absolute; width:1px; height:1px; overflow:hidden; clip:rect(0 0 0 0);
`;
const UploadChip = styled.span`
  display:inline-block; padding:6px 14px; border-radius:999px;
  background:${(p) => p.$t.chip}; color:${(p) => p.$t.accent}; font-weight:800; border:1px solid ${(p) => p.$t.border};
  cursor:pointer;
`;
const FileInfo = styled.div`
  font-size: 14px; color: #374151; word-break: break-all; padding: 10px; text-align: center;
`;
const PreviewImg = styled.img`
  max-width: 100%; max-height: 100%; object-fit: contain;
`;
const RemoveBtn = styled.button`
  position: absolute; top: 8px; right: 8px;
  width: 22px; height: 22px; line-height: 20px; text-align: center;
  border-radius: 999px; border: 1px solid ${(p)=>p.$t.border};
  background: #fff; color: ${(p)=>p.$t.accent};
  font-weight: 800; cursor: pointer;
  box-shadow: 0 2px 6px rgba(0,0,0,.06);
`;

const FieldLabel = styled.div`
  font-size:12px; font-weight:700; margin: 10px 0 6px; color:#374151;
`;
const Footer = styled.div`display:flex; justify-content:center; margin-top: 14px;`;
const Actions = styled.div`display:flex; justify-content:flex-start; margin: 6px 0 8px;`;
const PrimaryBtn = styled.button`
  min-width: 140px; height: 36px; border-radius: 18px; font-weight:800; cursor:pointer;
  background:${(p)=>p.$t.chip}; color:${(p)=>p.$t.accent}; border:1px solid ${(p)=>p.$t.border};
  opacity:${p=>p.disabled?0.6:1};
`;
const SecondaryBtn = styled.button`
  margin: 30px auto;
  height: 30px; border-radius: 999px; padding: 0 12px; font-weight:800; cursor:pointer;
  background:#fff; color:${(p)=>p.$t.accent}; border:1px solid ${(p)=>p.$t.border};
  box-shadow: 0 2px 0 rgba(0,0,0,.03);
`;
const FeedbackBox = styled.div`
  border: 1px solid #e5e7eb; border-radius: 10px; padding: 12px; min-height: 80px;
  font-size: 14px; background: #fafafa;
  .placeholder { color: #9ca3af; }
  ul { margin-top: 4px; padding-left: 18px; list-style: disc; }
`;
const PreviewWrapGrid = styled.div`
  width: 100%; display: grid; grid-template-columns: repeat(3, 1fr);
  gap: 8px; align-items: stretch;
`;
const PreviewItem = styled.div`
  position: relative; height: 90px; border-radius: 10px; overflow: hidden;
  display: grid; place-items: center; background: #fff; border: 1px solid #e5e7eb;
`;
