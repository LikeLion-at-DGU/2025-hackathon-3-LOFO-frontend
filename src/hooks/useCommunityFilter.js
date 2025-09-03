// hooks/useCommunityFilter.js
import { useEffect, useRef, useState } from "react";

export const DEFAULT_CATEGORY_TABS = [
  { key: "ALL", label: "전체" },
  { key: "POSTER_FLYER", label: "포스터·전단" },
  { key: "SNS_IMAGE", label: "SNS 이미지" },
  { key: "INTERIOR_PROPOSAL", label: "인테리어 제안" },
  { key: "PROMOTION_PLAN", label: "홍보기획" },       // ← ★ 백엔드 enum 확인: PLAN 권장
  { key: "AD_COPY", label: "광고문구" },
];

export function useCommunityFilter({
  tabs = DEFAULT_CATEGORY_TABS,
  initialTab = "ALL",
  initialSort = "latest", // 'latest' | 'likes'
} = {}) {
  const [activeTab, setActiveTab] = useState(initialTab);
  const [sortKey, setSortKey] = useState(initialSort);

  // 드롭다운 열림/닫힘 제어
  const [sortOpen, setSortOpen] = useState(false);
  const sortRef = useRef(null);

  useEffect(() => {
    if (!sortOpen) return;
    const onPointerDown = (e) => {
      const el = sortRef.current;
      if (el && !el.contains(e.target)) setSortOpen(false);
    };
    document.addEventListener("pointerdown", onPointerDown, { capture: true });
    return () =>
      document.removeEventListener("pointerdown", onPointerDown, { capture: true });
  }, [sortOpen]);

  useEffect(() => {
    if (!sortOpen) return;
    const onKey = (e) => e.key === "Escape" && setSortOpen(false);
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [sortOpen]);

  return {
    tabs,
    activeTab, setActiveTab,
    sortKey, setSortKey,
    sortOpen, setSortOpen, sortRef,
  };
}
