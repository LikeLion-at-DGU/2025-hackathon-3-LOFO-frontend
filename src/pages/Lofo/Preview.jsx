// src/pages/Lofo/Preview.jsx
import React, { useEffect, useState } from "react";
import styled from "styled-components";

const Overlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 60;
`;

const Container = styled.div`
  position: relative;
  max-width: 92vw;
  max-height: 92vh;
  display: grid;
  place-items: center;
`;

const Img = styled.img`
  max-width: 100%;
  max-height: 92vh;
  display: block;
`;

const Video = styled.video`
  width: 100%;
  max-height: 92vh;
  display: block;
  outline: none;
`;

const Pdf = styled.iframe`
  width: min(92vw, 1200px);
  height: min(92vh, 80vw);
  border: 0;
  background: #fff;
`;

const NavBtn = styled.button`
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  ${({ $left }) => ($left ? "left: 12px;" : "right: 12px;")}
  width: 44px;
  height: 44px;
  border-radius: 999px;
  border: 0;
  background: rgba(255, 255, 255, 0.9);
  font-weight: 800;
  font-size: 22px;
  cursor: pointer;
`;

const CloseBtn = styled.button`
  position: absolute;
  top: 12px;
  right: 12px;
  width: 36px;
  height: 36px;
  border-radius: 999px;
  border: 0;
  background: rgba(255, 255, 255, 0.95);
  color: #111827;
  font-size: 18px;
  font-weight: 800;
  cursor: pointer;
`;

function fileKindOf(f) {
  const t = (f?.type || "").toLowerCase();
  const name = (f?.name || f?.url || "").toLowerCase();
  const byExt = (exts) => exts.some((x) => name.endsWith(x));
  if (
    t.startsWith("image/") ||
    byExt([".png", ".jpg", ".jpeg", ".gif", ".webp", ".bmp", ".svg"])
  )
    return "image";
  if (t.startsWith("video/") || byExt([".mp4", ".webm", ".mov", ".m4v"]))
    return "video";
  if (t.includes("pdf") || byExt([".pdf"])) return "pdf";
  return "other";
}

export default function Preview({
  isOpen,
  onClose,
  files = [],
  initialIndex = 0,
}) {
  const safeFiles = Array.isArray(files) ? files : [];
  const [idx, setIdx] = useState(initialIndex);

  useEffect(() => {
    if (!isOpen) return;
    setIdx(
      Math.min(Math.max(initialIndex, 0), Math.max(0, safeFiles.length - 1))
    );
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [isOpen, initialIndex, safeFiles.length]);

  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e) => {
      if (e.key === "Escape") onClose?.();
      if (e.key === "ArrowRight" && safeFiles.length > 1)
        setIdx((p) => (p + 1) % safeFiles.length);
      if (e.key === "ArrowLeft" && safeFiles.length > 1)
        setIdx((p) => (p - 1 + safeFiles.length) % safeFiles.length);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isOpen, safeFiles.length, onClose]);

  if (!isOpen || !safeFiles.length) return null;

  const current = safeFiles[idx];
  const kind = fileKindOf(current);

  return (
    <Overlay onClick={onClose}>
      <Container onClick={(e) => e.stopPropagation()}>
        {/* X 닫기 버튼 */}
        <CloseBtn
          onClick={(e) => {
            e.stopPropagation();
            onClose?.();
          }}
          aria-label="닫기"
          title="닫기"
        >
          ✕
        </CloseBtn>

        {kind === "image" && (
          <Img src={current.url} alt={current.name || "image"} />
        )}
        {kind === "video" && <Video src={current.url} controls playsInline />}
        {kind === "pdf" && (
          <Pdf src={current.url} title={current.name || "pdf"} />
        )}
        {kind === "other" && (
          <a
            href={current.url}
            target="_blank"
            rel="noreferrer"
            style={{ color: "#fff" }}
          >
            파일 열기
          </a>
        )}

        {safeFiles.length > 1 && (
          <>
            <NavBtn
              $left
              onClick={() =>
                setIdx((p) => (p - 1 + safeFiles.length) % safeFiles.length)
              }
              aria-label="이전"
              title="이전"
            >
              ‹
            </NavBtn>
            <NavBtn
              onClick={() => setIdx((p) => (p + 1) % safeFiles.length)}
              aria-label="다음"
              title="다음"
            >
              ›
            </NavBtn>
          </>
        )}
      </Container>
    </Overlay>
  );
}
