// src/pages/Youth/Home/YouthHome.jsx
import * as S from "./Styled";

import { YouthTopnav } from "../../../components/Topnav/YouthTopnav";
import Hero from "./components/Hero/Hero";
import CategoryFilter from "./components/Filter/CategoryFilter";
import SortDropdown from "./components/Filter/SortDropdown";
import PostGrid from "./components/Posts/PostGrid";

import { useMemo, useState } from "react";
import { usePosts } from "../../../hooks/usePosts";
import { useNavigate } from "react-router-dom";
import { toAbsUrl } from "../../../utils/url";
import { UI_CATEGORIES } from "../../../apis/filters";
import { toggleSaveMission } from "../../../apis/saveMission"; // ★ 하트 토글 API

export default function YouthHome() {
  const navigate = useNavigate();
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

  const handleJoin = (it) => {
    const shop = {
      id: it.id,
      name: it.store_name ?? it.storeName ?? it.title ?? it.name ?? it.store?.name ?? "(이름 없음)",
      imageUrl: toAbsUrl(it.image ?? it.thumbnail_url ?? it.thumbnailUrl ?? it.thumb ?? ""),
      naverUrl: it.url ?? it.naver_url ?? it.link ?? "#",
      request: it.content ?? it.request ?? it.description ?? "",
      category: it.category ?? it.category_display,
    };
    sessionStorage.setItem("lastShop", JSON.stringify(shop));
    navigate("/youth/mission", { state: { shop } });
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
    </>
  );
}
