import { styled } from "styled-components";
import Section from "./Section";
import Scroll3Emoticon from "../../../assets/Scroll3Emoticon.png";
import Vector2 from "../../../assets/Vector2.svg";

const Container = styled.div`
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 80px;
`
const ContextContainer = styled.div`
    display: flex;
    flex-direction: column;
    width: 100%;
    gap: 1.5rem;
    position: relative;
`
const Title = styled.div`
    align-self: stretch;
    color: #000;
    text-align: center;
    font-family: "Pretendard Variable";
    font-size: 52px;
    font-style: normal;
    font-weight: 500;
    line-height: 66px;
`
const Emoticon = styled.img`
    position: absolute;
    top: 40px;
    left: -120px;
    width: 25%;
`
const ExContainer = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 1050px;
`
const Example = styled.div`
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 1.7rem;
`
const ExampleTitle = styled.div`
    align-self: stretch;
    color: #000;
    font-family: "Pretendard Variable";
    font-size: 35px;
    font-style: normal;
    font-weight: 500;
    line-height: normal;
    margin-bottom: 1rem;
`
const ExampleTag = styled.div`
    display: flex;
    padding: 9px 18px;
    align-items: center;
    border-radius: 100px;
    background: #EAEAEA;
    font-size: 25px;
    font-weight: 580;
`
const Comment = styled.span`
    color: var(--text-001, #333);
    text-align: center;
    font-family: "Pretendard Variable";
    font-size: 26px;
    font-style: normal;
    font-weight: 400;
    line-height: normal;
    align-self: stretch;
`

function Scroll3() {
  return (
    <Section>
        <Container>
            <div>
            <ContextContainer>
                <Title><b>대한민국 청년</b>이라면<br/>이런 고민 해보셨죠?</Title>
                <Emoticon src={Scroll3Emoticon} alt="이모티콘"/>
            </ContextContainer></div>
            <ExContainer>
                <Example>
                    <ExampleTitle><span style={{fontSize: "43px", fontWeight: "600"}}>포트폴리오</span><br/>쌓아야 하는데 기회가 없어</ExampleTitle>
                    <ExampleTag style={{background: "var(--main-001, #368FEF)", color: "white"}}>#압축 실무 경험</ExampleTag>
                    <ExampleTag>#상인과 소통하면서</ExampleTag>
                    <ExampleTag>#실질적인 포폴 쌓기</ExampleTag>
                </Example>
                <Example>
                    <ExampleTitle><span style={{fontSize: "43px", fontWeight: "600"}}>실패 경험</span><br/>때문에 도전하기가 두려워</ExampleTitle>
                    <ExampleTag style={{background: "var(--main-001, #368FEF)", color: "white"}}>#느려도 괜찮아</ExampleTag>
                    <ExampleTag>#AI 맞춤 계획 설계</ExampleTag>
                    <ExampleTag>#AI 피드백</ExampleTag>
                </Example>
            </ExContainer>
            <Comment>LOFO에서 새로운 방법으로 고민 해결해보세요</Comment>
        </Container>
    </Section>
  );
};

export default Scroll3;





