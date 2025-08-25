// src/pages/Home/Discover.jsx
import React, { useEffect, useMemo, useState, useCallback } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import { getCommunityList } from "../../../../apis/community";
// ---- styles ----
const Wrap = styled.div`
  position: relative;
  width: 450px;
  max-width: calc(100vw - 64px);
  margin: 28px auto 0;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const ArrowBtn = styled.button`
  position: absolute;
  ${(p) => (p.$dir === "left" ? "left: -20px;" : "right: -20px;")}
  width: 54px;
  height: 54px;
  border-radius: 50%;
  border: none;
  background: #fff;
  box-shadow: 0 10px 24px rgba(0, 0, 0, 0.12);
  cursor: pointer;
  display: grid;
  place-items: center;
  z-index: 2;

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  @media (max-width: 640px) {
    ${(p) => (p.$dir === "left" ? "left: -10px;" : "right: -10px;")}
    width: 48px;
    height: 48px;
  }
`;

const Chevron = styled.span`
  width: 14px;
  height: 14px;
  display: inline-block;
  border-right: 3px solid #6b7280;
  border-bottom: 3px solid #6b7280;
  transform: ${(p) =>
    p.$dir === "left" ? "rotate(135deg)" : "rotate(-45deg)"};
  border-radius: 2px;
`;

const Card = styled.div`
  position: relative;
  width: 100%;
  aspect-ratio: 16/9;
  border-radius: 22px;
  overflow: hidden;
  box-shadow: 0 8px 28px rgba(0, 0, 0, 0.12);
  cursor: pointer;
`;

const Img = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
`;

const Gradient = styled.div`
  position: absolute;
  inset: 0;
  background: linear-gradient(to top, rgba(0, 0, 0, 0.55), transparent 50%);
`;

const Meta = styled.div`
  position: absolute;
  left: 20px;
  right: 20px;
  bottom: 16px;
  color: #fff;
`;

const Title = styled.div`
  font-weight: 800;
  font-size: 18px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;
const Store = styled.div`
  margin-top: 6px;
  font-size: 13px;
  opacity: 0.9;
`;

// ---- component ----
export default function Discover() {
  const [items, setItems] = useState([]);
  const [idx, setIdx] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const { items } = await getCommunityList();
        if (!mounted) return;
        const valid = items.filter((x) => x.imageUrl);
        setItems(valid);
        setIdx(0);
      } catch (e) {
        setItems([]);
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  const len = items.length;
  const cur = useMemo(() => (len ? items[idx % len] : null), [items, idx, len]);

  const prev = useCallback(
    () => setIdx((i) => (len ? (i - 1 + len) % len : i)),
    [len]
  );
  const next = useCallback(
    () => setIdx((i) => (len ? (i + 1) % len : i)),
    [len]
  );

  if (!cur) return null;

  return (
    <Wrap>
      <ArrowBtn
        $dir="left"
        onClick={prev}
        disabled={len <= 1}
        aria-label="이전"
      >
        <Chevron $dir="left" />
      </ArrowBtn>

      <Card onClick={() => navigate("/community")} title="발견탭으로 이동">
        <Img
          src={cur.imageUrl}
          alt={cur.title || "작업물"}
          loading="lazy"
          decoding="async"
        />
        <Gradient />
        <Meta>
          <Title>{cur.title}</Title>
          <Store>{cur.storeName}</Store>
        </Meta>
      </Card>

      <ArrowBtn
        $dir="right"
        onClick={next}
        disabled={len <= 1}
        aria-label="다음"
      >
        <Chevron $dir="right" />
      </ArrowBtn>
    </Wrap>
  );
}
