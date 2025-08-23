import * as S from "./Styled";
import { MissionBtn } from "./MissionBtn";
import { toAbsUrl } from "../../../../../utils/url";
import { Heart } from "lucide-react";

export default function PostCard({ item, onClick, onJoin, onToggleSave }) {
  // 백/프론트 혼용 대비
  const storeName = item.store_name ?? item.storeName ?? item.title ?? "";
  const img = item.image ?? item.thumbnailUrl;
  const title = item.title;
  const content = item.content ?? item.subtitle ?? "";

  // ⚠️ 로컬 상태 쓰지 말고 부모가 내려준 상태만 표시
  const isSaved = (item.is_saved ?? item.savedByMe) ?? false;
  const savedCount = (item.saved_count ?? item.savedCount) ?? 0;

  //console.log("title: ",item.title);
  return (
    <S.Card onClick={() => onClick?.(item)} $OverlayEl={S.Overlay}>
      <S.Thumb src={toAbsUrl(img)} alt={name} />

      {/* 하트 버튼: 클릭만 부모로 올림 */}
      <S.HeartBtn
        aria-label={isSaved ? "찜 해제" : "찜하기"}
        onClick={(e) => {
          e.stopPropagation();
          onToggleSave?.(item);
        }}
        title={isSaved ? "찜 해제" : "찜하기"}
      >
        <Heart
          size={18}
          strokeWidth={2}
          fill={isSaved ? "currentColor" : "transparent"}
        />
      </S.HeartBtn>

      {/* 본문 */}
      <S.Body>
        <S.Title>{title}</S.Title>
        <S.DivRow>
          <S.Meta>{storeName}</S.Meta>
          <S.HeartCount>{savedCount}</S.HeartCount>
        </S.DivRow>
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
