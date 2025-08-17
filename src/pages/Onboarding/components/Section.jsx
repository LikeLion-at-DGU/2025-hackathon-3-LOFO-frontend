import { styled } from "styled-components";

const Section = styled.section`
  min-height: 100vh;
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
  background-color: var(--BG-001, #ffffff);
  z-index: -10
`;

export default Section;