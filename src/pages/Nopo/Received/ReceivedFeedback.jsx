import React, { useState } from "react";
import styled from "styled-components";
import logo from "../../../assets/logo.svg";
import testvideo from "../../../assets/testvideo.mp4";

const Overlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 50;
`;

const ModalContent = styled.div`
  position: relative;
  width: 800px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const MediaWrapper = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;

  img,
  video {
    max-height: 600px;
    object-fit: contain;
  }
`;

const CloseButton = styled.button`
  position: absolute;
  top: 24px;
  right: 24px;
  color: white;
  font-size: 24px;
  cursor: pointer;
`;

const NavButton = styled.button`
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  color: white;
  font-size: 32px;
  cursor: pointer;
  padding: 8px;
  background: transparent;
  border: none;
`;

const LeftButton = styled(NavButton)`
  left: 0;
`;

const RightButton = styled(NavButton)`
  right: 0;
`;

const OpenButton = styled.button`
  padding: 10px 16px;
  background: #2563eb;
  color: white;
  border-radius: 8px;
  cursor: pointer;
  border: none;
`;

const PostModal = ({ isOpen, onClose }) => {
  const media = [
    { type: "image", url: "logo" },
    { type: "video", url: "testvideo" },
  ];

  const [currentIndex, setCurrentIndex] = useState(0);

  if (!isOpen) return null;

  const prevMedia = () => {
    setCurrentIndex((prev) => (prev === 0 ? media.length - 1 : prev - 1));
  };

  const nextMedia = () => {
    setCurrentIndex((prev) => (prev === media.length - 1 ? 0 : prev + 1));
  };

  return (
    <Overlay>
      <CloseButton onClick={onClose}>✕</CloseButton>
      <ModalContent>
        <LeftButton onClick={prevMedia}>◀</LeftButton>

        <MediaWrapper>
          {media[currentIndex].type === "image" ? (
            <img src={media[currentIndex].url} alt="media" />
          ) : (
            <video src={media[currentIndex].url} controls />
          )}
        </MediaWrapper>

        <RightButton onClick={nextMedia}>▶</RightButton>
      </ModalContent>
    </Overlay>
  );
};

const ReceivedFeedback = () => {
  const [open, setOpen] = useState(false);

  return (
    <div
      style={{
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: "#f3f4f6",
      }}
    >
      <OpenButton onClick={() => setOpen(true)}>게시물 열기</OpenButton>
      <PostModal isOpen={open} onClose={() => setOpen(false)} />
    </div>
  );
};

export default ReceivedFeedback;
