import { styled } from "styled-components";
import { Link } from "react-router-dom";

import Section from "./Section";
import startYouth from "../../../assets/startYouth.svg";
import startNopo from "../../../assets/startNopo.svg";
import Vector1 from "../../../assets/Vector1.svg";
import mouse from "../../../assets/mouse.svg";

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
`
const Title = styled.div`
    text-align: center;
    font-family: "Pretendard Variable";
    font-size: 54px;
    font-style: normal;
    font-weight: 700;
    line-height: 68px;
    background: linear-gradient(90deg, #A37BFF 0%, #7342E5 106.7%);
    background-clip: text;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
`
const Context = styled.p`
    color: var(--sub-004, #5A5A5A);
    font-family: "Pretendard Variable";
    font-size: 28px;
    font-style: normal;
    font-weight: 400;
    line-height: 40px;
    text-align: center;
    margin-bottom: 60px;
`
const ButtonContainer = styled.div`
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 70px;
    position: relative;
    margin-bottom: 30px;
`
const Button = styled.img`
//border-radius: 60px;
//box-shadow: 0 8px 24px 0 rgba(0, 0, 0, 0.50);
  cursor: pointer;
  &:hover{
  opacity: 0.8;
  }
`
const VectorImg = styled.img`
  width: 100vw;
  position: absolute;
  z-index: -1; /* 가장 뒤로 */
`
const MouseInfo = styled.span`
  color: #8B6FD4;
  text-align: center;
  /* body/001 */
  font-family: "Pretendard Variable";
  font-size: 22px;
  font-style: normal;
  font-weight: 400;
  line-height: normal;
  margin-bottom: 5px;
`

function Scroll1() {
  return (
    <Section style={{position: "relative", width: "100vw"}}>
      <Wrapper>
        <Title>청년과 상인을 잇는 새로운 방법</Title>
        <Context><b>청년은 포트폴리오를, 상인은 가게 홍보를,</b> <br/> LOFO에서 함께 참여하고 연결되는 경험을 시작하세요.</Context>
      </Wrapper>
      <Wrapper>
      <ButtonContainer>
        <Link to="/auth/login-youth">
          <Button src={startYouth} alt="청년으로 시작하기" />
        </Link>
        <Link to="/auth/login-youth">
          <Button src={startNopo} alt="상인으로 시작하기" />
        </Link>
        <VectorImg src={Vector1} alt="벡터" /> {/*position 속성 관련 위치 수정 필요*/}
      </ButtonContainer>
      <MouseInfo>마우스를 내려주세요</MouseInfo>
      <img src={mouse} alt="마우스" width="60px"/>
      </Wrapper>
    </Section>
  );
};

export default Scroll1;





