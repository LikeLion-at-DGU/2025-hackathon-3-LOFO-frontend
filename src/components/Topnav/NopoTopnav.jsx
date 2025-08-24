import styled from "styled-components";
import { NavLink } from "react-router-dom";
import logo_nopo from "../../assets/logo_nopo.svg";
import LogoutBtn from "./Logout/LogoutBtn";

export function NopoTopnav() {
  return (
    <Header>
      <Logo src={logo_nopo} alt="로고-상인" />
      <NavTabs>
        <Tab to="/nopo/home" end>
          홈
        </Tab>
        <Tab to="/nopo/request">요청</Tab>
        <Tab to="/lofo/community">발견</Tab>
        <Tab to="/nopo/received">마이페이지</Tab>
      </NavTabs>

      <LogoutBtn />
    </Header>
  );
}

const Header = styled.header`
  display: flex;
  width: 100vw;
  height: 64px;
  padding: 0 32px;
  align-items: center;
  border-bottom: 1px solid var(--line-001, #bababa);
  position: fixed;
  top: 0;
  left: 0;
  z-index: 10;
  gap: 24px;
  background: #fff;
`;
const LogoLink = styled(NavLink)`
  display: inline-flex;
  align-items: center;
`;
const Logo = styled.img`
  //cursor: pointer;
`;

const NavTabs = styled.nav`
  display: flex;
  gap: 16px;
  margin-left: 8px;
  align-self: stretch;
`;
const Tab = styled(NavLink).attrs({ end: false })`
  position: relative;
  display: inline-flex;
  align-items: center;
  padding: 6px 10px;
  border: 0;
  background: transparent;
  text-decoration: none;
  color: #6b7280;

  /* 기본은 밑줄 투명 */
  border-bottom: 3px solid transparent;
  padding-bottom: 9px;
  &:hover {
    font-weight: 600;
  }

  &.active {
    color: #111827;
    font-weight: 700;
    border-bottom-color: #e19543;
  }
`;

export default NopoTopnav;
