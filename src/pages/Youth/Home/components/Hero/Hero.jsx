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
display: flex;
padding: 13px 40px;
justify-content: center;
align-items: center;
gap: 10px;
border-radius: 100px;
background: var(--white, #FFF);
box-shadow: 0 4px 12px 0 rgba(0, 0, 0, 0.25);
color: var(--main-003, #8B6FD4);
font-size: 17px;
font-style: normal;
font-weight: 600;
line-height: normal;
letter-spacing: 0.5px;
border: 0;
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
        <div style={{ display: "flex", gap: "30px", alignItems: "center" }}>
        원하는 가게가 없나요?
        <Link to="/youth/home/ai"style={{ textDecoration: "none" }}><Btn onClick={onClickAIMission}>AI 미션 하러가기</Btn></Link>
        </div>
      </Row>
    </Wrap>
  );
}
