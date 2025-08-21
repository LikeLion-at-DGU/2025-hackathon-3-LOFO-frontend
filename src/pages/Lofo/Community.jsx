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
import { Heart } from "lucide-react";
import { useState } from "react";

const initialCards = [
  { id: 1, store_name: "목구이 별관", title: "홍보영상", saved_count: 1 },
  { id: 2, store_name: "생맥주 전문점", title: "포스터-전단", saved_count: 1 },
  { id: 3, store_name: "미리내 양곱창", title: "SNS 이미지", saved_count: 1 },
  { id: 4, store_name: "목구이 별관", title: "홍보영상", saved_count: 12 },
  { id: 5, store_name: "생맥주 전문점", title: "포스터-전단", saved_count: 15 },
  { id: 6, store_name: "미리내 양곱창", title: "SNS 이미지", saved_count: 20 },
];

const Community = () => {
  const [cards, setCards] = useState(initialCards);
  const [likedCards, setLikedCards] = useState({});

  const toggleLike = (id) => {
    setCards((prevCards) =>
      prevCards.map((card) =>
        card.id === id
          ? {
              ...card,
              saved_count: likedCards[id]
                ? card.saved_count - 1
                : card.saved_count + 1,
            }
          : card
      )
    );

    setLikedCards((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

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
            <ImagePlaceholder />
            <Overlay />
            <CardContent>
              <StoreName>{card.store_name}</StoreName>
              <StoreInfo>{card.title}</StoreInfo>
              <LikeBox>
                <LikeButton onClick={() => toggleLike(card.id)}>
                  <Heart
                    size={18}
                    fill={likedCards[card.id] ? "#fff" : "transparent"}
                    stroke="#fff"
                  />
                </LikeButton>
                <LikeCount>{card.saved_count}</LikeCount>
              </LikeBox>
            </CardContent>
            {card.saved_count >= 10 && (
              <Badge>
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
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 24px;
  padding: 40px 60px;
  width: 100%;
  max-width: 1440px;
`;

const Card = styled.div`
  position: relative;
  border-radius: 16px;
  overflow: hidden;
  cursor: pointer;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s ease;

  &:hover {
    transform: translateY(-6px);
  }
`;

const ImagePlaceholder = styled.div`
  width: 100%;
  height: 200px;
  background-color: #ddd; /* 임시 배경 */
`;

const Overlay = styled.div`
  position: absolute;
  inset: 0;
  background: linear-gradient(to top, rgba(0, 0, 0, 0.6), transparent 50%);
`;

const CardContent = styled.div`
  position: absolute;
  bottom: 12px;
  left: 16px;
  right: 16px;
  color: #fff;
`;

const StoreName = styled.div`
  font-size: 18px;
  font-weight: 700;
  margin-bottom: 4px;
`;

const StoreInfo = styled.div`
  font-size: 14px;
  opacity: 0.85;
`;

const LikeBox = styled.div`
  display: flex;
  justify-content: flex-end; /* 오른쪽 정렬 */
  align-items: center;
  gap: 6px;
  margin-top: 6px;
`;

const LikeButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  padding: 4px;

  &:hover {
    transform: scale(1.1);
  }
`;

const LikeCount = styled.span`
  font-size: 14px;
`;

const Badge = styled.div`
  position: absolute;
  top: 12px;
  left: 12px;

  img {
    width: 55px;
  }
`;
