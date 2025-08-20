// import styled from "styled-components";
// import * as S from "../Nopo/components/Styled";
// import {}
// import NopoTopnav from "../../components/Topnav/NopoTopnav";
// import { HeadingContainer, Title, Subtitle } from "../Nopo/components/Heading";
// import lofopick from "../../assets/lofopick.svg";

// const Community = () => {
//   return (
//     <S.Wrapper>
//       <NopoTopnav />
//       <HeadingContainer>
//         <Title>청년의 시선이 담긴 작업물, 한눈에 발견하세요</Title>
//         <Subtitle>
//           상인에게는 영감이, 청년에게는 성취가 되는 공간입니다.{" "}
//         </Subtitle>
//       </HeadingContainer>
//     </S.Wrapper>
//   );
// };

// export default Community;

import styled from "styled-components";
import * as S from "../Nopo/components/Styled";
import NopoTopnav from "../../components/Topnav/NopoTopnav";
import { HeadingContainer, Title, Subtitle } from "../Nopo/components/Heading";
import lofopick from "../../assets/lofopick.svg";
import { useEffect, useState } from "react";
import axios from "axios";

const Community = () => {
  const [cards, setCards] = useState([]);

  const fetchCards = async () => {
    try {
      const res = await axios.get("https://lofo.life/lofo/community");
      setCards(res.data); // [{id, name, likes}, ...] 형태라고 가정
    } catch (err) {
      console.error("데이터 불러오기 실패:", err);
    }
  };

  useEffect(() => {
    fetchCards();
  }, []);

  return (
    <S.Wrapper>
      <NopoTopnav />
      <HeadingContainer>
        <Title>청년의 시선이 담긴 작업물, 한눈에 발견하세요</Title>
        <Subtitle>
          상인에게는 영감이, 청년에게는 성취가 되는 공간입니다.
        </Subtitle>
      </HeadingContainer>

      <CardGrid>
        {cards.map((card) => (
          <Card key={card.id}>
            <CardContent>{card.name}</CardContent>
            {card.likes >= 10 && (
              <Badge className="badge">
                <img src={lofopick} alt="LOFO PICK" />
              </Badge>
            )}
          </Card>
        ))}
      </CardGrid>
    </S.Wrapper>
  );
};

export default Community;

// Styled Components
const CardGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 20px;
  padding: 20px;
`;

const Card = styled.div`
  position: relative;
  background-color: #f8f8f8;
  border-radius: 12px;
  height: 150px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.2rem;
  font-weight: 600;
  color: #333;
  cursor: pointer;
  transition: all 0.2s ease-in-out;

  &:hover {
    background-color: #ececec;
  }

  &:hover .badge {
    opacity: 1;
    transform: translateY(0);
  }
`;

const CardContent = styled.div``;

const Badge = styled.div`
  position: absolute;
  top: 10px;
  left: 10px;
  opacity: 0;
  transform: translateY(-5px);
  transition: all 0.2s ease-in-out;

  img {
    width: 50px;
  }
`;
