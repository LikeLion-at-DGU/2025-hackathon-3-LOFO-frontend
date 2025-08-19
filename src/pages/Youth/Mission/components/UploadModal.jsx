import styled from "styled-components";
import { useEffect } from "react";

export function UploadModal({ open, onClose }) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <Backdrop onClick={onClose} role="presentation">
      <Dialog
        role="dialog"
        aria-modal="true"
        aria-labelledby="upload-title"
        onClick={(e) => e.stopPropagation()} // 바깥 클릭 시 닫히고, 안쪽 클릭은 유지
      >
        <Header>
          <h2 id="upload-title">미션 제출하기</h2>
          <CloseBtn aria-label="닫기" onClick={onClose}>×</CloseBtn>
        </Header>

        <DropArea>
          <CloudIcon viewBox="0 0 24 24" aria-hidden>
            <path d="M6 15a4 4 0 0 1 0-8 5 5 0 0 1 9.7-1.2A4.5 4.5 0 1 1 18 15H6z"
              fill="none" stroke="currentColor" strokeWidth="1.6"/>
            <path d="M12 13v-4m0 0 2 2m-2-2-2 2" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/>
          </CloudIcon>
          <small>작업한 파일을 업로드해주세요</small>
          <UploadBtn type="button">Upload</UploadBtn>
        </DropArea>

        <Field>
          <label>AI 피드백</label>
          <TextArea placeholder="굿굿" />
        </Field>

        <Footer>
          <PrimaryBtn type="button" onClick={onClose}>완료</PrimaryBtn>
        </Footer>
      </Dialog>
    </Backdrop>
  );
}

/* ------- styles ------- */
const Backdrop = styled.div`
  position: fixed; inset: 0;
  background: rgba(0,0,0,0.35);
  display: grid; place-items: center;
  z-index: 1000;
`;
const Dialog = styled.div`
  width: min(560px, 92vw);
  background: #fff; border-radius: 14px;
  box-shadow: 0 20px 60px rgba(0,0,0,0.2);
  padding: 20px;
`;
const Header = styled.div`
  display:flex; align-items:center; justify-content:space-between;
  margin-bottom: 12px;
  h2 { font-size: 18px; font-weight: 800; }
`;
const CloseBtn = styled.button`
  border:0; background:transparent; font-size: 24px; line-height:1; cursor:pointer;
`;
const DropArea = styled.div`
  border: 2px dashed #bcd6ff; background: #f2f7ff;
  border-radius: 12px; padding: 28px;
  display:flex; align-items:center; justify-content:center; flex-direction:column; gap:10px;
  text-align:center; color:#4f7fff; margin: 8px 0 18px;
`;
const CloudIcon = styled.svg` width: 64px; height: 64px; opacity: .9;`;
const UploadBtn = styled.button`
  margin-top: 8px; padding: 8px 14px; border-radius: 10px;
  border: 1px solid #93c5fd; background: #dbeafe; color:#1d4ed8; font-weight:800;
`;
const Field = styled.div`
  display:flex; flex-direction:column; gap:8px; margin-top: 8px;
  label { font-weight: 800; }
`;
const TextArea = styled.textarea`
  width: 100%; min-height: 72px; border: 1px solid #cfe1ff;
  border-radius: 10px; padding: 12px; resize: vertical; outline: none;
  &:focus { box-shadow: 0 0 0 3px #e5efff; }
`;
const Footer = styled.div`
  display:flex; justify-content:center; padding-top: 12px;
`;
const PrimaryBtn = styled.button`
  padding: 10px 18px; border-radius: 999px; border: 1px solid #93c5fd;
  background: #dbeafe; color:#1d4ed8; font-weight: 800; cursor:pointer;
`;
