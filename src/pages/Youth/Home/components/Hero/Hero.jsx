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
          <Title>지금, 당신의 기회를 잡으세요</Title>
          <Sub>지역 상인의 실제 문제를 해결하는 미션에 지금 도전하세요.</Sub>
        </div>
        <div>
        원하는 가게가 없나요?
        <Link to="/youth/home/ai"><Btn onClick={onClickAIMission}>AI 미션 하러가기</Btn></Link>
        </div>
      </Row>
    </Wrap>
  );
}
