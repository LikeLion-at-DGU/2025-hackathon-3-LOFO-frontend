import styled from "styled-components";
import { NavLink } from "react-router-dom";
import logo_blue from "../../assets/logo_blue.svg";
import LogoutBtn from "./Logout/LogoutBtn";

export function YouthTopnav() {
  return (
    <Header>
      <Logo src={logo_blue} alt="로고-blue" />
      <NavTabs>
        <Tab to="/youth/home" end>
          홈
        </Tab>
        <Tab to="/youth/mission">미션</Tab>
        <Tab to="/lofo/community">발견</Tab>
        <Tab to="/youth/mypage">마이페이지</Tab>
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

  /* 탭 밑줄이 헤더의 하단과 맞닿도록 */
  align-self: stretch; /* 헤더 높이만큼 세로로 늘리고 */
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
  padding-bottom: 9px; /* 밑줄 공간 */

  &:hover {
    font-weight: 600;
  }

  &.active {
    color: #111827;
    font-weight: 700;
    border-bottom-color: #368fef; /* 파란 밑줄 */
  }
`;
const dTab = styled.button`
  padding: 6px 10px;
  border-radius: 8px;
  border: none;
  background: transparent;
  color: #6b7280;
  cursor: pointer;

  &:hover {
    background: #eef2ff;
    color: #4338ca;
    font-weight: 600;
  }
`;
