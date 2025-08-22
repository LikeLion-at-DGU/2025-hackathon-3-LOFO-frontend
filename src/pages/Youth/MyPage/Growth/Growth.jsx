import * as S from "../Styled.js";
import { ProfileCard } from "./components/ProfileCard.jsx";
import { FeedbackList } from "./components/FeedbackList.jsx";
import { LofoPickSection } from "./components/LofoPickSection.jsx";
import EmptyState from "../components/EmptyState.jsx";
import { useGrowthInsights } from "../../../../hooks/useGrowthInsights.js";

/*
const FEEDBACKS = [];     // []면 빈 상태
const PICKS = [];         // []면 빈 상태


// ── 예시 데이터 (API로 대체 가능)
const MOCK_FEEDBACKS = [
  { id: 1, text: "정말 좋네요!" },
  { id: 2, text: "정말 좋네요!" },
  { id: 3, text: "정말 좋네요!" },
];

const MOCK_PICKS = [
  {
    id: 1,
    title: "SNS 이미지",
    subtitle: "종무노포",
    thumbnail:
      "https://images.unsplash.com/photo-1520697222861-6f5f21b6c8b0?q=80&w=1200&auto=format&fit=crop",
  },
  {
    id: 2,
    title: "SNS 이미지",
    subtitle: "종무노포",
    thumbnail:
      "https://images.unsplash.com/photo-1520697222861-6f5f21b6c8b0?q=80&w=1200&auto=format&fit=crop",
  },
];*/

export default function Growth() {
  const { loading, error, profile, feedbacks, picks, counts } = useGrowthInsights();
  
  return (
    <S.GrowthWrap>
      <S.Grid>
        <S.Aside>
          <ProfileCard
            name={profile?.name ?? "로포"}
            phone={profile?.phone ?? ""}
            stats={profile?.stats ?? { completed: 0, inProgress: 0, picks: 0, total: 0 }}
          />
        </S.Aside>

        <S.Main>

          {error && <div style={{ color: "#d00", marginBottom: 12 }}>{error}</div>}

          {/* 내가 받은 피드백 */}
          <S.GrowthSection>
            <S.GrowthSectionHead>
              <S.Title>내가 받은 피드백</S.Title>
              <S.Count>{counts.feedbacks}개</S.Count>
            </S.GrowthSectionHead>

            {loading ? (
              <div style={{ opacity: 0.6 }}>불러오는 중…</div>
            ) : counts.feedbacks > 0 ? (
              <FeedbackList items={feedbacks} />
            ) : (
              <EmptyState
                title="아직 받은 피드백이 없어요!"
                description="첫 미션에 도전해보세요"
                actionLabel="미션 하러가기"
                onAction={() => console.log("미션 페이지로 이동")}
                align="right"
              />
            )}
          </S.GrowthSection>

          {/* LOFO PICK 작품 */}
          <S.GrowthSection>
            <S.GrowthSectionHead>
              <S.Title>LOFO PICK 작품</S.Title>
              <S.Count>{counts.picks}개</S.Count>
            </S.GrowthSectionHead>

            {loading ? (
              <div style={{ opacity: 0.6 }}>불러오는 중…</div>
            ) : counts.picks > 0 ? (
              <LofoPickSection posts={picks} />
            ) : (
              <EmptyState
                title="아직 PICK된 작품이 없어요!"
                description="첫 미션을 완료하고 작품을 올려보세요"
                actionLabel="미션 하러가기"
                onAction={() => console.log("미션 페이지로 이동")}
                align="right"
              />
            )}
          </S.GrowthSection>
        </S.Main>
      </S.Grid>
    </S.GrowthWrap>
  );
}