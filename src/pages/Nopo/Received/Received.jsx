import styled from "styled-components";
import * as S from "../components/Styled";
import Topnav from "../../../components/Topnav/Topnav";
import { HeadingContainer, Title, Subtitle } from "../components/Heading";

const ReceivedContainer = styled.div`
  display: flex;
  align-self: stretch;
  padding: 50px 60px 50px 60px;
`;

const Received = () => {
  return (
    <S.Wrapper>
      <Topnav />
      <HeadingContainer>
        <Title>내 가게에 0명이 참여 중이에요</Title>
        <Subtitle>조금만 기다리면 작업물이 도착할 거예요!</Subtitle>
      </HeadingContainer>

      <ReceivedContainer>
        <Subtitle style={{ color: "#E19543" }}>
          내 가게를 도와준 청년들의 작업물 보기
        </Subtitle>
      </ReceivedContainer>
    </S.Wrapper>
  );
};

export default Received;
