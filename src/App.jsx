import { useState } from "react";
import { styled, ThemeProvider } from "styled-components";
import { Outlet } from "react-router-dom";
import "./App.css";

const Wrapper = styled.div`
  //border: 1px solid black;
  width: 100vw;
  height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  //* {border: 1px solid black;}
`;

// named export
export const Layout = () => {
  return (
    <>
      <Wrapper>
        <Outlet />
      </Wrapper>
    </>
  );
};

// 기본 export
export default function App() {
  return <div>App 컴포넌트</div>;
}
