import styled from "styled-components";
import { useState } from "react";

/**
 * props
 * - open, onClose, onSubmit({file, feedback})
 * - title?: string
 * - variant?: "blue" | "purple"   // 색 테마
 * - showFeedbackAction?: boolean   // "피드백 받기" 버튼 노출
 * - onAskFeedback?: ({ file, currentText }) => Promise<string> | string
 */

export default function UploadModal({ 
  open, onClose, onSubmit,
  title = "미션 제출하기",
  variant = "blue",
  showFeedbackAction = false,
 }) {
  const [file, setFile] = useState(null);
  const [feedback, setFeedback] = useState("");
  const [fbLoading, setFbLoading] = useState(false);

  if (!open) return null;

  const THEME = variant === "purple"
    ? { accent: "#8B6FD4", bg: "#F2ECFF", border: "#C7B5F3", chip: "#EAE2FF" }
    : { accent: "#2D5CF6", bg: "#F3F7FF", border: "#9DB7FF", chip: "#E3EEFF" };

  const handleBgClick = (e) => {
    if (e.target === e.currentTarget) onClose?.();
  };

  const askFeedback = async () => {
    if (!onAskFeedback) return;
    try {
      setFbLoading(true);
      const text = await onAskFeedback({ file, currentText: feedback });
      if (typeof text === "string") setFeedback(text);
    } finally {
      setFbLoading(false);
    }
  };

  return (
    <ModalBackdrop onClick={handleBgClick}>
      <ModalCard role="dialog" aria-modal="true" aria-labelledby="upload-title">
        <ModalHeader>
          <h3 id="upload-title">미션 제출하기</h3>
          <CloseBtn aria-label="닫기" onClick={onClose}>×</CloseBtn>
        </ModalHeader>

        <Dropzone $t={THEME}
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => {
            e.preventDefault();
            const f = e.dataTransfer.files?.[0];
            if (f) setFile(f);
          }}
        >
          <CloudIcon viewBox="0 0 24 24" aria-hidden style={{ color: THEME.accent }}>
            <path d="M6 16a4 4 0 0 1 .9-7.9A5 5 0 0 1 19 9a3 3 0 0 1-.2 6H6z"
              fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M12 14V8m0 0l-3 3m3-3l3 3"
              fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
          </CloudIcon>

          <p>{file ? `선택된 파일: ${file.name}` : "작업한 파일을 업로드해 주세요"}</p>

          <label>
            <HiddenInput
              type="file"
              onChange={(e) => setFile(e.target.files?.[0] ?? null)}
            />
            <UploadChip $t={THEME}>Upload</UploadChip>
          </label>
        </Dropzone>

         {showFeedbackAction && (
          <Actions>
            <SecondaryBtn $t={THEME} disabled={!file || fbLoading} onClick={askFeedback}>
              {fbLoading ? "분석 중…" : "피드백 받기"}
            </SecondaryBtn>
          </Actions>
        )}

        <FieldLabel>AI 피드백</FieldLabel>
        <Textarea
          placeholder="예: 굿굿"
          value={feedback}
          onChange={(e) => setFeedback(e.target.value)}
        />

        <Footer>
          <PrimaryBtn $t={THEME} disabled={!file}
            onClick={() => onSubmit?.({ file, feedback })}
          >
            완료
          </PrimaryBtn>
        </Footer>
      </ModalCard>
    </ModalBackdrop>
  );
}

/* --------- modal styles --------- */
const ModalBackdrop = styled.div`
  position: fixed; inset: 0; background: rgba(0,0,0,.38);
  display: grid; place-items: center; z-index: 1000;
`;
const ModalCard = styled.div`
  width: 380px; max-width: calc(100vw - 32px);
  background: #fff; border-radius: 14px; box-shadow: 0 12px 40px rgba(0,0,0,.18);
  padding: 18px;
`;
const ModalHeader = styled.div`
  display:flex; align-items:center; justify-content:space-between; margin-bottom: 12px;
  h3 { font-size:16px; font-weight:800; }
`;
const CloseBtn = styled.button`border:0; background:transparent; font-size:20px; cursor:pointer; color:#6b7280;`;

const Dropzone = styled.div`
  margin: 6px 0 10px;
  border: 1.5px dashed ${(p) => p.$t.border};
  border-radius: 12px;
  background: ${(p) => p.$t.bg};
  height: 140px; display:grid; place-items:center; text-align:center; gap:10px; padding: 10px;
  p { font-size:12px; color:#6b7280; }
`;
const CloudIcon = styled.svg`width: 48px; height: 48px;`;
const HiddenInput = styled.input`position:absolute; width:1px; height:1px; overflow:hidden; clip:rect(0 0 0 0);`;
const UploadChip = styled.span`
  display:inline-block; padding:6px 14px; border-radius:999px;
  background:${(p) => p.$t.chip}; color:${(p) => p.$t.accent}; font-weight:800; border:1px solid ${(p) => p.$t.border};
  cursor:pointer;
`;
const FieldLabel = styled.div`font-size:12px; font-weight:700; margin: 10px 0 6px; color:#374151;`;
const Textarea = styled.textarea`
  width:100%; min-height: 70px; border:1px solid #e5e7eb; border-radius:10px; padding:10px;
  &:focus { border-color:#93c5fd; box-shadow: 0 0 0 3px rgba(147,197,253,.35); }
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