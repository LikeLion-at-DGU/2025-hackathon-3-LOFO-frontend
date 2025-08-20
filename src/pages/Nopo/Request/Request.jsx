// import styled from "styled-components";
// import * as S from "../components/Styled";
// import NopoTopnav from "../../../components/Topnav/NopoTopnav";
// import { HeadingContainer, Title, Subtitle } from "../components/Heading";

// const Request = () => {
//   return (
//     <S.Wrapper>
//       <NopoTopnav />
//       <HeadingContainer>
//         <Title>가게에 필요한 도움, 여기서 관리하세요</Title>
//         <Subtitle>
//           여러 요청 작성 가능, 단 모집 종료 시 수정 불가합니다
//         </Subtitle>
//       </HeadingContainer>
//     </S.Wrapper>
//   );
// };

// export default Request;

import React, { useState } from "react";
import * as S from "../components/Styled";
import NopoTopnav from "../../../components/Topnav/NopoTopnav";
import { HeadingContainer, Title, Subtitle } from "../components/Heading";
import styled from "styled-components";
import { Link, useNavigate } from "react-router-dom";

const WriteButton = styled(Link)`
  margin-left: auto;
  padding: 10px 20px;
  border-radius: 30px;
  background: #f3e8ff;
  color: #7c3aed;
  font-size: 14px;
  font-weight: 600;
  text-decoration: none;
  transition: all 0.2s ease;

  &:hover {
    background: #ede9fe;
  }
`;

const TabContainer = styled.div`
  display: flex;
  gap: 12px;
  margin: 32px 0;
`;

const Tab = styled.button`
  padding: 8px 16px;
  border-radius: 20px;
  border: none;
  background: ${({ active }) => (active ? "#EA580C" : "#f3f4f6")};
  color: ${({ active }) => (active ? "#fff" : "#6b7280")};
  font-weight: 600;
  cursor: pointer;

  &:hover {
    background: ${({ active }) => (active ? "#EA580C" : "#e5e7eb")};
  }
`;

// 카드 리스트
const CardGrid = styled.div`
  display: flex;
  gap: 20px;
  flex-wrap: wrap;
  justify-content: flex-start;
  width: 100%;
  max-width: 1200px;
`;

const Card = styled.div`
  width: 280px;
  border-radius: 16px;
  overflow: hidden;
  background: #fff;
  box-shadow: 0px 2px 8px rgba(0, 0, 0, 0.08);
  display: flex;
  flex-direction: column;
`;

const CardImage = styled.div`
  width: 100%;
  height: 160px;
  background: url("https://via.placeholder.com/280x160") no-repeat center/cover;
`;

const CardContent = styled.div`
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const Status = styled.span`
  align-self: flex-start;
  padding: 4px 10px;
  border-radius: 8px;
  font-size: 12px;
  font-weight: 600;
  color: #fff;
  background: ${({ type }) =>
    type === "모집중" ? "#7C3AED" : type === "진행중" ? "#3B82F6" : "#6B7280"};
`;

const TitleText = styled.h3`
  font-size: 16px;
  font-weight: 600;
  color: #111827;
`;

const FooterButtons = styled.div`
  display: flex;
  gap: 8px;
  margin-top: auto;
`;

const SmallButton = styled.div`
  flex: 1;
  padding: 8px;
  border-radius: 8px;
  border: none;
  background: #f3f4f6;
  color: #374151;
  font-size: 14px;
  cursor: pointer;
  font-weight: 500;

  &:hover {
    background: #e5e7eb;
  }
`;

const ProgressBar = styled.div`
  width: 100%;
  height: 6px;
  background: #e5e7eb;
  border-radius: 3px;
  overflow: hidden;
`;

const Progress = styled.div`
  width: ${({ percent }) => percent}%;
  height: 100%;
  background: #3b82f6;
`;

const Request = () => {
  const [activeTab, setActiveTab] = useState("전체");
  const navigate = useNavigate();

  const requests = [
    { id: 1, status: "모집중", title: "카드뉴스 해주세요" },
    { id: 2, status: "진행중", title: "카드뉴스 해주세요", progress: 40 },
    { id: 3, status: "종료", title: "카드뉴스 해주세요" },
  ];

  return (
    <S.Wrapper>
      <NopoTopnav />
      <HeadingContainer style={{ display: "flex", alignItems: "center" }}>
        <div>
          <Title>가게에 필요한 도움, 여기서 관리하세요</Title>
          <Subtitle>
            여러 요청 작성 가능, 단 모집 종료 시 수정 불가합니다
          </Subtitle>
        </div>
        <WriteButton to="/nopo/request/create">요청 쓰러가기</WriteButton>
      </HeadingContainer>

      {/* 탭 메뉴 */}
      <TabContainer>
        {["전체", "모집중", "진행중", "종료"].map((tab) => (
          <Tab
            key={tab}
            active={activeTab === tab}
            onClick={() => setActiveTab(tab)}
          >
            {tab}
          </Tab>
        ))}
      </TabContainer>

      {/* 카드 리스트 */}
      <CardGrid>
        {requests
          .filter((req) => activeTab === "전체" || req.status === activeTab)
          .map((req) => (
            <Card key={req.id}>
              <CardImage />
              <CardContent>
                <Status type={req.status}>{req.status}</Status>
                <TitleText>{req.title}</TitleText>

                {req.status === "진행중" && (
                  <>
                    <ProgressBar>
                      <Progress percent={req.progress || 0} />
                    </ProgressBar>
                    <p style={{ fontSize: "12px", color: "#6b7280" }}>
                      마감까지 D-00
                    </p>
                  </>
                )}

                {req.status === "모집중" && (
                  <FooterButtons>
                    <SmallButton
                      onClick={() => navigate(`/nopo/request/edit/${req.id}`)}
                    >
                      수정하기
                    </SmallButton>
                    <SmallButton>중단하기</SmallButton>
                  </FooterButtons>
                )}
              </CardContent>
            </Card>
          ))}
      </CardGrid>
    </S.Wrapper>
  );
};

export default Request;
