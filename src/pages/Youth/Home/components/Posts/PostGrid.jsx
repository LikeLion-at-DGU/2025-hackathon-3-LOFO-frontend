import * as S from "./Styled";
import { useState, useEffect } from "react";
import { toggleSaveMission } from "../../../../../apis/saveMission";

import PostCard from "./PostCard";

// PostGrid.jsx
export default function PostGrid({ items = [], onClickCard, onJoin, onToggleSave }) {
  return (
    <S.Grid>
      {items.map(it => (
        <PostCard
          key={it.id}
          item={it}
          onClick={onClickCard}
          onJoin={onJoin}
          onToggleSave={() => onToggleSave?.(it)} // ★ 부모 호출
        />
      ))}
    </S.Grid>
  );
}
