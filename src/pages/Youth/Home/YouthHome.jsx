import * as S from "./Styled";

import {YouthTopnav} from "../../../components/Topnav/YouthTopnav";
import Hero from "./components/Hero/Hero";
import CategoryFilter from "./components/Filter/CategoryFilter";
import SortDropdown from "./components/Filter/SortDropdown";
import PostGrid from "./components/Posts/PostGrid";
import { PostGridSection } from "./components/Posts/PostGridSection";

import { useMemo, useState, useEffect } from "react";
import { usePosts } from "../../../hooks/usePosts";
import { useNavigate } from "react-router-dom";
import { toAbsUrl } from "../../../utils/url";
import { UI_CATEGORIES } from "../../../apis/filters";


export default function YouthHome() {
  const navigate = useNavigate(); 
  const [category, setCategory] = useState("전체");
  const [sort, setSort] = useState("latest"); // "latest" | "popular"
  const { items, total, loading, error } = usePosts({ category, sort });
  const CATEGORIES = UI_CATEGORIES;

  const handleJoin = (it) => {
  const shop = {
    id: it.id,
    // 가게 이름: snake → camel → title → name → 중첩객체(store?.name)까지 커버
    name:
      it.store_name ??
      it.storeName ??
      it.title ??
      it.name ??
      it.store?.name ??
      "(이름 없음)",

    // 이미지: image → thumbnail_url → thumbnailUrl → thumb … 등 커버
    imageUrl: toAbsUrl(
      it.image ??
      it.thumbnail_url ??
      it.thumbnailUrl ??
      it.thumb ??
      ""
    ),

    // 외부 링크(네이버 등)
    naverUrl: it.url ?? it.naver_url ?? it.link ?? "#",

    // 상인 요청 본문
    request: it.content ?? it.request ?? it.description ?? "",
    category: it.category ?? it.category_display,
  };

  console.log("[JOIN item]", it);
  console.log("[JOIN shop sending]", shop);

  sessionStorage.setItem("lastShop", JSON.stringify(shop)); // 새로고침 대비
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
          <SortDropdown value={sort} onChange={setSort} />
        </S.FilterWrapper>
      </S.HeroWrapper>

      {loading && <div>불러오는 중…</div>}
      {error && <div>오류가 발생했어요. 새로고침 해주세요.</div>}

      {!loading && !error && items.length === 0 && (
        <div>게시글이 없어요.</div>
      )}

      {!loading && !error && items.length > 0 && (
        <PostGrid
          items={items}
          onClickCard={(it) => {
          console.log("카드 클릭:", it.id);
          console.log("[item]", it);


        // 로그로 shop 형태도 확인하고 싶으면:
        const shop = {
          id: it.id,
          name: it.store_name,
          imageUrl: toAbsUrl(it.image),
          naverUrl: it.url,
          request: it.content,
          category: it.category,
        };
        console.log("[shop sending]", shop);
        // 상세로 갈 거면 여기서 navigate, 미션페이지로 곧장 보낼 거면 handleJoin 호출
        // navigate(`/youth/mission/${shop.id}`);
        // 또는
        // handleJoin(it);
        }}
        onJoin={handleJoin}
        />
      
      )}
    </S.Page>
  </>
);
}