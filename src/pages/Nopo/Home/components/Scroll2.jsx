// import React from "react";
// import styled from "styled-components";
// import { useNavigate } from "react-router-dom";

// const Wrapper = styled.div`
//   /* min-height: 100vh; */
//   padding: 23px 70px;
//   margin-top: 88px;
//   /* background: #f9f9ff; */
//   width: 1440px;
//   height: 1024px;
//   top: 1024px;
//   angle: 0 deg;
//   opacity: 1;
//   gap: 10px;
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
// `;

// const Label = styled.p`
//   font-size: 0.9rem;
//   color: #888;
// `;

// const Number = styled.p`
//   font-size: 1.2rem;
//   font-weight: bold;
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
//   font-weight: bold;
//   padding: 8px;
// `;

// const CardStatus = styled.span`
//   font-size: 0.8rem;
//   padding: 4px 8px;
//   border-radius: 12px;
//   background: ${(props) => {
//     if (props.status === "모집중") return "#8b72ff";
//     if (props.status === "진행중") return "#4db2ff";
//     if (props.status === "중단/종료") return "#888";
//     return "#ccc";
//   }};
//   color: #fff;
//   margin-left: 8px;
// `;

// const Button = styled.button`
//   display: block;
//   width: 404px;
//   height: 103px;
//   margin: 32px auto 0;
//   padding: 30px 100px;
//   border-radius: 100px;
//   background: rgba(255, 255, 255, 1);
//   border: none;
//   font-weight: bold;
//   cursor: pointer;
// `;

// const Scroll2 = () => {
//   const navigate = useNavigate();

//   return (
//     <Wrapper>
//       <StatusBar>
//         <StatusItem>
//           <Label>총 요청수</Label>
//           <Number>5</Number>
//         </StatusItem>
//         <StatusItem>
//           <Label>모집중</Label>
//           <Number>5</Number>
//         </StatusItem>
//         <StatusItem>
//           <Label>진행중</Label>
//           <Number>5</Number>
//         </StatusItem>
//         <StatusItem>
//           <Label>중단/종료</Label>
//           <Number>5</Number>
//         </StatusItem>
//       </StatusBar>

//       <CardList>
//         {["모집중", "진행중", "중단/종료", "진행중"].map((status, i) => (
//           <Card key={i}>
//             <CardImage src="/assets/bear.png" />
//             <CardTitle>
//               카드뉴스 해주세요{" "}
//               <CardStatus status={status}>{status}</CardStatus>
//             </CardTitle>
//           </Card>
//         ))}
//       </CardList>

//       <Button onClick={() => navigate(`/nopo/request`)}>모든 요청 보기</Button>
//     </Wrapper>
//   );
// };

// export default Scroll2;
// src/pages/Nopo/Home/components/Scroll2.jsx
import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import { getHomeDashboard } from "../../../../apis/nopo_request";

const Wrapper = styled.div`
  padding: 23px 70px;
  margin-top: 88px;
  width: 1440px;
  height: 1024px;
`;

const StatusBar = styled.div`
  display: flex;
  justify-content: space-around;
  margin-bottom: 32px;
  background: #fff;
  padding: 16px;
  border-radius: 16px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
`;
const StatusItem = styled.div`
  text-align: center;
`;
const Label = styled.p`
  font-size: 0.9rem;
  color: #888;
`;
const Number = styled.p`
  font-size: 1.2rem;
  font-weight: 700;
`;

const CardList = styled.div`
  display: flex;
  gap: 16px;
  overflow-x: auto;
  padding-bottom: 16px;
`;
const Card = styled.div`
  min-width: 200px;
  background: #fff;
  border-radius: 16px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  overflow: hidden;
`;
const CardImage = styled.img`
  width: 100%;
  height: 120px;
  object-fit: cover;
`;
const CardTitle = styled.p`
  font-weight: 700;
  padding: 8px;
`;
const CardStatus = styled.span`
  font-size: 0.8rem;
  padding: 4px 8px;
  border-radius: 12px;
  color: #fff;
  margin-left: 8px;
  background: ${(p) =>
    p.$status === "모집중"
      ? "#8b72ff"
      : p.$status === "진행중"
      ? "#4db2ff"
      : "#888"};
`;
const Button = styled.button`
  display: block;
  width: 404px;
  height: 103px;
  margin: 32px auto 0;
  padding: 30px 100px;
  border-radius: 100px;
  background: #fff;
  border: none;
  font-weight: 700;
  cursor: pointer;
`;

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
        setCards(items.slice(0, 3)); // 혹시 모를 과다 응답 대비
        setProgress(progress);
      } catch (e) {
        console.error(
          "[Scroll2] load failed:",
          e?.response?.status,
          e?.message
        );
        setCards([]);
        setProgress({ open: 0, ongoing: 0, closed: 0, total: 0 }); // 🔒 안전값
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return (
    <Wrapper>
      <StatusBar>
        <StatusItem>
          <Label>총 요청수</Label>
          <Number>{progress.total ?? 0}</Number>
        </StatusItem>
        <StatusItem>
          <Label>모집중</Label>
          <Number>{progress.open ?? 0}</Number>
        </StatusItem>
        <StatusItem>
          <Label>진행중</Label>
          <Number>{progress.ongoing ?? 0}</Number>
        </StatusItem>
        <StatusItem>
          <Label>중단/종료</Label>
          <Number>{progress.closed ?? 0}</Number>
        </StatusItem>
      </StatusBar>

      {loading && <p style={{ color: "#6b7280" }}>불러오는 중…</p>}

      <CardList>
        {cards.map((it) => (
          <Card key={it.id}>
            <CardImage src={it.thumbnailUrl || "/assets/bear.png"} alt="" />
            <CardTitle>
              {it.title}
              <CardStatus $status={it.status}>{it.status}</CardStatus>
            </CardTitle>
          </Card>
        ))}
      </CardList>

      <Button onClick={() => navigate(`/nopo/request`)}>모든 요청 보기</Button>
    </Wrapper>
  );
}
