import * as S from "./Styled";
import PortfolioPostCard from "./PortfolioPostCard";

// PostGrid.jsx
export default function PortfolioPostGrid({ items = [], onClickCard, onJoin, onToggleSave }) {
  return (
    <S.Grid>
      {items.map(it => (
        <PortfolioPostCard
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
