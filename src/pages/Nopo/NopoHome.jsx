import React, { useState } from "react";
import styled from "styled-components";
import Scroll1 from "./NopoHome/components/Scroll1";
import Scroll2 from "./NopoHome/components/Scroll2";

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

const NopoHome = () => {
  return (
    <>
      <Top_nav />
      <Scroll1 />
      <Scroll2 />
    </>
  );
};

export default NopoHome;
