import React from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import DiscoverCard from "./DiscoverCard";

const Wrapper = styled.section`
  width: 100%;
  max-width: 1440px;
  min-height: 100vh;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;

  scroll-snap-align: start; /* 스냅 포인트 */
  scroll-snap-stop: always; /* 건너뛰지 않도록 */
  box-sizing: border-box;
`;

const Title = styled.h1`
  font-family: Pretendard Variable;
  font-weight: 700;
  font-size: 40px;
  line-height: 120%; /* 가독성 ↑ */
  text-align: center;
`;

const Subtitle = styled.p`
  font-family: "Pretendard Variable";
  font-weight: 350;
  font-size: 30px;
  line-height: 150%;
  text-align: center;
  margin-top: 0px;
  color: #4f4f4f;
`;

const Button = styled.button`
  background: var(--main-003, #8b6fd4);
  color: #fff;
  border: none;
  border-radius: 100px;
  box-shadow: 0 2px 48px -8px rgba(0, 0, 0, 0.2);
  font-size: 23px;
  font-weight: 600;
  cursor: pointer;
  width: 230px;
  height: 70px;
  margin-top: 32px;
`;

export default function Scroll1() {
  const navigate = useNavigate();
  return (
    <Wrapper>
      <Title>
        내 가게를 더욱 빛내줄
        <br />
        청년들의 작업물을 선택해보세요
      </Title>
      <Subtitle>내 가게에 대한 요청을 입력하고 도움을 얻을 수 있어요</Subtitle>

      <DiscoverCard />

      <Button onClick={() => navigate("/nopo/request/create")}>
        요청 쓰러가기
      </Button>
    </Wrapper>
  );
}
