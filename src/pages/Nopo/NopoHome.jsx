import React, { useState } from "react";
import styled from "styled-components";
import Scroll1 from "./NopoHome/components/Scroll1";
import Scroll2 from "./NopoHome/components/Scroll2";
import logo from "../../assets/logo.svg";

const Top_nav = styled.div`
  display: flex;
  align-items: center;
  width: 100%;
  height: 88px;
  padding: 16px 8px;
  border-bottom: 1px solid var(--line-001, #bababa);
  position: absolute;
  /* top: 0;
    left: 0; */
`;

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

const NopoHome = () => {
  return (
    <>
      <Container>
        <Top_nav>
          <img src={logo} alt="로고" />
        </Top_nav>
        <Scroll1 />
        <Scroll2 />
      </Container>
    </>
  );
};

export default NopoHome;
