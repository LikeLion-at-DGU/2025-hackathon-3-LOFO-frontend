import { useEffect, useMemo, useRef, useState } from "react";

/**
 * @param {Object} opts
 * @param {Array<{key:string,label:string}>} opts.tabs - 탭 목록 (예: [{key:"ALL",label:"전체"}, ...])
 * @param {"latest"|"likes"} [opts.initialSort="latest"]
 * @param {string} [opts.initialTabKey="ALL"]
 * @param {Array<any>} [opts.items] - (선택) 클라이언트 사이드 필터/정렬용 원본 리스트
 * @param {(item:any)=>string} [opts.getItemCategory] - (선택) 아이템에서 카테고리 키/라벨 꺼내는 함수
 * @returns 상태 + UI/서버 연동용 도우미
 */
export function useFilter({
  tabs = [],
  initialSort = "latest",
  initialTabKey = "ALL",
  items,
  getItemCategory = (x) => x?.category ?? x?.categoryLabel,
} = {}) {
  const [activeTab, setActiveTab] = useState(initialTabKey);
  const [sortKey, setSortKey] = useState(initialSort); // "latest" | "likes"

  const [sortOpen, setSortOpen] = useState(false);
  const sortRef = useRef(null);

  // 드롭다운 외부 클릭 닫기
  useEffect(() => {
    const onClick = (e) => {
      if (sortRef.current && !sortRef.current.contains(e.target)) {
        setSortOpen(false);
      }
    };
    if (sortOpen) document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, [sortOpen]);

  const onChangeTab = (key) => setActiveTab(key);
  const onChangeSort = (key) => setSortKey(key);

  // UI → 서버 정렬키 변환: likes → popular
  const serverSort = sortKey === "likes" ? "popular" : "latest";

  // 탭 객체 빠르게 찾기
  const tabMap = useMemo(() => {
    const m = new Map();
    for (const t of tabs) m.set(t.key, t);
    return m;
  }, [tabs]);

  const activeTabLabel = tabMap.get(activeTab)?.label ?? activeTab;

  // (선택) 클라이언트 사이드 필터/정렬
  const filtered = useMemo(() => {
    if (!items) return undefined;
    if (activeTab === "ALL" || activeTabLabel === "전체") return items;
    return items.filter((it) => {
      const v = (getItemCategory(it) ?? "").toString().toUpperCase();
      return v === activeTab || v === activeTabLabel.toUpperCase();
    });
  }, [items, activeTab, activeTabLabel, getItemCategory]);

  const filteredSorted = useMemo(() => {
    if (!filtered) return undefined;
    const arr = [...filtered];
    if (sortKey === "likes") {
      arr.sort(
        (a, b) =>
          (b.savedCount ?? b.saved_count ?? 0) -
          (a.savedCount ?? a.saved_count ?? 0)
      );
    } else {
      const time = (x) => {
        const t = Date.parse(x?.createdAt || x?.created_at || "");
        return Number.isFinite(t) ? t : 0;
      };
      arr.sort((a, b) => {
        const dt = time(b) - time(a);
        if (dt !== 0) return dt;
        return (b.id ?? 0) - (a.id ?? 0);
      });
    }
    return arr;
  }, [filtered, sortKey]);

  return {
    // UI 바인딩용
    activeTab,
    onChangeTab,
    sortKey, // "latest" | "likes"
    onChangeSort,
    sortOpen,
    setSortOpen,
    sortRef,

    // 서버 연동용
    serverSort,        // "latest" | "popular"
    activeTabLabel,    // "전체" | "SNS 이미지" ...

    // (선택) 클라측 결과
    filtered,
    filteredSorted,
  };
}
