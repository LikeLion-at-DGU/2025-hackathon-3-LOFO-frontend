import * as S from "./Styled";
import { useState, useEffect } from "react";
import PostCard from "./PostCard";


// PostGrid.jsx
export default function PostGrid({
  items = [],
  onClickCard,
  onJoin,
  onToggleSave,
  renderItem,           // ✅ 커스텀 렌더러 지원
}) {
  return (
    <S.Grid>
      {items.map((it) => {
        if (typeof renderItem === "function") {
          // ✅ 커스텀 렌더 사용 시, onToggleSave를 넘길 수 있게 item과 함께 제공
          return renderItem(it, { onToggleSave: () => onToggleSave?.(it) });
        }
        // 기본 렌더: PostCard 사용
        return (
          <PostCard
            key={it.id}
            item={it}
            onClick={onClickCard}
            onJoin={onJoin}
            onToggleSave={() => onToggleSave?.(it)}
          />
        );
      })}
    </S.Grid>
  );
}
