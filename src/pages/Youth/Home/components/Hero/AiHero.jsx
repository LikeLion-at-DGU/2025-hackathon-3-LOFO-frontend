import styled from "styled-components";
import { Link } from "react-router-dom";

const Wrap = styled.section`
  width: 100%;
  padding: 40px 0 16px;
`;
const Row = styled.div`
  display: flex; align-items: center; justify-content: space-between;
  gap: 16px; flex-wrap: wrap;
`;
const Title = styled.h1`
  font-size: 40px; font-weight: 800; line-height: 1.2;
`;
const Sub = styled.p`
  color: #555; margin-top: 8px;
`;
const Btn = styled.button`
  border: 0; padding: 12px 16px; border-radius: 999px; box-shadow: 0 2px 10px rgba(0,0,0,.08);
  cursor: pointer;
`;

export default function Hero({ onClickAIMission }) {
  return (
    <Wrap>
      <Row>
        <div>
          <Title>AI가 만든 가게 요청을 실행해보세요</Title>
          <Sub>실제 데이터 더미를 이용해서 만든 요청이라 연습용으로도 괜찮아요.</Sub>
        </div>
      </Row>
    </Wrap>
  );
}
