// src/pages/Youth/Home/YouthHome.jsx
import * as S from "./Styled";

import { YouthTopnav } from "../../../components/Topnav/YouthTopnav";
import Hero from "./components/Hero/Hero";
import CategoryFilter from "./components/Filter/CategoryFilter";
import SortDropdown from "./components/Filter/SortDropdown";
import PostGrid from "./components/Posts/PostGrid";
import BasicModal from "../Mission/components/BasicModal";

import { useMemo, useState } from "react";
import { usePosts } from "../../../hooks/usePosts";
import { useNavigate } from "react-router-dom";
import { toAbsUrl } from "../../../utils/url";
import { UI_CATEGORIES } from "../../../apis/filters";
import { toggleSaveMission } from "../../../apis/saveMission"; // ★ 하트 토글 API
import { getMyMission } from "../../../apis/youth_Mission";

export default function YouthHome() {
  const navigate = useNavigate();
  const [activeModal, setActiveModal] = useState(false);
  
  const [category, setCategory] = useState("전체");
  const [sort, setSort] = useState("latest"); // "latest" | "popular"
  const [refreshKey, setRefreshKey] = useState(0);
  const CATEGORIES = UI_CATEGORIES;

  // 내가 방금 누른 하트(아이디 집합)를 기억 → 필터/정렬 바뀌어도 유지
  const [likedSet, setLikedSet] = useState(() => {
    try { return new Set(JSON.parse(sessionStorage.getItem("likedIds") || "[]")); }
    catch { return new Set(); }
  });

  // 서버에서 받은 원본 리스트
  const { items: rawItems, total, loading, error } =
    usePosts({ category, sort, page: 1, pageSize: 12, refreshKey });

  // 서버 is_saved 와 내가 방금 누른 likedSet 을 합쳐서 카드에 내려줄 최종 리스트
  const items = useMemo(() => {
    return (rawItems || []).map((it) => {
      const serverLiked = !!(it.is_saved ?? it.savedByMe);
      const clientLiked = likedSet.has(it.id);
      const mergedLiked = serverLiked || clientLiked;

      const serverCnt = (typeof it.savedCount === "number" ? it.savedCount :
                        typeof it.saved_count === "number" ? it.saved_count : 0);

      // 서버가 즉시 반영 못해줄 때 시각적으로 맞추는 보정
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

  // 하트 클릭 핸들러(상위에서 단일 관리)
  async function handleToggleSave(it) {
    const id = it.id;

    // 낙관적 토글: 집합 업데이트 + 세션 보관
    setLikedSet((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      sessionStorage.setItem("likedIds", JSON.stringify([...next]));
      return next;
    });

    try {
      // 상인요청 목록이므로 request_id 전송 (AI 미션이면 target: "mission")
      await toggleSaveMission({ id, target: "request" });

      // 인기순 화면이면 좋아요 수 변화로 순서가 바뀌므로 재조회
      if (sort === "popular") setRefreshKey((k) => k + 1);
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

    const handleJoin = async (it) => {
      console.log("[handleJoin] start", it?.id);
    try {
      // 토큰 유무와 상관없이 호출 → 401이면 catch로 이동
        const my = await getMyMission();
        console.log("[mymission]", my); 
        if (my?.exists) {
          console.log("진행중 미션 존재 → 모달 오픈");
          setActiveModal(true);       // ← 모달 오픈
          return;         
        }            // 상세로 가지 않음
    } catch (e) {
      const status = e?.response?.status;
      console.log("getMyMission 실패", status, e?.message);
      // 401(비로그인) 등은 상세 페이지로 그냥 진행
    }

    console.log("[handleJoin] go detail");
    navigate(`/youth/mission/${it.id}`);  // 참여중 아님 → 상세로
  };


  return (
    <>
      <YouthTopnav />
      <S.Page>
        <S.HeroWrapper>
          <Hero onClickAIMission={() => {}} />
          <S.FilterWrapper>
            <CategoryFilter
              categories={CATEGORIES}
              value={category}
              onChange={setCategory}
            />
            <SortDropdown
              value={sort}
              onChange={(v) => { console.log("[sort]", v); setSort(v); }}
            />
          </S.FilterWrapper>
        </S.HeroWrapper>

        {loading && <div>불러오는 중…</div>}
        {error && <div>오류가 발생했어요. 새로고침 해주세요.</div>}

        {!loading && !error && items.length === 0 && <div>게시글이 없어요.</div>}

        {!loading && !error && items.length > 0 && (
          <PostGrid
            items={items}
            onClickCard={(it) => { /* 필요 시 상세 이동 */ }}
            onJoin={handleJoin}
            onToggleSave={handleToggleSave}  // ★ 카드의 하트 클릭을 상위로
          />
        )}
      </S.Page>
      
      {/* 진행중 미션 가드 모달 */}
      <BasicModal
        open={ activeModal }
        title="이미 진행 중인 미션이 있습니다."
        desc={"현재 진행중인 미션에서 이어서 작업해주세요."}
        confirmText="미션으로 이동"
        onClose={() => setActiveModal(false)}
      />
    </>
  );
}
