import { styled } from "styled-components";
import Section from "./Section";
import startYouth from "../../../assets/startYouth.svg";
import startNopo from "../../../assets/startNopo.svg";

const Title = styled.div`
    text-align: center;
font-family: "Pretendard Variable";
font-size: 80px;
font-style: normal;
font-weight: 700;
line-height: normal;
background: var(--gr-02, linear-gradient(90deg, #FFB347 0%, #A37BFF 99.86%));
background-clip: text;
-webkit-background-clip: text;
-webkit-text-fill-color: transparent;
`
const ButtonContainer = styled.div`
    display: inline-flex;
    align-items: center;
    width: 100%;
    justify-content: center;
    gap: 100px;
    margin-top: 100px;
`

function Scroll5() {
  return (
    <Section>
      <Title>LOFO에서<br/>내 이야기가 지역을 움직이는 경험을 해보세요</Title>
      <ButtonContainer>
        <img src={startYouth} alt="청년으로 시작하기" />
        <img src={startNopo} alt="상인으로 시작하기" />
      </ButtonContainer>
    </Section>
  );
};

export default Scroll5;





