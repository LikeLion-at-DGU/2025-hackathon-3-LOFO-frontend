import * as S from "../Styled";
import PostGrid from "../../Home/components/Posts/PostGrid";
import PostCard from "../../Home/components/Posts/PostCard";
import { useMySavedActivity } from "../../../../hooks/useMySavedActivity";

export default function Activity() {
  const {
    loading,
    error,
    counts,
    savedRequests,
    likedOutcomes,
    isEmptySaved,
    isEmptyLiked,
  } = useMySavedActivity({ withCta: true });

  if (loading) return <S.Wrap>불러오는 중…</S.Wrap>;
  if (error) return <S.Wrap>{error}</S.Wrap>;

  return (
    <S.Wrap>
      {/* 찜한 요청 */}
      <S.Section>
        <S.SectionHead>
          <S.Title>찜한 요청</S.Title>
          <S.Count>{counts.saved}개</S.Count>
        </S.SectionHead>

        {isEmptySaved ? (
          <div>아직 찜한 요청이 없어요.</div>
        ) : (
          <S.CardPanel>
            <PostGrid
              items={savedRequests}
              renderItem={(item) => (
                <S.OverlayWrap key={item.id}>
                  {/* ✅ PostCard는 item prop을 기대 */}
                  <PostCard item={item} />
                  {item.__cta && (
                    <S.CTAOverlay>
                      <S.CTAButton
                        type="button"
                        onClick={() => console.log("미션 참여하기", item.id)}
                      >
                        미션 참여하기
                      </S.CTAButton>
                    </S.CTAOverlay>
                  )}
                </S.OverlayWrap>
              )}
            />
          </S.CardPanel>
        )}
      </S.Section>

      {/* 좋아요 누른 작품 */}
      <S.Section>
        <S.SectionHead>
          <S.Title>좋아요 누른 작품</S.Title>
          <S.Count>{counts.liked}개</S.Count>
        </S.SectionHead>

        {isEmptyLiked ? (
          <div>아직 좋아요한 작품이 없어요.</div>
        ) : (
          <S.CardPanel>
            <PostGrid
              items={likedOutcomes}
              renderItem={(item) => <PostCard key={item.id} item={item} />}
            />
          </S.CardPanel>
        )}
      </S.Section>
    </S.Wrap>
  );
}
