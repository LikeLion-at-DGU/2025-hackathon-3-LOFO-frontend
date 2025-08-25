import { styled } from "styled-components";
import logo from "../../assets/logo.svg";

const Nav = styled.div`
  display: flex;
  width: 100vw;
  height: 64px;
  padding: 29px 32px;
  align-items: center;
  border-bottom: 1px solid var(--line-001, #bababa);
  position: fixed;
  top: 0;
  left: 0;
  z-index: 10;
  background: var(--BG-001, #f9fafb);
`;

function Topnav() {
  return (
    <Nav>
      <img src={logo} alt="로고-purple" />
    </Nav>
  );
}

export default Topnav;
