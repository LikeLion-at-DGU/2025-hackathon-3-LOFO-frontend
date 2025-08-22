import styled from "styled-components";

export const Wrap = styled.div`
  display: flex;
  flex-direction: column;
  gap: 40px;
`;

export const Section = styled.section``;

export const SectionHead = styled.div`
  display: flex;
  align-items: flex-end;
  gap: 12px;
  border-bottom: 1px solid #e5e7eb;
  padding-bottom: 10px;
  margin-bottom: 16px;
`;

export const Title = styled.h3`
  font-size: 18px;
  font-weight: 700;
  color: #111827;
`;

export const Count = styled.span`
  margin-left: auto;
  font-size: 14px;
  color: #6b7280;
`;

/*export const CardPanel = styled.div`
  background: #ffffff;
  border: 1px solid #eef2f7;
  border-radius: 16px;
  padding: 20px;
`;

/* 카드 위 CTA 오버레이 */
export const OverlayWrap = styled.div`
  position: relative;
`;

export const CTAOverlay = styled.div`
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

export const CTAButton = styled.button`
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


/*Growth*/
export const GrowthWrap = styled.div`
  padding: 0 0 80px;
`;

export const Grid = styled.div`
  display: grid;
  grid-template-columns: 280px 1fr;

  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
  }
`;

export const Aside = styled.aside`
  position: sticky;
  width: 220px;
  top: 88px; /* Topnav 높이에 맞춰 조절 */
  align-self: start;

`;

export const Main = styled.div`
  display: flex;
  flex-direction: column;
  gap: 32px;
  width: 100%;
`;

export const GrowthSection = styled.section`
  background: transparent;
`;
export const GrowthSectionBody = styled.div`
    display: flex;
    justify-content: center;
    padding: 12px 0 16px;
    flex-grow:1;
`
export const GrowthSectionHead = styled.div`
  display: flex;
  align-items: flex-end;
  gap: 12px;
  border-bottom: 1px solid #e5e7eb;
  padding-bottom: 10px;
  margin-bottom: 16px;
`;
