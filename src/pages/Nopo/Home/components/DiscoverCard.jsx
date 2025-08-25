// // src/pages/Home/Discover.jsx
// import React, { useEffect, useMemo, useState, useCallback } from "react";
// import styled from "styled-components";
// import { useNavigate } from "react-router-dom";
// import { getCommunityList } from "../../../../apis/community";
// // ---- styles ----
// const Wrap = styled.div`
//   position: relative;
//   width: 450px;
//   max-width: calc(100vw - 64px);
//   margin: 28px auto 0;
//   display: flex;
//   align-items: center;
//   justify-content: center;
// `;

// const ArrowBtn = styled.button`
//   position: absolute;
//   ${(p) => (p.$dir === "left" ? "left: -20px;" : "right: -20px;")}
//   width: 54px;
//   height: 54px;
//   border-radius: 50%;
//   border: none;
//   background: #fff;
//   box-shadow: 0 10px 24px rgba(0, 0, 0, 0.12);
//   cursor: pointer;
//   display: grid;
//   place-items: center;
//   z-index: 2;

//   &:disabled {
//     opacity: 0.5;
//     cursor: not-allowed;
//   }

//   @media (max-width: 640px) {
//     ${(p) => (p.$dir === "left" ? "left: -10px;" : "right: -10px;")}
//     width: 48px;
//     height: 48px;
//   }
// `;

// const Chevron = styled.span`
//   width: 14px;
//   height: 14px;
//   display: inline-block;
//   border-right: 3px solid #6b7280;
//   border-bottom: 3px solid #6b7280;
//   transform: ${(p) =>
//     p.$dir === "left" ? "rotate(135deg)" : "rotate(-45deg)"};
//   border-radius: 2px;
// `;

// const Card = styled.div`
//   position: relative;
//   width: 100%;
//   aspect-ratio: 16/9;
//   border-radius: 22px;
//   overflow: hidden;
//   box-shadow: 0 8px 28px rgba(0, 0, 0, 0.12);
//   cursor: pointer;
// `;

// const Img = styled.img`
//   width: 100%;
//   height: 100%;
//   object-fit: cover;
//   display: block;
// `;

// const Gradient = styled.div`
//   position: absolute;
//   inset: 0;
//   background: linear-gradient(to top, rgba(0, 0, 0, 0.55), transparent 50%);
// `;

// const Meta = styled.div`
//   position: absolute;
//   left: 20px;
//   right: 20px;
//   bottom: 16px;
//   color: #fff;
// `;

// const Title = styled.div`
//   font-weight: 800;
//   font-size: 18px;
//   white-space: nowrap;
//   overflow: hidden;
//   text-overflow: ellipsis;
// `;
// const Store = styled.div`
//   margin-top: 6px;
//   font-size: 13px;
//   opacity: 0.9;
// `;

// // ---- component ----
// export default function Discover() {
//   const [items, setItems] = useState([]);
//   const [idx, setIdx] = useState(0);
//   const navigate = useNavigate();

//   useEffect(() => {
//     let mounted = true;
//     (async () => {
//       try {
//         const { items } = await getCommunityList();
//         if (!mounted) return;
//         const valid = items.filter((x) => x.imageUrl);
//         setItems(valid);
//         setIdx(0);
//       } catch (e) {
//         setItems([]);
//       }
//     })();
//     return () => {
//       mounted = false;
//     };
//   }, []);

//   const len = items.length;
//   const cur = useMemo(() => (len ? items[idx % len] : null), [items, idx, len]);

//   const prev = useCallback(
//     () => setIdx((i) => (len ? (i - 1 + len) % len : i)),
//     [len]
//   );
//   const next = useCallback(
//     () => setIdx((i) => (len ? (i + 1) % len : i)),
//     [len]
//   );

//   if (!cur) return null;

