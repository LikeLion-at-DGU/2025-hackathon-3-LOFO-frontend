//import

import React, { useState } from "react";
import styled from "styled-components";

const Overlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
`;

const Modal = styled.div`
  position: relative;
  background: white;
  padding: 20px;
  border-radius: 12px;
  max-width: 800px;
  width: 90%;
`;

const MediaWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
`;

const Button = styled.button`
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  background: white;
  border: none;
  padding: 10px;
  cursor: pointer;
  font-size: 18px;
  border-radius: 50%;
`;

const PrevButton = styled(Button)`
  left: -50px;
`;

const NextButton = styled(Button)`
  right: -50px;
`;

function ModalViewer({ isOpen, onClose, files }) {
  const [index, setIndex] = useState(0);

  if (!isOpen) return null;

  const currentFile = files[index];

  const next = () => setIndex((prev) => (prev + 1) % files.length);
  const prev = () =>
    setIndex((prev) => (prev - 1 + files.length) % files.length);

  return (
    <Overlay onClick={onClose}>
      <Modal onClick={(e) => e.stopPropagation()}>
        <MediaWrapper>
          {currentFile.type.startsWith("image/") ? (
            <img src={currentFile.url} alt="uploaded" width="100%" />
          ) : (
            <video src={currentFile.url} controls width="100%" />
          )}
        </MediaWrapper>

        {files.length > 1 && (
          <>
            <PrevButton onClick={prev}>‹</PrevButton>
            <NextButton onClick={next}>›</NextButton>
          </>
        )}

        <button onClick={onClose}>닫기</button>
      </Modal>
    </Overlay>
  );
}

export default ModalViewer;
