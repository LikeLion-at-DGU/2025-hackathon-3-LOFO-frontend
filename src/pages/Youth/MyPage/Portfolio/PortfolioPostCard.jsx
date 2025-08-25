import * as S from "./Styled";
import { toAbsUrl } from "../../../../utils/url";

export default function PortfolioPostCard({ item, onClick, onJoin, onToggleSave }) {
  // 백/프론트 혼용 대비
  const name = item.store_name ?? item.storeName ?? "";
  const img = item.image ?? item.thumbnailUrl;
  const content = item.content ?? item.subtitle ?? "";

  return (
    <S.Card onClick={() => onClick?.(item)} $OverlayEl={S.Overlay}>
      <S.Thumb src={toAbsUrl(img)} alt={name} />
      {/* 본문 */}
      <S.Body>
        <S.Title>{name}</S.Title>
        <S.Meta>{content}</S.Meta>
      </S.Body>
    </S.Card>
  );
}
