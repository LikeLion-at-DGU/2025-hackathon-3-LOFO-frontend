import * as S from "./Styled";
import { YouthTopnav } from "../../../components/Topnav/YouthTopnav";
import Hero from "./components/Hero/Hero";
import PostGrid from "./components/Posts/PostGrid";
import BasicModal from "../Mission/components/BasicModal";
import FilterBar from "../../../components/FilterBar/FilterBar";

import { useMemo, useState } from "react";
import { usePosts } from "../../../hooks/usePosts";
import { useNavigate } from "react-router-dom";
import { getMyMission } from "../../../apis/youth_Mission";
import { toggleSaveMission } from "../../../apis/saveMission";
import { DEFAULT_CATEGORY_TABS, useCommunityFilter } from "../../../hooks/useCommunityFilter";

//import { UI_CATEGORIES } from "../../../apis/filters";
//import { useFilter } from "../../../hooks/useFilter";

const SORT_MAP_SERVER = {
  latest: "latest",   // 서버가 latest를 받도록 구현되어 있다면
  likes:  "popular",  // 서버는 popular로 받음
};

export default function YouthHome() {
  const navigate = useNavigate();
  const [activeModal, setActiveModal] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

    // ✅ 탭을 “코드 기반”으로 고정 (DEFAULT_CATEGORY_TABS 사용)
  const TABS = useMemo(() => {
    // 필요시 서버/UX에 따라 탭 구성 커스터마이징
    return DEFAULT_CATEGORY_TABS;
  }, []);


   // ✅ 커스텀 훅을 UI 상태 관리용으로만 사용
  const {
    activeTab,          // "ALL" | "SNS_IMAGE" | ...
    setActiveTab,
    sortKey,            // "latest" | "likes"
    setSortKey,
  } = useCommunityFilter({
    tabs: TABS,
    initialTab: "ALL",
    initialSort: "latest",
    items: [],          // 서버 필터 방식을 쓸 것이므로 여기선 의미 없음
  });


  // 서버 파라미터 계산
  const selectedCategoryCode = activeTab === "ALL" ? undefined : activeTab; // key가 코드
  const serverSort = SORT_MAP_SERVER[sortKey] ?? "latest";
  

  // 🔁 서버에서 필터/정렬/페이지네이션 처리
  const {
    items: rawItems,
    total,
    loading,
    error,
  } = usePosts({
    category: selectedCategoryCode, // 코드(없으면 파라미터 누락)
    sort: serverSort,               // "latest" | "popular" 등 서버 규격
    page: 1,
    pageSize: 12,
    refreshKey,
  });

  // ❤️ 낙관적 토글 상태
  const [likedSet, setLikedSet] = useState(() => {
    try { return new Set(JSON.parse(sessionStorage.getItem("likedIds") || "[]")); }
    catch { return new Set(); }
  });

  // 서버 is_saved + 클라 토글 상태 병합
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

  // 하트 토글
  async function handleToggleSave(it) {
    const id = it.id;

    // 낙관적 토글
    setLikedSet((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      sessionStorage.setItem("likedIds", JSON.stringify([...next]));
      return next;
    });

    try {
      await toggleSaveMission({ id, target: "request" });
      // 인기순이면 재조회(순서 변경 반영)
      if (serverSort === "popular") setRefreshKey((k) => k + 1);
    } catch (e) {
      // 실패 롤백
      setLikedSet((prev) => {
        const next = new Set(prev);
        next.has(id) ? next.delete(id) : next.add(id);
        sessionStorage.setItem("likedIds", JSON.stringify([...next]));
        return next;
      });
      alert("찜 처리 중 오류가 발생했어요. 다시 시도해 주세요.");
    }
  }

  // 참여 버튼
  const handleJoin = async (it) => {
    try {
      const my = await getMyMission();
      if (my?.exists) {
        setActiveModal(true);
        return;
      }
    } catch (e) {
      // 비로그인 등은 상세로 진행
    }
    navigate(`/youth/mission/${it.id}`);
  };

  return (
    <>
      <YouthTopnav />
      <S.Page>
        <S.HeroWrapper>
          <Hero onClickAIMission={() => {}} />

          {/* FilterBar 연결 */}
          <div style={{ padding: "0 20px", width: "100%" }}>
            <FilterBar
              tabs={TABS}
              activeTab={activeTab}
              onChangeTab={setActiveTab}
              sortKey={sortKey}
              onChangeSort={setSortKey}
              sortOpen={false}
              setSortOpen={() => {}}
              sortRef={null}
            />
          </div>
        </S.HeroWrapper>

        {loading && <S.ErrMsg>불러오는 중…</S.ErrMsg>}
        {error && <div>오류가 발생했어요. 새로고침 해주세요.</div>}

        {!loading && !error && items.length === 0 && (
          <S.ErrMsg>
            아직 상인의 요청이 없습니다. <br />AI가 추천하는 미션은 어떤가요?
          </S.ErrMsg>
        )}

        {!loading && !error && items.length > 0 && (
          <PostGrid
            items={items}
            onClickCard={() => {}}
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
