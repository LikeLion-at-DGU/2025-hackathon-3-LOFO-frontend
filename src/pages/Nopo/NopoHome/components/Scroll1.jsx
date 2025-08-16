import React from "react";
import styled from "styled-components";

const Wrapper = styled.div`
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
  background: #fff;
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
      <Title>내 가게를 더욱 빛내줄 청년들의 작업물을 선택해보세요</Title>
      <Subtitle>내 가게에 대한 요청을 입력하고 도움을 얻을 수 있어요</Subtitle>
      <Button>요청 쓰러가기</Button>
    </Wrapper>
  );
};

export default Scroll1;
