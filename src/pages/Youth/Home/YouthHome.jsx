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
import { UI_CATEGORIES } from "../../../apis/filters";
import { useFilter } from "../../../hooks/useFilter";

export default function YouthHome() {
  const navigate = useNavigate();
  const [activeModal, setActiveModal] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  // 탭 데이터: UI_CATEGORIES가 ["전체","SNS 이미지",...] 형태라고 가정
  const TABS = useMemo(() => {
    const arr = (UI_CATEGORIES || []).map((label) => ({
      key: label === "전체" ? "ALL" : label, // 키는 자유, 라벨은 서버 매핑에 사용
      label,
    }));
    // 혹시 "전체"가 없다면 강제로 앞에 추가
    if (!arr.find((t) => t.label === "전체")) {
      arr.unshift({ key: "ALL", label: "전체" });
    }
    return arr;
  }, []);

  // 커스텀 훅: UI 상태 + 서버 정렬키 매핑 제공
  const {
    activeTab,
    onChangeTab,
    sortKey,          // "latest" | "likes" (UI)
    onChangeSort,
    sortOpen,
    setSortOpen,
    sortRef,

    serverSort,       // "latest" | "popular" (서버)
    activeTabLabel,   // "전체" | "SNS 이미지" ...
  } = useFilter({
    tabs: TABS,
    initialTabKey: "ALL",
    initialSort: "latest",
  });

  // 서버에서 받은 원본 리스트
  const {
    items: rawItems,
    total,
    loading,
    error,
  } = usePosts({
    category: activeTabLabel,      // 한국어 라벨 → 내부에서 enum으로 매핑
    sort: serverSort,              // likes→popular 변환된 값
    page: 1,
    pageSize: 12,
    refreshKey,
  });

  // 내가 방금 누른 하트(아이디) 기억
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

          {/* ✅ FilterBar로 교체 */}
          <div style={{ padding: "0 20px", width: "100%" }}>
            <FilterBar
              tabs={TABS}
              activeTab={activeTab}
              onChangeTab={onChangeTab}
              sortKey={sortKey}                // "latest" | "likes" (UI)
              onChangeSort={onChangeSort}
              sortOpen={sortOpen}
              setSortOpen={setSortOpen}
              sortRef={sortRef}
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
