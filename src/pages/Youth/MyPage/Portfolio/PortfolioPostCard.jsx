import * as S from "./Styled";
import { MissionBtn } from "../../Home/components/Posts/MissionBtn";
import { toAbsUrl } from "../../../../utils/url";

export default function PortfolioPostCard({ item, onClick, onJoin, onToggleSave }) {
  // 백/프론트 혼용 대비
  const name = item.store_name ?? item.storeName ?? item.title ?? "";
  const img = item.image ?? item.thumbnailUrl;
  const content = item.content ?? item.subtitle ?? "";

  const isSaved = (item.is_saved ?? item.savedByMe) ?? false;
  const savedCount = (item.saved_count ?? item.savedCount) ?? 0;

  return (
    <S.Card onClick={() => onClick?.(item)} $OverlayEl={S.Overlay}>
      <S.Thumb src={toAbsUrl(img)} alt={name} />
      {/* 본문 */}
      <S.Body>
        <S.Title>{name}</S.Title>
        <S.Meta>{content}</S.Meta>
      </S.Body>

      {/* 호버 레이어 */}
      <S.Overlay>
        <MissionBtn
          onClick={(e) => {
            e.stopPropagation();
            onJoin?.(item);
          }}
        />
      </S.Overlay>
    </S.Card>
  );
}