//   return (
//     <Wrap>
//       <ArrowBtn
//         $dir="left"
//         onClick={prev}
//         disabled={len <= 1}
//         aria-label="이전"
//       >
//         <Chevron $dir="left" />
//       </ArrowBtn>

//       <Card onClick={() => navigate("/community")} title="발견탭으로 이동">
//         <Img
//           src={cur.imageUrl}
//           alt={cur.title || "작업물"}
//           loading="lazy"
//           decoding="async"
//         />
//         <Gradient />
//         <Meta>
//           <Title>{cur.title}</Title>
//           <Store>{cur.storeName}</Store>
//         </Meta>
//       </Card>

//       <ArrowBtn
//         $dir="right"
//         onClick={next}
//         disabled={len <= 1}
//         aria-label="다음"
//       >
//         <Chevron $dir="right" />
//       </ArrowBtn>
//     </Wrap>
//   );
// }

// src/pages/Home/Discover.jsx
import React, { useEffect, useMemo, useState, useCallback } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import { getCommunityList } from "../../../../apis/community";

import logo_blue from "../../../../assets/logo_blue.svg";
import logo_nopo from "../../../../assets/logo_nopo.svg";
import logo from "../../../../assets/logo.svg";

// ---- helpers ----
const API_BASE = (import.meta.env.VITE_API_BASE_URL || "").replace(/\/+$/, "");
const addBase = (path = "") => {
  const clean = `/${String(path).replace(/^\/+/, "")}`;
  return API_BASE ? `${API_BASE}${clean}` : `/api${clean}`;
};
const isAbs = (u = "") =>
  /^https?:\/\//i.test(u) || String(u).startsWith("data:");
const isImageUrl = (u = "") => /\.(png|jpe?g|gif|webp|bmp|svg)(\?|$)/i.test(u);
const isTextUrl = (u = "") => /\.txt(\?|$)/i.test(u);

/** 주어진 item에서 커버 이미지 선택: 없거나 .txt 뿐이면 빈 문자열 반환 */
const resolveCover = (item = {}) => {
  const candidates = [
    item.imageUrl, // 기존 필드
    item.thumbnailUrl, // 혹시 있을 수 있는 변형
    item.thumbnail_url,
    item.firstImageUrl,
    ...(Array.isArray(item.images) ? item.images : []),
    ...(Array.isArray(item.files)
      ? item.files
          .map((f) => f?.download_url || f?.url || f?.name)
          .filter(Boolean)
      : []),
  ].filter(Boolean);

  // 이미지 확장자만 고름
  let u = candidates.find((x) => isImageUrl(x));
  if (!u) return ""; // 이미지가 하나도 없으면 빈 값 → 로고 폴백

  if (!isAbs(u)) {
    const mediaish = String(u).replace(/^\/?media\/?/, "media/");
    u = addBase(mediaish);
  }
  return u;
};

/** 문자열 해시 → 숫자(항목별 고정 로고 선택용) */
const hashInt = (s = "") => {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) | 0;
  return Math.abs(h);
};

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

        // ✅ 더 이상 imageUrl 유무로 필터링하지 않음( .txt 만 있어도 로고 폴백)
        setItems(Array.isArray(items) ? items : []);
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

  // ✅ 커버 이미지 결정: 없으면 로고 3종 중 고정 랜덤
  const logos = [logo_blue, logo_nopo, logo];
  const rawId = String(
    cur.id ?? cur.outcomeId ?? cur.outcome_id ?? cur.title ?? ""
  );
  const cover = resolveCover(cur) || logos[hashInt(rawId) % logos.length];

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
          src={cover}
          alt={cur.title || "작업물"}
          loading="lazy"
          decoding="async"
          onError={(e) => {
            e.currentTarget.src = logos[hashInt(rawId) % logos.length];
          }}
        />
        <Gradient />
        <Meta>
          <Title>{cur.title || "작업물"}</Title>
          <Store>{cur.storeName || cur.store_name || ""}</Store>
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
