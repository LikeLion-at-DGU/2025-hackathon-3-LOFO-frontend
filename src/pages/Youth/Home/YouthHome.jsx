// src/pages/Youth/Home/YouthHome.jsx
import * as S from "./Styled";

import { YouthTopnav } from "../../../components/Topnav/YouthTopnav";
import Hero from "./components/Hero/Hero";
import CategoryFilter from "./components/Filter/CategoryFilter";
import SortDropdown from "./components/Filter/SortDropdown";
import PostGrid from "./components/Posts/PostGrid";
import BasicModal from "../Mission/components/BasicModal";
import FilterBar from "../../../components/FilterBar/FilterBar";
import { useCommunityFilter } from "../../../hooks/useCommunityFilter";

import { useMemo, useState, useRef, useEffect } from "react";
import { usePosts } from "../../../hooks/usePosts";
import { useNavigate } from "react-router-dom";
import { toAbsUrl } from "../../../utils/url";
import { UI_CATEGORIES } from "../../../apis/filters";
import { toggleSaveMission } from "../../../apis/saveMission"; // ★ 하트 토글 API
import { getMyMission } from "../../../apis/youth_Mission";

const TABS = [
  { key: "ALL", label: "전체" },
  { key: "SNS_IMAGE", label: "SNS 이미지" },
  { key: "POSTER_FLYER", label: "포스터·전단" },
  { key: "PROMOTION_PLANNING", label: "홍보기획" },
  { key: "INTERIOR_PROPOSAL", label: "인테리어 제안" },
  { key: "AD_COPY", label: "광고문구" },
];
const SORT_MAP = {
  latest: "latest",
  likes: "popular",
};

export default function YouthHome() {
  const navigate = useNavigate();
  const [activeModal, setActiveModal] = useState(false);

  // 🔽 정렬 드롭다운 UI 열림 상태만 로컬로
  const [sortOpen, setSortOpen] = useState(false);
  const sortRef = useRef(null);

  // 🔽 훅으로 탭/정렬 상태 관리 (여기서는 필터링 결과는 쓰지 않음)
  const {
    activeTab,
    setActiveTab,
    sortKey,
    setSortKey,
  } = useCommunityFilter({
    items: [],              // 서버로 가져오므로 여기선 미사용
    tabs: TABS,
    initialTab: "ALL",
    initialSort: "latest",
  });

  // 서버 파라미터 상태
  const [category, setCategory] = useState("전체");
  const [sort, setSort] = useState("latest"); // 서버: 'latest' | 'popular'

  // 🔽 훅 상태 → 서버 파라미터로 동기화
  useEffect(() => {
    // 카테고리: 'ALL'이면 "전체", 아니면 그대로 서버 키 사용
    setCategory(activeTab === "ALL" ? "전체" : activeTab);

    // 정렬: likes → popular 로 변환
    setSort(SORT_MAP[sortKey] ?? "latest");
  }, [activeTab, sortKey]);

  // 이하 기존 코드 그대로…
  const [refreshKey, setRefreshKey] = useState(0);

  const [likedSet, setLikedSet] = useState(() => {
    try { return new Set(JSON.parse(sessionStorage.getItem("likedIds") || "[]")); }
    catch { return new Set(); }
  });

  const { items: rawItems, total, loading, error } =
    usePosts({ category, sort, page: 1, pageSize: 12, refreshKey });

  const items = useMemo(() => {
    return (rawItems || []).map((it) => {
      const serverLiked = !!(it.is_saved ?? it.savedByMe);
      const clientLiked = likedSet.has(it.id);
      const mergedLiked = serverLiked || clientLiked;

      const serverCnt =
        typeof it.savedCount === "number" ? it.savedCount :
        typeof it.saved_count === "number" ? it.saved_count : 0;

      const adjustedCnt =
        mergedLiked && !serverLiked ? serverCnt + 1 :
        (!mergedLiked && serverLiked ? Math.max(0, serverCnt - 1) : serverCnt);

      return {
        ...it,
        is_saved: mergedLiked,
        savedByMe: mergedLiked,
        savedCount: adjustedCnt,
        saved_count: adjustedCnt,
      };
    });
  }, [rawItems, likedSet]);

  async function handleToggleSave(it) {
    const id = it.id;

    setLikedSet((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      sessionStorage.setItem("likedIds", JSON.stringify([...next]));
      return next;
    });

    try {
      await toggleSaveMission({ id, target: "request" });
      if (sort === "popular") setRefreshKey((k) => k + 1); // 인기순이면 재조회
    } catch (e) {
      setLikedSet((prev) => {
        const next = new Set(prev);
        next.has(id) ? next.delete(id) : next.add(id);
        sessionStorage.setItem("likedIds", JSON.stringify([...next]));
        return next;
      });
      alert("찜 처리 중 오류가 발생했어요. 다시 시도해 주세요.");
    }
  }

  const handleJoin = async (it) => {
    // ... (기존 그대로)
  };

  // 바깥 클릭으로 정렬 드롭닫기 (선택)
  useEffect(() => {
    const onClick = (e) => {
      if (sortRef.current && !sortRef.current.contains(e.target))
        setSortOpen(false);
    };
    if (sortOpen) document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, [sortOpen]);

  return (
    <>
      <YouthTopnav />
      <S.Page>
        <S.HeroWrapper>
          <Hero onClickAIMission={() => {}} />

          {/* 🔽 기존 CategoryFilter/SortDropdown 대신 FilterBar로 교체 */}
          <S.FilterWrapper>
            <FilterBar
              tabs={TABS}
              activeTab={activeTab}
              onChangeTab={setActiveTab}
              sortKey={sortKey}                 // 'latest' | 'likes'
              onChangeSort={setSortKey}         // 훅 상태 변경
              sortOpen={sortOpen}
              setSortOpen={setSortOpen}
              sortRef={sortRef}
            />
          </S.FilterWrapper>
        </S.HeroWrapper>

        {loading && <div>불러오는 중…</div>}
        {error && <div>오류가 발생했어요. 새로고침 해주세요.</div>}
        {!loading && !error && items.length === 0 && <div>게시글이 없어요.</div>}

        {!loading && !error && items.length > 0 && (
          <PostGrid
            items={items}
            onClickCard={(it) => {}}
            onJoin={handleJoin}
            onToggleSave={handleToggleSave}
          />
        )}
      </S.Page>

      <BasicModal
        open={activeModal}
        title="이미 진행 중인 미션이 있습니다."
        desc={"현재 진행중인 미션에서 이어서 작업해주세요."}
        confirmText="미션으로 이동"
        onClose={() => setActiveModal(false)}
      />
    </>
  );
}
