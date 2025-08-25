// import React, { useEffect, useState } from "react";
// import styled from "styled-components";
// import { useNavigate } from "react-router-dom";
// import { getHomeDashboard } from "../../../../apis/nopo_request";
// import store from "../../../../assets/store.svg";
// import message from "../../../../assets/message.svg";
// import handshake from "../../../../assets/handshake.svg";
// import quit from "../../../../assets/quit.svg";

// const Wrapper = styled.section`
//   width: 100%;
//   max-width: 1440px;
//   height: 100%;
//   margin: 0 auto;
//   padding: 24px 24px 40px;
//   box-sizing: border-box;

//   /* display: flex;
//   flex-direction: column;
//   justify-content: center;
//   align-items: center;
//   text-align: center; */

//   scroll-snap-align: start;
//   scroll-snap-stop: always;
// `;

// const StatusBar = styled.div`
//   display: flex;
//   justify-content: space-around;
//   margin-bottom: 32px;
//   background: #fff;
//   padding: 16px;
//   border-radius: 16px;
//   box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
// `;
// const StatusItem = styled.div`
//   text-align: center;
//   padding-bottom: 10px;
// `;
// const Label = styled.p`
//   font-size: 0.9rem;
//   color: #888;
// `;
// const Number = styled.p`
//   font-size: 1.2rem;
//   font-weight: 700;
// `;

// const CardList = styled.div`
//   display: flex;
//   gap: 16px;
//   overflow-x: auto;
//   padding-bottom: 16px;
// `;
// const Card = styled.div`
//   min-width: 200px;
//   background: #fff;
//   border-radius: 16px;
//   box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
//   overflow: hidden;
// `;
// const CardImage = styled.img`
//   width: 100%;
//   height: 120px;
//   object-fit: cover;
// `;
// const CardTitle = styled.p`
//   font-weight: 700;
//   padding: 8px;
// `;
// const CardStatus = styled.span`
//   font-size: 0.8rem;
//   padding: 4px 8px;
//   border-radius: 12px;
//   color: #fff;
//   margin-left: 8px;
//   background: ${(p) =>
//     p.$status === "모집중"
//       ? "#8b72ff"
//       : p.$status === "진행중"
//       ? "#4db2ff"
//       : "#888"};
// `;
// const Button = styled.button`
//   color: var(--main-003, #8b6fd4);
//   display: block;
//   width: 320px;
//   height: 80px;
//   border-radius: 100px;
//   box-shadow: 0 2px 30px -8px #8b6fd4;
//   background: #fff;
//   border: none;
//   font-weight: 600;
//   cursor: pointer;
//   font-size: 23px;
//   margin-top: 32px;
//   align-items: center;
// `;

// const Picture = styled.img`
//   width: 30px;
//   height: 30px;
// `;

// export default function Scroll2() {
//   const navigate = useNavigate();
//   const [cards, setCards] = useState([]);
//   const [progress, setProgress] = useState({
//     open: 0,
//     ongoing: 0,
//     closed: 0,
//     total: 0,
//   });
//   const [loading, setLoading] = useState(false);

//   useEffect(() => {
//     (async () => {
//       setLoading(true);
//       try {
//         const {
//           items = [],
//           progress = { open: 0, ongoing: 0, closed: 0, total: 0 },
//         } = await getHomeDashboard();
//         setCards(items.slice(0, 3)); // 혹시 모를 과다 응답 대비
//         setProgress(progress);
//       } catch (e) {
//         console.error(
//           "[Scroll2] load failed:",
//           e?.response?.status,
//           e?.message
//         );
//         setCards([]);
//         setProgress({ open: 0, ongoing: 0, closed: 0, total: 0 }); // 안전값
//       } finally {
//         setLoading(false);
//       }
//     })();
//   }, []);

//   return (
//     <Wrapper>
//       <StatusBar>
//         <StatusItem>
//           <Picture src={store} />
//           <Label>총 요청수</Label>
//           <Number>{progress.total ?? 0}</Number>
//         </StatusItem>
//         <StatusItem>
//           <Picture src={message} />
//           <Label>모집중</Label>
//           <Number>{progress.open ?? 0}</Number>
//         </StatusItem>
//         <StatusItem>
//           <Picture src={handshake} />
//           <Label>진행중</Label>
//           <Number>{progress.ongoing ?? 0}</Number>
//         </StatusItem>
//         <StatusItem>
//           <Picture src={quit} />
//           <Label>중단/종료</Label>
//           <Number>{progress.closed ?? 0}</Number>
//         </StatusItem>
//       </StatusBar>

//       {loading && <p style={{ color: "#6b7280" }}>불러오는 중…</p>}

//       <CardList>
//         {cards.map((it) => (
//           <Card key={it.id}>
//             <CardImage src={it.thumbnailUrl || "/assets/bear.png"} alt="" />
//             <CardTitle>
//               {it.title}
//               <CardStatus $status={it.status}>{it.status}</CardStatus>
//             </CardTitle>
//           </Card>
//         ))}
//       </CardList>

//       <Button onClick={() => navigate(`/nopo/request`)}>모든 요청 보기</Button>
//     </Wrapper>
//   );
// }

import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import { getHomeDashboard } from "../../../../apis/nopo_request";
import store from "../../../../assets/store.svg";
import message from "../../../../assets/message.svg";
import handshake from "../../../../assets/handshake.svg";
import quit from "../../../../assets/quit.svg";

const Wrapper = styled.section`
  width: 100%;
  max-width: 1440px;
  margin: 0 auto;
  padding: 24px 24px 60px;
  box-sizing: border-box;
  scroll-snap-align: start;
  scroll-snap-stop: always;
`;

