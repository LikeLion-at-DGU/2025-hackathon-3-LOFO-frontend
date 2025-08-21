import styled from "styled-components";

import {YouthTopnav} from "../../../components/Topnav/YouthTopnav";
import Hero from "./components/Hero/Hero";
import CategoryFilter from "./components/CategoryFilter/CategoryFilter";
import PostGrid from "./components/Posts/PostGrid";

import { useState, useEffect } from "react";
import { usePosts } from "./hooks/usePosts";

const Page = styled.main`
  width: 100%;
  max-width: 1120px; margin: 0 auto; padding: 0 20px 80px;
`;


const CATEGORIES = ["전체","홍보영상","포스터·전단","SNS 이미지","인테리어 제안","홍보기획","광고문구"];

export default function YouthHomeAI() {

  const [category, setCategory] = useState("전체");
  const { items, total, loading, error } = usePosts({ category });

  return (
  <>
    <YouthTopnav />
    <Page>
      <h1>이건 사실 YouthHomeAI</h1>
      <Hero onClickAIMission={() => {}} />
      <CategoryFilter
        categories={CATEGORIES}
        value={category}
        onChange={setCategory}
      />

      {loading && <div>불러오는 중…</div>}
      {error && <div>오류가 발생했어요. 새로고침 해주세요.</div>}

      {!loading && !error && items.length === 0 && (
        <div>게시글이 없어요.</div>
      )}

      {!loading && !error && items.length > 0 && (
        <PostGrid
          items={items}
          onClickCard={(it) => {
            // TODO: 상세 페이지로 이동
            console.log("카드 클릭:", it.id);
          }}
        />
      )}
    </Page>
  </>
);
}