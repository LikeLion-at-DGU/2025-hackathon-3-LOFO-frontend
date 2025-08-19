import styled from "styled-components";
import { Link } from "react-router-dom";
import logo_blue from "../../assets/logo_blue.svg";


export function YouthTopnav() {
  return (
    <Header>
      <Link to="/"><Logo src={logo_blue} alt="로고-blue"/></Link>
      <NavTabs>
        <Link to="/youth/home"><Tab>홈</Tab></Link>
        <Link to="/youth/mission"><Tab>미션</Tab></Link>
        <Link to="/youth/home"><Tab>발견</Tab></Link>
        <Link to="/youth/mypage"><Tab>마이페이지</Tab></Link>
      </NavTabs>
    </Header>
  );
}


const Header = styled.header`
    display: flex;
    width: 100vw;
    height: 64px;
    padding: 29px 32px;
    align-items: center;
    border-bottom: 1px solid var(--line-001, #BABABA);
    position: fixed;
    top: 0;
    left: 0;
    z-index: 10;
    gap: 24px;
    background: #fff;
`
const Logo = styled.img`
  cursor: pointer;
`
const NavTabs = styled.nav`
  display: flex;
  gap: 16px;
  margin-left: 8px;
`;

const Tab = styled.button`
  padding: 6px 10px;
  border-radius: 8px;
  border: none;
  background: transparent;
  color: #6b7280;
  cursor: pointer;

  &:hover{
    background: #eef2ff;
    color: #4338ca;
    font-weight: 600;
  }
`;
