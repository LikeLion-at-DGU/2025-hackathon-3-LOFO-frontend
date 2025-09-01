import { useEffect, useMemo, useRef, useState } from "react";

export const DEFAULT_CATEGORY_TABS = [
  { key: "ALL", label: "전체" },
  { key: "POSTER_FLYER", label: "포스터·전단" },
  { key: "SNS_IMAGE", label: "SNS 이미지" },
  { key: "INTERIOR_PROPOSAL", label: "인테리어 제안" },
  { key: "PROMOTION_PLANNING", label: "홍보기획" },
  { key: "AD_COPY", label: "광고문구" },
];

/** 카테고리/정렬 상태와 결과 리스트를 제공하는 훅 */
export function useCommunityFilter({
  items = [],
  tabs = DEFAULT_CATEGORY_TABS,
  initialTab = "ALL",
  initialSort = "latest", // 'latest' | 'likes'
  // (선택) 아이템에서 카테고리 읽는 방법을 커스터마이즈하고 싶을 때
  getItemCategory = (x) => x?.category ?? x?.categoryLabel,
} = {}) {
  const [activeTab, setActiveTab] = useState(initialTab);
  const [sortKey, setSortKey] = useState(initialSort);

  // ▼ 드롭다운: 열림 상태 + ref + 바깥 클릭 닫기
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
  // ESC로 닫기 (선택)
  useEffect(() => {
    if (!sortOpen) return;
    const onKey = (e) => e.key === "Escape" && setSortOpen(false);
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [sortOpen]);

  // 카테고리 필터링
  const filtered = useMemo(() => {
    if (activeTab === "ALL") return items;

    // key 또는 label 둘 다 대응
    const activeLabel = tabs.find((t) => t.key === activeTab)?.label;
    return items.filter((x) => {
      const catKey = String(getItemCategory(x) || "").toUpperCase();
      const catLabel = x.categoryLabel ?? x.category_display;
      return catKey === activeTab || catLabel === activeLabel;
    });
  }, [items, activeTab, tabs, getItemCategory]);

  // 정렬
  const filteredSorted = useMemo(() => {
    const arr = [...filtered];
    if (sortKey === "likes") {
      arr.sort(
        (a, b) =>
          (b.savedCount ?? b.saved_count ?? 0) -
          (a.savedCount ?? a.saved_count ?? 0)
      );
      return arr;
    }

    // latest: createdAt desc → fallback id desc
    const time = (x) => {
      const t = Date.parse(x.createdAt || x.created_at || "");
      return Number.isFinite(t) ? t : 0;
    };
    arr.sort((a, b) => {
      const tb = time(b) - time(a);
      if (tb !== 0) return tb;
      return (b.id ?? 0) - (a.id ?? 0);
    });
    return arr;
  }, [filtered, sortKey]);

  return {
    activeTab,
    setActiveTab,
    sortKey,
    setSortKey,
    // ▼ 드롭다운 제어자를 외부(UI)에 노출
    sortOpen,
    setSortOpen,
    sortRef,
    filtered,
    filteredSorted,
    tabs,
  };
}
