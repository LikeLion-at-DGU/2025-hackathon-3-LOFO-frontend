import * as S from "../Styled.js";
import { ProfileCard } from "./components/ProfileCard.jsx";
import { FeedbackList } from "./components/FeedbackList.jsx";
import { LofoPickSection } from "./components/LofoPickSection.jsx";
import EmptyState from "../components/EmptyState.jsx";


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
];

export default function Growth() {
  return (
    <S.GrowthWrap>
      <S.Grid>
        <S.Aside>
          <ProfileCard
            name="김로포"
            phone="01012345678"
            stats={{
              completed: 0,
              inProgress: 0,
              picks: 0,
              total: 0,
            }}
          />
        </S.Aside>

        <S.Main>

          {/* 내가 받은 피드백 */}
          <S.GrowthSection>
            <S.GrowthSectionHead>
              <S.Title>내가 받은 피드백</S.Title>
              <S.Count>{MOCK_FEEDBACKS.length}개</S.Count>
            </S.GrowthSectionHead>

            {FEEDBACKS.length > 0 ? (
              <FeedbackList items={FEEDBACKS} />
            ) : (
              <EmptyState
                title="아직 받은 피드백이 없어요!"
                description="첫 미션에 도전해보세요"
                actionLabel="미션 하러가기"
                onAction={() => console.log("미션 페이지로 이동")}
                align="right"
              />
            )}
            <FeedbackList items={MOCK_FEEDBACKS} />
          </S.GrowthSection>

          {/* LOFO PICK 작품 */}
          <S.GrowthSection>
            <S.GrowthSectionHead>
              <S.Title>LOFO PICK 작품</S.Title>
              <S.Count>{MOCK_PICKS.length}개</S.Count>
            </S.GrowthSectionHead>

            {PICKS.length > 0 ? (
            <LofoPickSection posts={MOCK_PICKS} />
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