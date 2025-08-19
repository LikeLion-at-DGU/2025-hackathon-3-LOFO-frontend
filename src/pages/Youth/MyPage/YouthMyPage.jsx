// src/pages/mypage/MyPageYouth.jsx
import { useMemo, useState } from "react";
import styled from "styled-components";
import { YouthTopnav as Topnav } from "../../../components/Topnav/YouthTopnav";
import { BannerTabs } from "./components/BannerTabs";
import { RecommendCTA } from "./components/RecommendCTA";
import { PostGridSection } from "./components/PostGridSection";
import Growth from "./Growth/Growth"
import Activity from "./Activity/Activity";

// 예시 데이터
const MOCK_POSTS = Array.from({ length: 6 }).map((_, i) => ({
  id: i + 1,
  title: "SNS 이미지",
  subtitle: "종무노포",
  thumbnail:
    "https://images.unsplash.com/photo-1520697222861-6f5f21b6c8b0?q=80&w=1200&auto=format&fit=crop",
}));

export default function YouthMyPage() {
  const [active, setActive] = useState("portfolio");
  const posts = useMemo(() => MOCK_POSTS, []);

  return (
    <PageWrap>
      <Topnav />

      <Content>
        <HeaderRow>
          <BannerTabs value={active} onChange={setActive} />
        </HeaderRow>
        <RecommendCTA onClick={() => console.log("추천 요청")} />

        {active === "portfolio" && <PostGridSection posts={posts} />}
        {active === "growth" && (
          <Growth />
        )}
        {active === "activity" && (
          <Activity />
        )}
      </Content>
    </PageWrap>
  );
}

const PageWrap = styled.div`
  min-height: 100vh;
  background: #f9fafb;
  margin-top: 100px; /*임시*/
`;

const Content = styled.main`
  max-width: 1120px;
  margin: 0 auto;
  padding: 24px 24px 80px;
`;

const HeaderRow = styled.div`
  display: grid;
  grid-template-columns: 1fr auto;
  gap: 16px;
  align-items: end;
  margin-top: 12px;
  margin-bottom: 24px;
  border-bottom: 1px solid #e5e7eb;
  padding-bottom: 8px;
`;

const Placeholder = styled.div`
  height: 360px;
  border-radius: 16px;
  background: white;
  display: grid;
  place-items: center;
  color: #6b7280;
  font-size: 15px;
  border: 1px solid #eef2f7;
`;
