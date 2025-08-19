import styled from "styled-components";
import * as S from "../Nopo/components/Styled";
import NopoTopnav from "../../components/Topnav/NopoTopnav";
import { HeadingContainer, Title, Subtitle } from "../Nopo/components/Heading";

const Community = () => {
  return (
    <S.Wrapper>
      <NopoTopnav />
      <S.HeadingContainer>
        <S.Title>내 가게에 0명이 참여 중이에요</S.Title>
        <S.Subtitle>조금만 기다리면 작업물이 도착할 거예요!</S.Subtitle>
      </S.HeadingContainer>
    </S.Wrapper>
  );
};

export default Community;
