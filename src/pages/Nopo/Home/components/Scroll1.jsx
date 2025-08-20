import React from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";

const Wrapper = styled.div`
  width: 1440px;
  height: 1024px;
  padding-top: 88px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
`;

const Title = styled.h1`
  font-family: Pretendard Variable;
  font-weight: 700;
  font-style: Bold;
  font-size: 48px;
  line-height: 100%;
  letter-spacing: 0%;
  text-align: center;
`;

const Subtitle = styled.p`
  font-family: Pretendard Variable;
  font-weight: 400;
  font-style: Regular;
  font-size: 36px;
  line-height: 100%;
  letter-spacing: 0%;
  text-align: center;
`;

const Button = styled.button`
  background-color: rgba(139, 111, 212, 1);
  color: #fff;
  border: none;
  padding: 30px 100px;
  border-radius: 100px;
  font-size: 1rem;
  cursor: pointer;
  width: 352px;
  height: 93px;
  angle: 0 deg;
  opacity: 1;
  gap: 10px;
`;

const ButtonContent = styled.div`
  width: 200px;
  height: 33px;
  angle: 0 deg;
  opacity: 1;
  font-family: Pretendard Variable;
  font-weight: 600;
  font-style: SemiBold;
  font-size: 28px;
  line-height: 100%;
  letter-spacing: 0%;
`;

const Scroll1 = () => {
  const navigate = useNavigate();

  return (
    <Wrapper>
      <Title>
        내 가게를 더욱 빛내줄
        <br />
        청년들의 작업물을 선택해보세요
      </Title>
      <Subtitle>내 가게에 대한 요청을 입력하고 도움을 얻을 수 있어요</Subtitle>
      <Button>
        <ButtonContent onClick={() => navigate(`/nopo/request/create`)}>
          요청 쓰러가기
        </ButtonContent>
      </Button>
    </Wrapper>
  );
};

export default Scroll1;
