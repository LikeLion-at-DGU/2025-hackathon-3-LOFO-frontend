import React, { useState } from "react";
import styled from "styled-components";
import Scroll1 from "./components/Scroll1";
import Scroll2 from "./components/Scroll2";
import NopoTopnav from "../../../components/Topnav/NopoTopnav";

const Container = styled.div`
  /* height: 100vh; */
  scroll-snap-type: y mandatory;
  overflow-y: scroll;
  /* 스크롤바 전체 영역 숨기기 */
  &::-webkit-scrollbar {
    width: 0px;
    /* background: transparent; */
  }
`;

const NopoHome = () => {
  return (
    <>
      <Container>
        <NopoTopnav />
        <Scroll1 />
        <Scroll2 />
      </Container>
    </>
  );
};

export default NopoHome;
