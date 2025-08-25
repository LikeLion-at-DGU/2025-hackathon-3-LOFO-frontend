import { styled } from "styled-components";
import Section from "./Section";
import Scroll2Emoticon from "../../../assets/Scroll2Emoticon.png";
import Scroll2Img1 from "../../../assets/Scroll2Img1.png";
import Scroll2Img2 from "../../../assets/Scroll2Img2.png";


const Wrapper = styled.div`
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 40px;
`
const ContextContainer = styled.div`
    display: flex;
    flex-direction: column;
    width: 100%;
    gap: 1.5rem;
    text-align: center;
    position: relative;
`
const Title = styled.div`
    align-self: stretch;
    color: #000;
    font-size: 52px;
    font-style: normal;
    font-weight: 500;
    line-height: 66px;
`
const Context = styled.div`
    color: #000;
    font-size: 22px;
    font-style: normal;
    font-weight: 400;
    line-height: normal;
`
const Em = styled.span`
    color:#F19A20; 
`
const Emoticon = styled.img`
    position: absolute;
    top: 45px;
    right: -120px;
`
const StepContainer = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 220px;
`
const Step = styled.div`
    display: flex;
    width: 526px;
    height: 425px;
    flex-direction: column;
    align-items: flex-start;
    gap: 10px;
`
const StepNumber = styled.div`
    align-self: stretch;
    opacity: 0.5;
    color: #FFDDAC;
    font-family: "Pretendard Variable";
    font-size: 54px;
    font-style: normal;
    font-weight: 900;
    line-height: normal;
`
const StepImg = styled.img`
    width: 526px;
    height: 223px;
    flex-shrink: 0;
    border-radius: 20px;
`
const StepInfo = styled.div`
    color: #000;
    /* h2/001 */
    font-family: "Pretendard Variable";
    font-size: 30px;
    font-style: normal;
    font-weight: 600;
    line-height: normal;
`

function Scroll2() {
  return (
    <Section >
        <Wrapper>
            <div>
            <ContextContainer>
                <Title><b>식당 운영하고 계신가요?</b><br/>그러면 꼭 필요할 거예요</Title>
                <Context><Em>젊은 손님</Em>을 움직이기 위해선<br/>색다른 홍보가 필요할 거예요<br/></Context>
                <Context>저희 서비스에서 가게 홍보를 도와드릴게요!</Context>
                <Emoticon src={Scroll2Emoticon} alt="이모티콘"/>
            </ContextContainer>
            </div>
            <StepContainer>
                <Step>
                    <StepNumber>0<Em>1</Em></StepNumber>
                    <StepImg src={Scroll2Img1} alt="step1"/>
                    <StepInfo>내 가게에 <Em>필요한<br/>요청</Em>을 직접 입력해요</StepInfo>
                </Step>
                <Step>
                    <StepNumber>0<Em>2</Em></StepNumber>
                    <StepImg src={Scroll2Img2} alt="step2"/>
                    <StepInfo>청년들이 만든<br/>작업물을 확인하고 활용해요</StepInfo>
                </Step>

            </StepContainer>
        </Wrapper>
    </Section>
  );
};

export default Scroll2;





