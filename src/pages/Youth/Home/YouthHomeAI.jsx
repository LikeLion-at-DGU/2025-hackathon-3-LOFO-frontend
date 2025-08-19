import styled from "styled-components";
import {YouthTopnav} from "../../../components/Topnav/YouthTopnav";
import Hero from "./components/Hero/Hero";
import CategoryFilter from "./components/CategoryFilter/CategoryFilter";
import PostGrid from "./components/Posts/PostGrid";
import { useState, useEffect } from "react";
import { usePosts } from "./hooks/usePosts";
import axios from "axios";

const Page = styled.main`
  width: 100%;
  max-width: 1120px; margin: 0 auto; padding: 0 20px 80px;
`;


const CATEGORIES = ["전체","홍보영상","포스터·전단","SNS 이미지","인테리어 제안","홍보기획","광고문구"];

export default function YouthHomeAI() {
  const [category, setCategory] = useState("전체");
  const { items, total, loading, error } = usePosts({ category });

  const [posts, setPosts] = useState([]);
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/boards`); //응답을 정의
        console.log("✨메인페이지 응답 데이터 구조:", response); //응답 데이터 구조 콘솔 확인
        setPosts(response.data); //받아온 데이터 화면에 보이도록(콘솔로 확인한 응답 구조 확인 후 알 수 있는 정보!! response에서 data라는 객체를 가져옴)
      } catch (err) {//에러
        console.error("API 호출 에러:", err);
      }
    };
    fetchPosts();
  }, []);

  return (
    <>
      <YouthTopnav />
      <Page>
        <h1>이건 사실 YouthHomeAI</h1>
        <Hero onClickAIMission={() => {/* TODO: 라우팅 or 모달 */}} />
        <CategoryFilter categories={CATEGORIES} value={category} onChange={setCategory} />

        {loading && <div>불러오는 중…</div>}
        {error && <div>오류가 발생했어요. 새로고침 해주세요.</div>}
        {!loading && !error && <PostGrid items={items} onClickCard={(it)=>{/* TODO: 상세로 */}} />}
        {/* 필요하면 페이지네이션 자리 */}
      </Page>
    </>
  );
}