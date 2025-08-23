import styled from "styled-components";

export const Card = styled.article`
  position: relative;
  height: 180px;
  border-radius: 20px;
  overflow: hidden;
  background: #000;
  color: #fff;
  cursor: pointer;
  box-shadow: 0 6px 24px rgba(0,0,0,.12);

  &:hover ${props => props.$OverlayEl} {
    opacity: 1;
    visibility: visible;
    transform: translateY(0);
  }
`;

export const Thumb = styled.img`
  width: 100%;
  height: 180px;
  object-fit: cover;
  display: block;
  opacity: .85;
`;

export const Body = styled.div`
  position: absolute;
  left: 0; right: 0; bottom: 0;
  padding: 8px 28px;
  display: flex;
  gap: 2px;
  flex-direction: column;
  z-index: 1; /* Body도 위로 */
`;

export const Overlay = styled.div`
  position: absolute;
  inset: 0;
  display: flex;
  justify-content: center;
  align-items: center;

  background: linear-gradient(
    180deg,
    rgba(99,34,182,0.00) 13.41%,
    rgba(99,34,182,0.70) 73.11%
  );
  border: 2px solid #8B6FD4;
  border-radius: 20px;

  /* 처음엔 숨김 */
  opacity: 0;
  visibility: hidden;
  transform: translateY(6px);
  transition: opacity .2s ease, transform .2s ease;
  z-index: 2; /* Body보다 위 */
  /*z-index: 0; /* Body보다 아래, but 내용이 위로 뜸(피그마 동일) */
`;

export const Title = styled.h3`
  font-size: 20px;
  font-weight: 700;
  margin-bottom: 0;
`;
export const Meta = styled.div`
  font-size: 14px;
  opacity: .9;
`;
export const HeartCount = styled.div`
  font-size: 20px;
  opacity: .9;

`;
export const DivRow = styled.div`
  display: flex;
  justify-content: space-between;
`
export const HeartBtn = styled.button`
  position: absolute; top: 140px; right: 40px; z-index: 3;
  width: 36px; height: 36px; border-radius: 999px;
  display: grid; place-items: center;
  color: white;
  border: none;
  background: none;
  transition: transform .12s ease;
  &:active { transform: scale(.96); }
`;

export const Grid = styled.div`
  display: grid;
  padding: 60px 40px;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 60px;
  @media (max-width: 1024px) { grid-template-columns: repeat(2, 1fr); }
  @media (max-width: 640px) { grid-template-columns: 1fr; }
`;