import styled from "styled-components";
// 네 폴더트리 기준 (MyPage → Home)
import PostGrid from "../../Home/components/Posts/PostGrid.jsx";
import PostCard from "../../Home/components/Posts/PostGrid.jsx";

// ── 더미 데이터 (API 연동 시 교체)
const WISHLIST = [
  {
    id: 1,
    title: "일이삼사오육칠팔구십일이삼사오육",
    subtitle: "종무.노포",
    thumbnail:
      "https://images.unsplash.com/photo-1520697222861-6f5f21b6c8b0?q=80&w=1200&auto=format&fit=crop",
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

export default function Activity() {
  return (
    <Wrap>
      {/* 찜한 요청 */}
      <Section>
        <SectionHead>
          <Title>찜한 요청</Title>
          <Count>{WISHLIST.length}개</Count>
        </SectionHead>

        <CardPanel>
          <PostGrid
            items={WISHLIST}
            renderItem={(item) => (
              <OverlayWrap key={item.id}>
                <PostCard {...item} />
                {item.cta && (
                  <CTAOverlay>
                    <CTAButton
                      type="button"
                      onClick={() => console.log("미션 참여하기", item.id)}
                    >
                      미션 참여하기
                    </CTAButton>
                  </CTAOverlay>
                )}
              </OverlayWrap>
            )}
          />
        </CardPanel>
      </Section>

      {/* 좋아요 누른 작품 */}
      <Section>
        <SectionHead>
          <Title>좋아요 누른 작품</Title>
          <Count>{LIKED_WORKS.length}개</Count>
        </SectionHead>

        <CardPanel>
          <PostGrid
            items={LIKED_WORKS}
            renderItem={(item) => <PostCard key={item.id} {...item} />}
          />
        </CardPanel>
      </Section>
    </Wrap>
  );
}

/* ───────── styles ───────── */

const Wrap = styled.div`
  display: flex;
  flex-direction: column;
  gap: 40px;
`;

const Section = styled.section``;

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

const CardPanel = styled.div`
  background: #ffffff;
  border: 1px solid #eef2f7;
  border-radius: 16px;
  padding: 20px;
`;

/* 카드 위 CTA 오버레이 */
const OverlayWrap = styled.div`
  position: relative;
`;

const CTAOverlay = styled.div`
  pointer-events: none; /* 기본은 클릭 막기 */
  position: absolute;
  inset: 0;
  border-radius: 16px;
  background: linear-gradient(
    180deg,
    rgba(163, 123, 255, 0.95) 0%,
    rgba(115, 66, 229, 0.85) 70%,
    rgba(115, 66, 229, 0.0) 100%
  );
  display: grid;
  place-items: center;
`;

const CTAButton = styled.button`
  pointer-events: auto; /* 버튼만 클릭 가능 */
  height: 36px;
  padding: 0 16px;
  border-radius: 999px;
  border: 0;
  font-weight: 700;
  color: #111827;
  background: #ffffff;
  box-shadow: 0 6px 24px rgba(0, 0, 0, 0.15);
`;
