import { styled } from "styled-components";
import Section from "./Section";
import startYouth from "../../../assets/startYouth.svg";
import startNopo from "../../../assets/startNopo.svg";
import logo from "../../../assets/logo.svg";
import Vector1 from "../../../assets/Vector1.svg";
import mouse from "../../../assets/mouse.svg";

const Topnav = styled.div`
    display: flex;
    width: 100%;
    height: 88px;
    padding: 29px 32px;
    align-items: center;
    border-bottom: 1px solid var(--line-001, #BABABA);
    position: absolute;
    top: 0;
    left: 0;
`
const Title = styled.div`
    text-align: center;
    font-family: "Pretendard Variable";
    font-size: 96px;
    font-style: normal;
    font-weight: 700;
    line-height: normal;
    background: linear-gradient(90deg, #A37BFF 0%, #7342E5 106.7%);
    background-clip: text;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    margin-top: 120px;
`
const Context = styled.p`
    color: var(--sub-004, #5A5A5A);
    font-family: "Pretendard Variable";
    font-size: 28px;
    font-style: normal;
    font-weight: 400;
    line-height: 40px;
    margin-bottom: 50px;
    text-align: center;

`
const ButtonContainer = styled.div`
    display: inline-flex;
    align-items: center;
    width: 100%;
    justify-content: center;
    gap: 100px;
    margin-bottom: 202px;
    position: relative;
`
const VectorImg = styled.img`
  width: 100vw;
  position: absolute;
  z-index: -1; /* 가장 뒤로 */
`
const MouseInfo = styled.span`
  align-self: stretch;
  color: #8B6FD4;
  text-align: center;
  /* body/001 */
  font-family: "Pretendard Variable";
  font-size: 22px;
  font-style: normal;
  font-weight: 400;
  line-height: normal;
  margin-bottom: 10px;
`
const Div = styled.div`
  display: flex;
  
`

function Scroll1() {
  return (
    <Section style={{position: "relative"}}>
      <div>
      <Topnav><img src={logo} alt="로고"/></Topnav>
      <Title>청년과 상인을 잇는 <br/> 새로운 방법</Title>
      <Context><b>청년은 포트폴리오를, 상인은 가게 홍보를,</b> <br/> LOFO에서 함께 참여하고 연결되는 경험을 시작하세요.</Context>
      <ButtonContainer>
        <img src={startYouth} alt="청년으로 시작하기" />
        <img src={startNopo} alt="상인으로 시작하기" />
        <VectorImg src={Vector1} alt="벡터" /> {/*position 속성 관련 위치 수정 필요*/}
      </ButtonContainer>
      </div>

      <MouseInfo>마우스를 내려주세요</MouseInfo>
      <img src={mouse} alt="마우스" />
    </Section>
  );
};

export default Scroll1;





