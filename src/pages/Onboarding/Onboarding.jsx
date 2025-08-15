import { styled } from "styled-components";
import Scroll1 from "../Onboarding/components/Scroll1";
import Scroll2 from "../Onboarding/components/Scroll2";
import Scroll3 from "../Onboarding/components/Scroll3";

const Container = styled.div`
  height: 500vh; //100vh?
  scroll-snap-type: y mandatory;
  overflow-y: scroll;
  /* 스크롤바 전체 영역 숨기기 */
  &::-webkit-scrollbar {
  width: 0px;
  background: transparent;
  }
`;

const Section = styled.section`
  min-height: 100vh;
  width: 100vw;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  scroll-snap-align: start;
  font-size: 2rem;
  &::-webkit-scrollbar {
  width: 0px;
  background: transparent;
}
`;


function Onboarding() {
  return (
    <>
      <Container>
      <Scroll1/>
      <Scroll2/>
      <Scroll3/>
      <Section style={{ background: "#ffffcc" }}>Page 4</Section>
      <Section style={{ background: "#4156b6ff" }}>Page 5</Section>
    </Container>
    </>
  );
};

export default Onboarding;





