import { styled } from "styled-components";
import Section from "./Section";
import Scroll4MissionCard from "../../../assets/Scroll4MissionCard.png";
import Scroll4MissionStepCard from "../../../assets/Scroll4MissionStepCard.png";

const Div = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: flex-start;
    gap: 10px;
`
const Title = styled.h1`
    color: #000;
    text-align: center;
    font-size: 55px;
    font-style: normal;
    font-weight: 700;
    line-height: normal;
`
const StepContainer = styled.div`
    display: flex;
    width: 1100px;
    padding: 30px 30px 30px 80px;
    justify-content: space-between;
    align-items: center;
    border-radius: 20px;
    background: var(--white, #FFF);
    box-shadow: 0 8px 40px 0 rgba(136, 102, 179, 0.25);
`
const StepNumber = styled.span`
    color: var(--text-002, #4F4F4F);
    font-size: 15px;
    font-style: normal;
    font-weight: 600;
    line-height: normal;
`

const StepTitle = styled.span`
    color: var(--text-001, #333);
    /* h1/002 */
    font-size: 33px;
    font-style: normal;
    font-weight: 700;
    line-height: 45px;
    letter-spacing: -0.05cap;
`
const StepDetails = styled.span`
    color: var(--text-001, #333);
    /* body/001 */
    font-size: 15px;
    font-style: normal;
    font-weight: 400;
    line-height: normal;
`
const Container = styled.div`
    display: flex;
    flex-direction: column;
    width: auto;
    position: relative;
`//나중에 position 설정할 때 활용

function Scroll4() {
  return (
    <Section style={{ background: "linear-gradient(180deg, #FFF 31.88%, rgba(255, 255, 255, 0.00) 96.39%), linear-gradient(0deg, #7B5ECC -17.63%, #A37BFF 31.62%)"}}>
        <Title>어떻게 사용하냐고요?</Title>
        <Container>
            <StepContainer style={{zIndex: "3"}}>
                <Div>
                <StepNumber>STEP 1</StepNumber>
                <StepTitle>가게 요청을 선택하고<br/>작업 목표와 데드라인을<br/>입력하세요</StepTitle>
                <StepDetails>급하게 할 필요 없이 완성하는 걸 목표로 해요.</StepDetails>
                </Div>
                <img src={Scroll4MissionCard} alt="step1" />
            </StepContainer>
            <StepContainer style={{zIndex: "2"}}>
                <Div>
                <StepNumber>STEP 2</StepNumber>
                <StepTitle>AI 맞춤 계획을 실행하세요</StepTitle>
                <StepDetails>AI가 데드라인과 목표에 맞게 계획을 짜줘요.<br/>AI 피드백으로 더 정교한 작업을 할 수 있어요.</StepDetails>
                </Div>
                <img src={Scroll4MissionStepCard} alt="step2" style={{width: "56%"}} />
            </StepContainer>
            <StepContainer style={{zIndex: "1"}}>
                <Div>
                <StepNumber>STEP 3</StepNumber>
                <StepTitle>상인에게 작업물을 전달할 수 있어요</StepTitle>
                <StepDetails>상인은 작업물을 보고 가게에 직접 활용할 수 있어요.<br/>포트폴리오도 쌓고 지역 경제도 직접적으로 살릴 수 있어요.</StepDetails>
                </Div>
            </StepContainer>
        </Container>
    </Section>
  );
};

export default Scroll4;





