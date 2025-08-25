import React from "react";
import styled from "styled-components";
import Scroll1 from "./components/Scroll1";
import Scroll2 from "./components/Scroll2";
import NopoTopnav from "../../../components/Topnav/NopoTopnav";

const Container = styled.div`
  height: calc(100svh - 88px); /* 뷰포트 - Topnav 높이 */
  margin-top: 88px; /* Topnav에 가려지지 않게 */
  overflow-y: auto;
  scroll-snap-type: y mandatory;
  overscroll-behavior: contain;
  -webkit-overflow-scrolling: touch;

  /* 스크롤바 숨김(선택) */
  scrollbar-width: none;
  &::-webkit-scrollbar {
    width: 0;
    height: 0;
  }
`;

export default function NopoHome() {
  return (
    <>
      <NopoTopnav />
      <Container>
        <Scroll1 />
        <Scroll2 />
      </Container>
    </>
  );
}
