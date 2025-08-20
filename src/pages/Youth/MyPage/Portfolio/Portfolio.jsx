import styled from "styled-components";
import * as S from "../Styled.js";
import PostGrid from "../../Home/components/Posts/PostGrid.jsx";
import PostCard from "../../Home/components/Posts/PostGrid.jsx";

// ── 더미 데이터 (API 연동 시 교체)
const WISHLIST = [
  { id: 1, title: "일이삼사오육칠팔구십일이삼사오육", subtitle: "종무.노포", thumbnail:"https://images.unsplash.com/photo-1520697222861-6f5f21b6c8b0?q=80&w=1200&auto=format&fit=crop",
    cta: true, // ← 첫 카드 CTA 오버레이 표시
  },
  { id: 2, title: "일이삼사오육칠팔구십", subtitle: "종무.노포", thumbnail: "https://images.unsplash.com/photo-1520697222861-6f5f21b6c8b0?q=80&w=1200&auto=format&fit=crop" },
  { id: 3, title: "일이삼사오육칠팔", subtitle: "종무.노포", thumbnail: "https://images.unsplash.com/photo-1520697222861-6f5f21b6c8b0?q=80&w=1200&auto=format&fit=crop" },
];

const LIKED_WORKS = [
  { id: 11, title: "일이삼사오육칠팔구십", subtitle: "종무.노포", thumbnail: "https://images.unsplash.com/photo-1520697222861-6f5f21b6c8b0?q=80&w=1200&auto=format&fit=crop" },
  { id: 12, title: "일이삼사오육", subtitle: "종무.노포", thumbnail: "https://images.unsplash.com/photo-1520697222861-6f5f21b6c8b0?q=80&w=1200&auto=format&fit=crop" },
  { id: 13, title: "일이삼사오육칠", subtitle: "종무.노포", thumbnail: "https://images.unsplash.com/photo-1520697222861-6f5f21b6c8b0?q=80&w=1200&auto=format&fit=crop" },
];

export default function Portfolio() {
  return (
    <S.Wrap>
      {/* 찜한 요청 */}
      <S.Section>
        <S.CardPanel>
          <PostGrid
            items={WISHLIST}
            renderItem={(item) => (
              <OverlayWrap key={item.id}>
                <PostCard {...item} />
                {item.cta && (
                  <S.CTAOverlay>
                    <S.CTAButton
                      type="button"
                      onClick={() => console.log("미션 참여하기", item.id)}
                    >
                      미션 참여하기
                    </S.CTAButton>
                  </S.CTAOverlay>
                )}
              </OverlayWrap>
            )}
          />
        </S.CardPanel>
      </S.Section>
    </S.Wrap>
  );
}