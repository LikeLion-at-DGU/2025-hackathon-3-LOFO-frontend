import { useMemo, useState } from "react";

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
} = {}) {
  const [activeTab, setActiveTab] = useState(initialTab);
  const [sortKey, setSortKey] = useState(initialSort);

  // 카테고리 필터링
  const filtered = useMemo(() => {
    if (activeTab === "ALL") return items;

    // key 또는 label 둘 다 대응
    const activeLabel = tabs.find((t) => t.key === activeTab)?.label;
    return items.filter((x) => {
      const catKey = String(x.category || "").toUpperCase();
      const catLabel = x.categoryLabel;
      return catKey === activeTab || catLabel === activeLabel;
    });
  }, [items, activeTab, tabs]);

  // 정렬
  const filteredSorted = useMemo(() => {
    const arr = [...filtered];
    if (sortKey === "likes") {
      arr.sort((a, b) => (b.savedCount ?? 0) - (a.savedCount ?? 0));
      return arr;
    }

    // latest: createdAt desc → fallback id desc
    const time = (x) => {
      const t = Date.parse(x.createdAt || "");
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
    filtered,
    filteredSorted,
    tabs,
  };
}
