//

import React, { useState } from "react";
import * as S from "../components/Styled";
import Topnav from "../../../components/Topnav/Topnav";
import { HeadingContainer, Title, Subtitle } from "../components/Heading";

const ReceivedFeedback = () => {
  // 질문별 state 분리
  const [satisfaction, setSatisfaction] = useState("");
  const [reflection, setReflection] = useState("");
  const [usability, setUsability] = useState("");
  const [content, setContent] = useState("");

  const satisfactionOptions = [
    "매우 만족",
    "만족",
    "보통",
    "아쉬움",
    "매우 아쉬움",
  ];
  const reflectionOptions = [
    "매우 반영",
    "어느정도 반영",
    "보통",
    "부족함",
    "매우 부족함",
  ];
  const usabilityOptions = [
    "매우 가능",
    "어느정도 가능",
    "보통",
    "고민됨",
    "활용 어려움",
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    const feedbackData = {
      satisfaction,
      reflection,
      usability,
      content,
    };
    console.log("제출 데이터:", feedbackData);
    // 👉 여기서 서버로 POST 요청 연결하면 됨
  };

  return (
    <S.Wrapper>
      <Topnav />
      <HeadingContainer>
        <Title>작업물을 확인하고 후기를 남겨주세요</Title>
        <Subtitle>
          청년이 전달한 결과물을 보고 마음에 든 점이나 개선할 점을 자유롭게
          작성해주시면 됩니다.
        </Subtitle>
      </HeadingContainer>

      <form
        onSubmit={handleSubmit}
        style={{ width: "800px", marginTop: "40px" }}
      >
        {/* 1. 만족도 */}
        <S.FormGroup>
          <S.Label>
            작업물 전반적으로 만족하시나요?<S.Required>*</S.Required>
          </S.Label>
          <S.CategoryBox>
            {satisfactionOptions.map((option) => (
              <S.CategoryButton
                key={option}
                type="button"
                onClick={() => setSatisfaction(option)}
                selected={satisfaction === option}
              >
                {option}
              </S.CategoryButton>
            ))}
          </S.CategoryBox>
        </S.FormGroup>

        {/* 2. 요청 반영도 */}
        <S.FormGroup>
          <S.Label>
            요청하신 내용이 잘 반영되었나요?<S.Required>*</S.Required>
          </S.Label>
          <S.CategoryBox>
            {reflectionOptions.map((option) => (
              <S.CategoryButton
                key={option}
                type="button"
                onClick={() => setReflection(option)}
                selected={reflection === option}
              >
                {option}
              </S.CategoryButton>
            ))}
          </S.CategoryBox>
        </S.FormGroup>

        {/* 3. 활용 가능성 */}
        <S.FormGroup>
          <S.Label>
            결과물을 실제로 활용할 수 있을 것 같나요?<S.Required>*</S.Required>
          </S.Label>
          <S.CategoryBox>
            {usabilityOptions.map((option) => (
              <S.CategoryButton
                key={option}
                type="button"
                onClick={() => setUsability(option)}
                selected={usability === option}
              >
                {option}
              </S.CategoryButton>
            ))}
          </S.CategoryBox>
        </S.FormGroup>

        {/* 4. 자유 후기 */}
        <S.FormGroup>
          <S.Label>
            자유롭게 후기를 작성해주세요.<S.Required>*</S.Required>
          </S.Label>
          <S.Desc>간단한 감사 인사나 개선 의견도 큰 도움이 됩니다.</S.Desc>
          <S.Input
            type="text"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="예: 신메뉴 출시 기념으로 사용할 전단지를 트렌디한 느낌 원해요."
          />
        </S.FormGroup>

        {/* 전송 버튼 */}
        <S.SubmitButton type="submit">전송하기</S.SubmitButton>
      </form>
    </S.Wrapper>
  );
};

export default ReceivedFeedback;
