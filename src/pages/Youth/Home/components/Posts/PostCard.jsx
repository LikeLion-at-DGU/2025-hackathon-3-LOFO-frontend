// PostCard.jsx
import styled from "styled-components";
import { MissionBtn } from "./MissionBtn";
import { toAbsUrl } from "../../../../../utils/url";

const Card = styled.article`
  position: relative;
  height: 180px;
  border-radius: 20px;
  overflow: hidden;
  background: #000;
  color: #fff;
  cursor: pointer;
  box-shadow: 0 6px 24px rgba(0,0,0,.12);

  &:hover ${props => props.OverlayEl} {
    opacity: 1;
    visibility: visible;
    transform: translateY(0);
  }
`;

const Thumb = styled.img`
  width: 100%;
  height: 180px;
  object-fit: cover;
  display: block;
  opacity: .85;
`;

const Body = styled.div`
  position: absolute;
  left: 0; right: 0; bottom: 0;
  padding: 14px;
  display: flex;
  flex-direction: column;
  gap: 6px;
  z-index: 1; /* Body도 위로 */
`;

const Overlay = styled.div`
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

const Title = styled.h3`
  font-size: 16px;
  font-weight: 700;
`;
const Meta = styled.div`
  font-size: 12px;
  opacity: .9;
`;


export default function PostCard({ item, onClick, onJoin }) {

  // 백/프론트 혼용 대비: snake 우선, 없으면 camel
  const name = item.store_name ?? item.storeName ?? item.title ?? "";
  const img  = item.image ?? item.thumbnailUrl;               // ★ 여기!
  const saved = item.saved_count ?? item.savedCount ?? 0;
  const content = item.content ?? item.subtitle ?? "";

  return (
    <Card
      onClick={() => onClick?.(item)}
      OverlayEl={Overlay}
    >
      <Thumb src={toAbsUrl(img)} alt={name} />

      {/* 평소 텍스트 */}
      <Body>
        <Title>{name}</Title>
        <Meta>{content} · ❤️ {saved ?? 0}</Meta>
      </Body>

      {/* 호버 시 얹어지는 보라색 레이어 + 버튼 */}
      <Overlay>
        <MissionBtn
          onClick={(e) => {
            e.stopPropagation();
            onJoin?.(item);
          }}
        />
      </Overlay>
    </Card>
  );
}
