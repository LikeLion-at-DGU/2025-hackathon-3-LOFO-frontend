import React from "react";
import styled from "styled-components";
import logo from "../../../../assets/logo.svg";

const Wrapper = styled.div`
  width: 1920px;
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
  background: #fff;
`;

const Top_nav = styled.div`
  display: flex;
  align-items: center;
  width: 100vw;
  height: 88px;
  padding: 16px 8px;
  border-bottom: 1px solid var(--line-001, #bababa);
  position: absolute;
  /* top: 0;
    left: 0; */
`;

const Title = styled.h1`
  font-size: 2rem;
  font-weight: bold;
  margin-bottom: 8px;
`;

const Subtitle = styled.p`
  font-size: 1rem;
  color: #555;
  margin-bottom: 24px;
`;

const Button = styled.button`
  background-color: rgba(139, 111, 212, 1);
  color: #fff;
  border: none;
  padding: 30px 100px;
  border-radius: 100px;
  font-size: 1rem;
  cursor: pointer;
`;

const Scroll1 = () => {
  return (
    <Wrapper>
      <Top_nav>
        <img src={logo} alt="로고" />
      </Top_nav>
      <Title>내 가게를 더욱 빛내줄 청년들의 작업물을 선택해보세요</Title>
      <Subtitle>내 가게에 대한 요청을 입력하고 도움을 얻을 수 있어요</Subtitle>
      <Button>요청 쓰러가기</Button>
    </Wrapper>
  );
};

export default Scroll1;
