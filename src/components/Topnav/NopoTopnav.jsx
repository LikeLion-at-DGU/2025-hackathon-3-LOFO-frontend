import React from "react";
import styled from "styled-components";
import { Link } from "react-router-dom";
import logo_nopo from "../../assets/logo_nopo.svg";

// topnav height 64px 고정
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
  gap: 24px;
  background: var(--BG-001, #f9fafb);
`;

const Logo = styled.img`
  cursor: pointer;
`;
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
  &:hover {
    background: #eef2ff;
    color: #4338ca;
    font-weight: 600;
  }
`;

function NopoTopnav() {
  return (
    <Nav>
      <Link to="/">
        <Logo src={logo_nopo} alt="상인로고" />
      </Link>
      <NavTabs>
        <Link to="/nopo/home">
          <Tab>홈</Tab>
        </Link>
        <Link to="/nopo/request">
          <Tab>요청</Tab>
        </Link>
        <Link to="/lofo/community">
          <Tab>발견</Tab>
        </Link>
        <Link to="/nopo/received">
          <Tab>마이페이지</Tab>
        </Link>
      </NavTabs>
    </Nav>
  );
}

export default NopoTopnav;
