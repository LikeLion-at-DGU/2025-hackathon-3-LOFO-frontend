import * as S from "../Styled.js";
import { ProfileCard } from "./components/ProfileCard.jsx";
import { FeedbackList } from "./components/FeedbackList.jsx";
import { LofoPickSection } from "./components/LofoPickSection.jsx";
import EmptyState from "../components/EmptyState.jsx";
import { useGrowthInsights } from "../../../../hooks/useGrowthInsights.js";


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
            <S.GrowthSectionBody>
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
            </S.GrowthSectionBody>
          </S.GrowthSection>

          {/* LOFO PICK 작품 */}
          <S.GrowthSection>
            <S.GrowthSectionHead>
              <S.Title>LOFO PICK 작품</S.Title>
              <S.Count>{counts.picks}개</S.Count>
            </S.GrowthSectionHead>
            <S.GrowthSectionBody>
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
            </S.GrowthSectionBody>
          </S.GrowthSection>
        </S.Main>
      </S.Grid>
    </S.GrowthWrap>
  );
}