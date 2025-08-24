//--------------------폐기예정------------------------//

import styled from "styled-components";
import { useEffect, useRef, useState, useMemo } from "react";
import { useAiFeedback } from "../../../../hooks/useAiFeedback";


/**
 * props
 * - open, onClose, onSubmit({file, feedback})
 * - title?: string
 * - variant?: "blue" | "purple"
 * - showFeedbackAction?: boolean
 * - onAskFeedback?: ({ file, currentText }) => Promise<string> | string
 */
export default function UploadModal({
  open, onClose, onSubmit,
  title = "미션 제출하기",
  variant = "blue",
  // 3단계 전용 옵션
  allowMultiple = false,            // ✅ 여러 파일 업로드 허용
  manualFeedback = false,           // ✅ 버튼 눌러야 피드백
  missionId,
  stepNo, // 1/2에서만 AI 자동피드백. 3단계면 undefined
}) {
  //const [file, setFile] = useState(null);
  //const [preview, setPreview] = useState(null);   // 🆕 미리보기 URL
  //const [isImage, setIsImage] = useState(false);
  const [files, setFiles] = useState([]);     // ✅ 여러 파일
  const [preview, setPreview] = useState([]); // [{url,isImage,name}]

  //const [feedback, setFeedback] = useState("");
  //const [fbLoading, setFbLoading] = useState(false);
  const fileInputRef = useRef(null);              // 🆕 input 리셋용
  const stepNum = useMemo(() => Number(stepNo), [stepNo]);
  const isAutoFeedbackStep = stepNum === 1 || stepNum === 2;
  // 🔧 3단계(피드백 수동)일 때는 서버 제약(1/2만 허용)에 맞춰 2로 보냄
  const stepForFeedback = isAutoFeedbackStep ? stepNum : 2;

  const {
    feedback,            // { summary, bullets }
    loading: fbLoading,  // boolean
    error: fbError,      // string
    requestFeedback,
    reset: resetFeedback,
  } = useAiFeedback({ missionId, stepNo: stepForFeedback });
  
  const clearAll = () => {
    //setFile(null);
    //setPreview?.(null);
    //setIsImage(false);

    // 모두 초기화
    preview.forEach(p => p?.url && URL.revokeObjectURL(p.url));
    setFiles([]);
    setPreview([]);
    if (fileInputRef.current) fileInputRef.current.value = "";
    resetFeedback();
  };

  // A. 모달이 닫힐 때 초기화 (새로 추가)
  useEffect(() => {
    if (!open) clearAll();
  }, [open]);


  // B. 파일이 바뀔 때 미리보기 URL 생성/해제
  //useEffect(() => {
  //if (!file) {
    //setPreview(null);
    //setIsImage(false);
    //return;
  //}
  //if ((file.type || "").startsWith("image/")) {
    // 이미지면 미리보기 URL 생성
    //const url = URL.createObjectURL(file);
    //setPreview(url);
    //setIsImage(true);
    //return () => URL.revokeObjectURL(url);
  //} else {
    // 이미지가 아니면 (txt, pdf, etc) 미리보기 대신 이름만
    //setPreview(null);
    //setIsImage(false);
 // }
//}, [file]);

  // B. 파일 선택/추가
  const buildPreview = (list) =>
    Array.from(list).map(f => {
      const isImg = (f.type || "").startsWith("image/");
      return { file: f, name: f.name, isImage: isImg, url: isImg ? URL.createObjectURL(f) : null };
    });

  const handleAddFiles = (list) => {
    if (!list || list.length === 0) return;
    const items = buildPreview(list);
    setFiles(prev => [...prev, ...items.map(i=>i.file)]);
    setPreview(prev => [...prev, ...items]);
  };

useEffect(() => {
  console.log("missionId, stepNo(type):", missionId, stepNo, typeof stepNo);
}, [missionId, stepNo]);

  if (!open) return null;

  // 테마
  const THEME = variant === "purple"
    ? { accent: "#8B6FD4", bg: "#F2ECFF", border: "#C7B5F3", chip: "#EAE2FF" }
    : { accent: "#2D5CF6", bg: "#F3F7FF", border: "#9DB7FF", chip: "#E3EEFF" };

  const handleBgClick = (e) => {
    if (e.target === e.currentTarget) onClose?.();
  };

  /*const askFeedback = async () => {
    if (!onAskFeedback) return;
    try {
      setFbLoading(true);
      const text = await onAskFeedback({ file, currentText: feedback });
      if (typeof text === "string") setFeedback(text);
    } finally {
      setFbLoading(false);
    }
  };*/

   // ✅ 파일 픽 시 자동 업로드 & 피드백 요청
  //const handlePick = async (f) => {
    //if (!f) return;
    //setFile(f);
    
    // 1·2단계만 자동 피드백 호출
    //if (isAutoFeedbackStep) {
      //try {
        //await requestFeedback({ files: [f], note: "" });
      //} catch (e) {
        //console.error(e);
      //}
    //}
      //  console.log("missionId, stepNo(type):", missionId, stepNo, typeof stepNo);
  //};

    // ✅ 파일 선택 시: 1·2단계면 자동 피드백, 3단계면 대기
  const handlePick = async (fileList) => {
    handleAddFiles(fileList);
    if (isAutoFeedbackStep) {
      try { await requestFeedback({ files: Array.from(fileList), note: "" }); } catch {}
    }
  };

//    const clearFile = () => {
//    setFile(null);
//    setPreview(null);
//    if (fileInputRef.current) fileInputRef.current.value = "";
//    resetFeedback();
//  };

    const removeAt = (idx) => {
    const p = preview[idx];
    if (p?.url) URL.revokeObjectURL(p.url);
    setPreview(prev => prev.filter((_,i)=>i!==idx));
    setFiles(prev => prev.filter((_,i)=>i!==idx));
  };

     // 3단계 수동 피드백
  const handleAskFeedbackManually = async () => {
     if (!files.length) return;
    try { await requestFeedback({ files, note: "" }); } catch {}
  };

  if (!open) return null;

   return (
    <ModalBackdrop onClick={handleBgClick}>
      <ModalCard role="dialog" aria-modal="true" aria-labelledby="upload-title">
        <ModalHeader>
          <h3 id="upload-title">{title}</h3>
          <CloseBtn
            aria-label="닫기"
            onClick={() => { clearAll(); onClose?.(); }}
          >×</CloseBtn>
        </ModalHeader>

        <Dropzone
          $t={THEME}
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => {
            e.preventDefault();
            const list = e.dataTransfer.files; if (list?.length) handlePick(list);
          }}
        >
          {preview.length ? (
            <PreviewWrapGrid>
              {preview.map((p, i) => (
                <PreviewItem key={i}>
                  <RemoveBtn onClick={()=>removeAt(i)} $t={THEME}>×</RemoveBtn>
                  {p.isImage ? <PreviewImg src={p.url} alt={p.name}/> : <FileInfo>📄 {p.name}</FileInfo>}
                </PreviewItem>
              ))}
              <label>
                <HiddenInput
                  ref={fileInputRef}
                  type="file"
                  multiple={allowMultiple}
                  onChange={(e)=>handlePick(e.target.files)}
              />
                <UploadChip $t={THEME}>파일 추가</UploadChip>
              </label>
            </PreviewWrapGrid>
          ) : (
            <>
              <CloudIcon viewBox="0 0 24 24" aria-hidden style={{ color: THEME.accent }}>
                <path d="M6 16a4 4 0 0 1 .9-7.9A5 5 0 0 1 19 9a3 3 0 0 1-.2 6H6z"
                  fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M12 14V8m0 0l-3 3m3-3l3 3"
                  fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
              </CloudIcon>
              <p>작업한 파일을 업로드해 주세요</p>
              <label>
                <HiddenInput
                  ref={fileInputRef}
                  type="file"
                  multiple={allowMultiple}
                  onChange={(e)=>handlePick(e.target.files)}
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
          {!fbLoading && fbError && (
            <div style={{ color: "#ef4444" }}>{fbError}</div>
          )}
          {!fbLoading && !fbError && feedback?.summary ? (
            <>
              <p><b>{feedback.summary}</b></p>
              <ul>
                {feedback.bullets?.map((b, i) => <li key={i}>{b}</li>)}
              </ul>
            </>
          ) : (!fbLoading && !fbError && (
            <span className="placeholder">파일을 업로드하면 자동 피드백이 표시됩니다.</span>
          ))}
        </FeedbackBox>

        <Footer>
          <PrimaryBtn
            $t={THEME}
           disabled={!files.length}
           onClick={() => { onSubmit?.({ files, feedback }); clearAll(); onClose?.(); }}
          >
            {/* 3단계면 라벨 바꾸고, 기본은 "완료" */}
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
  ::-webkit-scrollbar {
  width: 1px;
  background: gray;
}
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
  font-size: 14px;
  color: #374151;
  word-break: break-all;
  padding: 10px;
  text-align: center;
`;
const PreviewWrap = styled.div`
  width: 100%; height: 100%;
  display: grid; place-items: center;
  position: relative;
  overflow: hidden; border-radius: 10px;
`;
const PreviewImg = styled.img`
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
`;
const RemoveBtn = styled.button`
  position: absolute; top: 8px; right: 8px;
  width: 22px; height: 22px; line-height: 20px; text-align: center;
  border-radius: 999px; border: 1px solid ${(p)=>p.$t.border};
  background: #fff; color: ${(p)=>p.$t.accent};
  font-weight: 800; cursor: pointer;
  box-shadow: 0 2px 6px rgba(0,0,0,.06);
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
const FeedbackBox = styled.div`
  border: 1px solid #e5e7eb;
  border-radius: 10px;
  padding: 12px;
  min-height: 80px;
  font-size: 14px;
  background: #fafafa;
  .placeholder { color: #9ca3af; }
  ul { margin-top: 4px; padding-left: 18px; list-style: disc; }
`;
const PreviewWrapGrid = styled.div`
  width: 100%; display: grid; grid-template-columns: repeat(3, 1fr);
  gap: 8px; align-items: stretch;
`;
const PreviewItem = styled.div`
  position: relative; height: 90px; border-radius: 10px; overflow: hidden;
  display: grid; place-items: center; background: #fff;
  border: 1px solid #e5e7eb;
`;

