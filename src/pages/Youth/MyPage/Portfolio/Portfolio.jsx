import styled from "styled-components";
import * as S from "../Styled.js";
import PortfolioPostGrid from "../Portfolio/PortfolioPostGrid.jsx";
//import PortfolioPostCard from "../Portfolio/PortfolioPostGrid.jsx";
import {usePortfolio} from "../../../../hooks/usePortfolio.js";

export default function Portfolio() {
  const { items, loading, error } = usePortfolio();

  if (loading) {
    return (
      <S.Wrap>
        <S.Section><Empty>불러오는 중…</Empty></S.Section>
      </S.Wrap>
    );
  }
  if (error) {
    return (
      <S.Wrap>
        <S.Section><Empty>에러: {error}</Empty></S.Section>
      </S.Wrap>
    );
  }
  if (!items.length) {
    return (
      <S.Wrap>
        <S.Section>
          <Empty>아직 업로드한 작업물이 없어요.</Empty>
        </S.Section>
      </S.Wrap>
    );
  }

  return (
    <S.Wrap>
      <S.Section>
        <PortfolioPostGrid items={items} />
      </S.Section>
    </S.Wrap>
  );
}

const Empty = styled.div`
  height: 200px;
  border: 1px solid #eef2f7;
  border-radius: 16px;
  background: #fff;
  display: grid;
  place-items: center;
  color: #6b7280;
`;
