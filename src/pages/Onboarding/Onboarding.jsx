import { styled } from "styled-components";
import Scroll1 from "../Onboarding/components/Scroll1";
import Scroll2 from "../Onboarding/components/Scroll2";
import Scroll3 from "../Onboarding/components/Scroll3";
import Scroll4 from "../Onboarding/components/Scroll4";
import Scroll5 from "../Onboarding/components/Scroll5";

const Container = styled.div`
  height: 500vh; //100vh?
  scroll-snap-type: y mandatory;
  overflow-y: scroll;
  /* 스크롤바 전체 영역 숨기기 */
  &::-webkit-scrollbar {
  //width: 0px;//?
  }
`;


function Onboarding() {
  return (
    <>
      <Container>
      <Scroll1/>
      <Scroll2/>
      <Scroll3/>
      <Scroll4/>
      <Scroll5/>
    </Container>
    </>
  );
};

export default Onboarding;





