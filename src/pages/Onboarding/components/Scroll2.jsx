import { styled } from "styled-components";
import Section from "./Section";
import Scroll2Emoticon from "../../../assets/Scroll2Emoticon.png";


const Container = styled.div`
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
    margin: 0 auto;
    align-items: center;
    gap: 50px;
    text-align: center;
    position: relative;
`
const Title = styled.div`
    align-self: stretch;
    color: #000;
    text-align: center;
    font-family: "Pretendard Variable";
    font-size: 64px;
    font-style: normal;
    font-weight: 500;
    line-height: normal;
`
const Context = styled.div`
    color: #000;
    font-family: "Pretendard Variable";
    font-size: 32px;
    font-style: normal;
    font-weight: 400;
    line-height: normal;
`
const Em = styled.span`
    color:#F19A20; 
`
const Emoticon = styled.img`
    position: absolute;
    top: 40px;
    right: 500px;
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
    font-size: 64px;
    font-style: normal;
    font-weight: 900;
    line-height: normal;
`
const StepImg = styled.img`
    width: 526px;
    height: 223px;
    flex-shrink: 0;
    border-radius: 20px;
    background: #D9D9D9;
`
const StepInfo = styled.div`
    color: #000;
    /* h2/001 */
    font-family: "Pretendard Variable";
    font-size: 36px;
    font-style: normal;
    font-weight: 600;
    line-height: normal;
`

function Scroll2() {
  return (
    <Section style={{ padding: "120px 309px 94px 309px" }}>
        <Container>
            <ContextContainer>
                <Title><b>식당 운영하고 계신가요?</b><br/>그러면 꼭 필요할 거예요</Title>
                <Context><Em>젊은 손님</Em>을 움직이기 위해선<br/>색다른 홍보가 필요할 거예요<br/><br/>저희 서비스에서 가게 홍보를 도와드릴게요!</Context>
                <Emoticon src={Scroll2Emoticon} alt="이모티콘"/>
            </ContextContainer>
            <StepContainer>
                <Step>
                    <StepNumber>0<Em>1</Em></StepNumber>
                    <StepImg />
                    <StepInfo>내 가게에 <Em>필요한<br/>요청</Em>을 직접 입력해요</StepInfo>
                </Step>
                <Step>
                    <StepNumber>0<Em>2</Em></StepNumber>
                    <StepImg />
                    <StepInfo>청년들이 만든<br/>작업물을 확인하고 활용해요</StepInfo>
                </Step>

            </StepContainer>
        </Container>
    </Section>
  );
};

export default Scroll2;





