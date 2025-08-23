// import styled from "styled-components";
// import * as S from "../components/Styled";
// import NopoTopnav from "../../../components/Topnav/NopoTopnav";
// import { HeadingContainer, Title, Subtitle } from "../components/Heading";

// const ReceivedContainer = styled.div`
//   display: flex;
//   align-self: stretch;
//   padding: 50px 60px 50px 60px;
// `;

// const Received = () => {
//   return (
//     <S.Wrapper>
//       <NopoTopnav />
//       <HeadingContainer>
//         <Title>내 가게에 0명이 참여 중이에요</Title>
//         <Subtitle>조금만 기다리면 작업물이 도착할 거예요!</Subtitle>
//       </HeadingContainer>

//       <ReceivedContainer>
//         <Subtitle style={{ color: "#E19543" }}>
//           내 가게를 도와준 청년들의 작업물 보기
//         </Subtitle>
//       </ReceivedContainer>
//     </S.Wrapper>
//   );
// };

// export default Received;
import styled from "styled-components";
import * as S from "../components/Styled";
import NopoTopnav from "../../../components/Topnav/NopoTopnav";
import { HeadingContainer, Title, Subtitle } from "../components/Heading";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  getReceivedList,
  oneClickDownloadOutcome,
} from "../../../apis/nopo_received";

const ReceivedContainer = styled.div`
  display: flex;
  align-self: stretch;
  padding: 50px 60px;
  flex-direction: column;
  gap: 24px;
`;

/* 빈 상태 뷰 */
const EmptyBox = styled.div`
  margin-top: 40px;
  width: 100%;
  min-height: 320px;
  border-radius: 16px;
  background: #f7f7f9;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 24px;
`;
const CTAButton = styled.button`
  padding: 16px 28px;
  border-radius: 999px;
  border: none;
  background: #7c3aed; /* 보라 버튼 */
  color: #fff;
  font-weight: 800;
  font-size: 16px;
  cursor: pointer;
  box-shadow: 0 8px 24px rgba(124, 58, 237, 0.35);
  transition: transform 0.05s ease, opacity 0.15s ease, background 0.15s ease;
  &:hover {
    background: #6d28d9;
  }
  &:active {
    transform: translateY(1px);
  }
`;

/* ===== 카드 UI ===== */
const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 24px;
  width: 100%;
`;
const Card = styled.div`
  border-radius: 16px;
  overflow: hidden;
  background: #fff;
  box-shadow: 0 6px 18px rgba(0, 0, 0, 0.08);
  display: flex;
  flex-direction: column;
`;
const ThumbWrap = styled.div`
  position: relative;
  width: 100%;
  height: 180px;
`;
const Thumb = styled.div`
  width: 100%;
  height: 100%;
  background: ${({ $src }) =>
    `url(${
      $src || "https://via.placeholder.com/320x180"
    }) center/cover no-repeat`};
`;
const Overlay = styled.div`
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  padding: 14px;
  background: linear-gradient(
    180deg,
    rgba(0, 0, 0, 0) 0%,
    rgba(0, 0, 0, 0.55) 100%
  );
  color: #fff;
`;
const OvTitle = styled.div`
  font-weight: 700;
  font-size: 14px;
  line-height: 1.1;
`;
const OvStore = styled.div`
  margin-top: 4px;
  font-size: 12px;
  opacity: 0.9;
`;
const Row = styled.div`
  display: flex;
  gap: 12px;
  padding: 14px;
`;
const OrangeBtn = styled.button`
  flex: 1;
  padding: 12px 0;
  border-radius: 14px;
  border: 1px solid var(--line-001, #bababa);
  background: var(--main-002, #e19543);
  color: #fff;
  font-weight: 700;
  cursor: pointer;
  transition: background 0.15s ease, transform 0.05s ease;
  box-shadow: 0 4px 12px 0 rgba(0, 0, 0, 0.25);
  &:hover {
    background: #c97b2f;
  }
  &:active {
    transform: translateY(1px);
  }
`;
const WhiteBtn = styled.button`
  flex: 1;
  padding: 12px 0;
  border-radius: 14px;
  background: #fff;
  border: 1px solid var(--line-001, #bababa);
  color: #111827;
  font-weight: 700;
  cursor: pointer;
  &:hover {
    background: #f9fafb;
  }
`;

export default function Received() {
  const [items, setItems] = useState([]); // [{ outcomeId, title, storeName, thumbnailUrl }]
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const { items } = await getReceivedList();
        setItems(items);
        console.log("[Received:list]", items);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const goCreate = () => navigate("/nopo/request/create");

  const handleFeedback = (outcomeId) => {
    navigate(`/nopo/received/feedback?id=${outcomeId}`);
  };

  const handleUse = async (outcomeId) => {
    try {
      await oneClickDownloadOutcome(outcomeId);
    } catch (e) {
      console.error("[활용하기] 다운로드 실패:", e);
      alert("다운로드에 실패했어요. 잠시 후 다시 시도해 주세요.");
    }
  };

  return (
    <S.Wrapper>
      <NopoTopnav />
      <HeadingContainer>
        <Title>내 가게에 0명이 참여 중이에요</Title>
        <Subtitle>조금만 기다리면 작업물이 도착할 거예요!</Subtitle>
      </HeadingContainer>

      <ReceivedContainer>
        <Subtitle style={{ color: "#E19543" }}>
          내 가게를 도와준 청년들의 작업물 보기
        </Subtitle>

        {loading && <p style={{ color: "#6b7280" }}>불러오는 중…</p>}

        {!loading && items.length === 0 && (
          <EmptyBox>
            <div
              style={{ color: "#4b5563", textAlign: "center", lineHeight: 1.6 }}
            >
              아직 받은 작업물이 없어요.
              <br />
              지금 바로 청년들에게 도움을 요청해보세요!
            </div>
            <CTAButton onClick={goCreate}>요청 쓰러가기</CTAButton>
          </EmptyBox>
        )}

        {!loading && items.length > 0 && (
          <Grid>
            {items.map((v) => {
              const outcomeId = v.outcomeId ?? v.outcome_id ?? v.id;
              const title = v.title;
              const storeName = v.storeName ?? v.store_name;
              const thumbnailUrl = v.thumbnailUrl;

              return (
                <Card key={outcomeId}>
                  <ThumbWrap>
                    <Thumb $src={thumbnailUrl} />
                    <Overlay>
                      <OvTitle>{title || "SNS 이미지"}</OvTitle>
                      <OvStore>{storeName}</OvStore>
                    </Overlay>
                  </ThumbWrap>

                  <Row>
                    <OrangeBtn onClick={() => handleFeedback(outcomeId)}>
                      후기쓰기
                    </OrangeBtn>
                    <WhiteBtn onClick={() => handleUse(outcomeId)}>
                      활용하기
                    </WhiteBtn>
                  </Row>
                </Card>
              );
            })}
          </Grid>
        )}
      </ReceivedContainer>
    </S.Wrapper>
  );
}
