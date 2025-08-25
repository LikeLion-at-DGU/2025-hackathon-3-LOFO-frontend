import { styled } from "styled-components";

const Section = styled.section`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  scroll-snap-align: start;
  font-size: 2rem;
  overflow: hidden;
/* 스크롤바 전체 영역 숨기기 */
  &::-webkit-scrollbar {
  width: 0px;
  background: transparent;
}
  background-color: var(--BG-001, #ffffff);
  z-index: 0;
`

export default Section;