import styled from "styled-components";
import { ProfileCard } from "./components/ProfileCard.jsx";
import { FeedbackList } from "./components/FeedbackList.jsx";
import { LofoPickSection } from "./components/LofoPickSection.jsx";
import EmptyState from "./EmptyState.jsx";


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
    <Wrap>
      <Grid>
        <Aside>
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
        </Aside>

        <Main>

          {/* 내가 받은 피드백 */}
          <Section>
            <SectionHead>
              <Title>내가 받은 피드백</Title>
              <Count>{MOCK_FEEDBACKS.length}개</Count>
            </SectionHead>

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
          </Section>

          {/* LOFO PICK 작품 */}
          <Section>
            <SectionHead>
              <Title>LOFO PICK 작품</Title>
              <Count>{MOCK_PICKS.length}개</Count>
            </SectionHead>

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
          </Section>
        </Main>
      </Grid>
    </Wrap>
  );
}

const Wrap = styled.div`
  padding: 0 0 80px;
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: 280px 1fr;
  gap: 24px;

  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
  }
`;

const Aside = styled.aside`
  position: sticky;
  top: 88px; /* Topnav 높이에 맞춰 조절 */
  align-self: start;
`;

const Main = styled.div`
  display: flex;
  flex-direction: column;
  gap: 32px;
`;

const Section = styled.section`
  background: transparent;
`;

const SectionHead = styled.div`
  display: flex;
  align-items: flex-end;
  gap: 12px;
  border-bottom: 1px solid #e5e7eb;
  padding-bottom: 10px;
  margin-bottom: 16px;
`;

const Title = styled.h3`
  font-size: 18px;
  font-weight: 700;
  color: #111827;
`;

const Count = styled.span`
  margin-left: auto;
  font-size: 14px;
  color: #6b7280;
`;
