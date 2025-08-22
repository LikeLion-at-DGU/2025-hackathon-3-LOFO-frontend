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
  padding: 14px;
  display: flex;
  flex-direction: column;
  gap: 6px;
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
`;

export const Title = styled.h3`
  font-size: 16px;
  font-weight: 700;
`;
export const Meta = styled.div`
  font-size: 12px;
  opacity: .9;
`;
export const HeartBtn = styled.button`
  position: absolute; top: 120px; right: 10px; z-index: 3;
  width: 36px; height: 36px; border-radius: 999px;
  display: grid; place-items: center;
  border: 1px solid rgba(255,255,255,.4);
  background: rgba(0,0,0,.35); backdrop-filter: blur(2px);
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