const SectionTitle = styled.h2`
  color: #8b6fd4;
  font-size: 24px;
  font-weight: 900;
  margin: 28px 0 16px;
`;

/* ===== 진행 현황 박스 ===== */
const StatusBar = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  background: #fff;
  border-radius: 28px;
  padding: 28px 16px;
  box-shadow: 0 12px 28px rgba(0, 0, 0, 0.06);
  margin-bottom: 32px;
`;

const StatusCell = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;

  /* 세로 구분선 */
  &:not(:last-child)::after {
    content: "";
    position: absolute;
    right: 0;
    top: 8px;
    height: calc(100% - 16px);
    width: 1px;
    background: #e5e7eb;
  }
`;

const Icon = styled.img`
  width: 36px;
  height: 36px;
  opacity: 0.8;
`;

const Label = styled.p`
  margin: 0;
  font-size: 16px;
  color: #6b7280;
  font-weight: 700;
`;

const Number = styled.p`
  margin: 0;
  font-size: 36px;
  line-height: 1;
  font-weight: 900;
  color: #111827;
`;

/* ===== 카드 리스트 ===== */
const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, minmax(260px, 1fr));
  gap: 24px;
`;

const CardWrap = styled.div`
  display: flex;
  flex-direction: column;
`;

const StatusPill = styled.span`
  align-self: flex-start;
  padding: 10px 16px;
  border-radius: 999px;
  font-size: 14px;
  font-weight: 800;
  color: #fff;
  margin: 0 0 12px 8px;
  background: ${({ $v }) =>
    $v === "모집중" ? "#8B6FD4" : $v === "진행중" ? "#3B82F6" : "#373A3F"};
`;

const Card = styled.div`
  border-radius: 18px;
  overflow: hidden;
  background: #fff;
  box-shadow: 0 8px 28px rgba(0, 0, 0, 0.08);
`;

const Media = styled.div`
  height: 180px;
  background: ${({ $src }) =>
    `url(${
      $src || "https://via.placeholder.com/640x360?text=%20"
    }) center/cover no-repeat`};
  position: relative;
`;

const Overlay = styled.div`
  position: absolute;
  inset: 0;
  background: linear-gradient(
    180deg,
    rgba(0, 0, 0, 0) 40%,
    rgba(0, 0, 0, 0.55) 100%
  );
  display: flex;
  align-items: flex-end;
  padding: 16px;
`;

const TitleText = styled.p`
  margin: 0;
  color: #fff;
  font-size: 18px;
  font-weight: 800;
`;

const StoreName = styled.p`
  margin: 4px 0 0;
  color: #e5e7eb;
  font-size: 12px;
  font-weight: 600;
`;

const GlowButton = styled.button`
  color: #8b6fd4;
  display: block;
  width: 250px;
  height: 72px;
  border-radius: 100px;
  box-shadow: 0 22px 50px -12px rgba(139, 111, 212, 0.8);
  background: #fff;
  border: none;
  font-weight: 800;
  cursor: pointer;
  font-size: 22px;
  margin: 32px auto 0;
`;

/* ===== 컴포넌트 ===== */
export default function Scroll2() {
  const navigate = useNavigate();
  const [cards, setCards] = useState([]);
  const [progress, setProgress] = useState({
    open: 0,
    ongoing: 0,
    closed: 0,
    total: 0,
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const {
          items = [],
          progress = { open: 0, ongoing: 0, closed: 0, total: 0 },
        } = await getHomeDashboard();

        setCards(items.slice(0, 3)); // 상단 3개만
        setProgress(progress);
      } catch (e) {
        console.error(
          "[Scroll2] load failed:",
          e?.response?.status,
          e?.message
        );
        setCards([]);
        setProgress({ open: 0, ongoing: 0, closed: 0, total: 0 });
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return (
    <Wrapper>
      {/* 진행 현황 */}
      <SectionTitle>내 진행 현황</SectionTitle>
      <StatusBar>
        <StatusCell>
          <Icon src={store} alt="" />
          <Label>총 요청수</Label>
          <Number>{progress.total ?? 0}</Number>
        </StatusCell>
        <StatusCell>
          <Icon src={message} alt="" />
          <Label>모집중</Label>
          <Number>{progress.open ?? 0}</Number>
        </StatusCell>
        <StatusCell>
          <Icon src={handshake} alt="" />
          <Label>진행중</Label>
          <Number>{progress.ongoing ?? 0}</Number>
        </StatusCell>
        <StatusCell>
          <Icon src={quit} alt="" />
          <Label>중단/종료</Label>
          <Number>{progress.closed ?? 0}</Number>
        </StatusCell>
      </StatusBar>

      {/* 내 요청 보기 */}
      <SectionTitle>내 요청 보기</SectionTitle>

      {loading && <p style={{ color: "#6b7280" }}>불러오는 중…</p>}

      <Grid>
        {cards.map((it) => (
          <CardWrap key={it.id}>
            <StatusPill $v={it.status}>{it.status}</StatusPill>

            <Card>
              <Media $src={it.thumbnailUrl || "/assets/bear.png"}>
                <Overlay>
                  <div>
                    <TitleText>{it.title}</TitleText>
                    <StoreName>{it.storeName || it.store_name}</StoreName>
                  </div>
                </Overlay>
              </Media>
            </Card>
          </CardWrap>
        ))}
      </Grid>

      <GlowButton onClick={() => navigate(`/nopo/request`)}>
        모든 요청 보기
      </GlowButton>
    </Wrapper>
  );
}
