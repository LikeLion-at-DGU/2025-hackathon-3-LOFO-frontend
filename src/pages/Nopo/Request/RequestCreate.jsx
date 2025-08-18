// import React, { useState } from "react";
// import styled from "styled-components";
// import Topnav from "../../../components/Topnav/Topnav";

// const Wrapper = styled.div`
//   width: 1440px;
//   height: 1024px;
//   padding-top: 88px;
//   display: flex;
//   flex-direction: column;
//   justify-content: center;
//   align-items: center;
//   text-align: center;
// `;

// const Title = styled.h1`
//   font-family: Pretendard Variable;
//   font-weight: 700;
//   font-style: Bold;
//   font-size: 48px;
//   line-height: 100%;
//   letter-spacing: 0%;
// `;

// const Subtitle = styled.p`
//   font-size: 1rem;
//   color: #555;
//   margin-bottom: 24px;
// `;

// const RequestCreate = () => {
//   return (
//     <Wrapper>
//       <Topnav />
//       <Title>가게 고민을 청년과 함께 해결해보세요</Title>
//       <Subtitle>
//         요청은 청년이 지원하기 전까지만 수정할 수 있습니다. <br /> 지원이
//         시작되면 수정과 중단은 불가능합니다.
//       </Subtitle>
//       {/* <Button>
//         <ButtonContent>요청 등록하기</ButtonContent>
//       </Button> */}
//     </Wrapper>
//   );
// };

// export default RequestCreate;

import React, { useState } from "react";
import styled from "styled-components";
import Topnav from "../../../components/Topnav/Topnav";
import { HeadingContainer, Title, Subtitle } from "../components/Heading";

const Wrapper = styled.div`
  width: 100%;
  /* gap: 100px; */
  min-height: 100vh;
  padding-top: 88px;
  padding-bottom: 50px;
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: #f9fafb;
  overflow-y: auto;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  width: 800px;
  height: 2528px;
  opacity: 1;
  gap: 80px;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  width: 800px;
  opacity: 1;
  gap: 8px;
`;

const Label = styled.label`
  font-family: Pretendard Variable;
  font-weight: 700;
  font-size: 30px;
  line-height: 100%;
  margin-bottom: 16px;
`;

const Required = styled.span`
  color: red;
`;

const Desc = styled.p`
  font-family: Pretendard Variable;
  font-weight: 400;
  font-style: Regular;
  font-size: 15px;
  line-height: 100%;
  letter-spacing: 0%;
  color: rgba(79, 79, 79, 1);
`;

const Input = styled.input`
  width: 100%;
  padding: 14px 16px;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 14px;
  outline: none;

  &::placeholder {
    color: #aaa;
  }

  /* &:focus {
    border-color: #2563eb;
    box-shadow: 0 0 0 2px rgba(37, 99, 235, 0.2);
  } */
`;

const FileUpload = styled.div`
  padding: 40px;
  border: 2px dashed #cbd5e1;
  border-radius: 12px;
  background-color: #f0f6ff;
  text-align: center;
  font-size: 14px;
  color: #2563eb;

  input {
    cursor: pointer;
  }
`;

const CategoryBox = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  width: 600px;
  height: 225px;
  opacity: 1;
  gap: 27px;
`;

const CategoryButton = styled.button`
  width: 150px;
  height: 99px;
  opacity: 1;
  gap: 10px;
  border-radius: 20px;
  border-width: 1px;

  padding: 16px 32px;
  border: 1px solid rgba(186, 186, 186, 1);
  border-radius: 16px;
  font-size: 16px;
  cursor: pointer;
  background-color: ${({ selected }) =>
    selected ? "rgba(225, 149, 67, 1)" : "#fff"};
  color: ${({ selected }) => (selected ? "#fff" : "#333")};
  font-weight: ${({ selected }) => (selected ? "700" : "500")};
  box-shadow: ${({ selected }) =>
    selected ? "0px 2px 8px rgba(0, 0, 0, 0.25)" : "none"};
  transition: all 0.2s ease;

  &:hover {
    background-color: ${({ selected }) =>
      selected ? "rgba(225, 149, 67, 1)" : "#f5f5f5"};
  }
`;

const SubmitButton = styled.button`
  background-color: #e5e7eb;
  color: #555;
  font-weight: 600;
  padding: 14px;
  border: none;
  border-radius: 30px;
  cursor: pointer;
  font-size: 15px;
  transition: all 0.2s ease;

  &:hover {
    background-color: #d1d5db;
  }
`;

const RequestCreate = () => {
  const [storeName, setStoreName] = useState("");
  const [storeLink, setStoreLink] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [content, setContent] = useState("");
  const [file, setFile] = useState(null);

  const categories = [
    "홍보영상",
    "포스터·전단",
    "SNS 이미지",
    "인테리어 제안",
    "홍보기획",
    "광고문구",
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
  };

  return (
    <Wrapper>
      <Topnav />
      <HeadingContainer>
        <Title>가게 고민을 청년과 함께 해결해보세요</Title>
        <Subtitle>
          요청은 청년이 지원하기 전까지만 수정할 수 있습니다.
          <br />
          지원이 시작되면 수정과 중단은 불가능합니다.
        </Subtitle>
      </HeadingContainer>

      <Form onSubmit={handleSubmit}>
        <FormGroup>
          <Label>
            가게명을 입력해주세요. <Required>*</Required>
          </Label>
          <Input
            type="text"
            value={storeName}
            onChange={(e) => setStoreName(e.target.value)}
            placeholder="예: 멋사노포"
          />
        </FormGroup>

        {/* 가게 사진 업로드  */}
        <FormGroup>
          <Label>
            가게 사진을 올려주세요. <Required>*</Required>
          </Label>
          <Desc>
            요청과 관련된 자료 사진을 업로드해주세요.
            <br />
            가게 사진이 아니어도 되며, 한 장만 첨부 가능합니다.
          </Desc>
          <FileUpload>
            <input
              type="file"
              // accept="image/*"
              onChange={(e) => setFile(e.target.files[0])}
            />
          </FileUpload>
        </FormGroup>

        {/* 가게 링크 */}
        <FormGroup>
          <Label>
            가게 링크를 첨부해주세요. <Required>*</Required>
          </Label>
          <Desc>네이버 지도에 등록된 가게 링크를 입력해주세요.</Desc>
          <Input
            type="url"
            value={storeLink}
            onChange={(e) => setStoreLink(e.target.value)}
            placeholder="예: https://www.naver.com/"
          />
        </FormGroup>

        {/* 카테고리 */}
        <FormGroup>
          <Label>
            요청 카테고리를 선택해주세요. <Required>*</Required>
          </Label>
          <Desc>
            청년들이 더 잘 이해할 수 있도록 가장 알맞은 카테고리를 골라주세요.
          </Desc>
          <CategoryBox>
            {categories.map((category) => (
              <CategoryButton
                key={category}
                onClick={() => setSelectedCategory(category)}
                selected={selectedCategory === category}
              >
                {category}
              </CategoryButton>
            ))}
          </CategoryBox>
        </FormGroup>

        {/* 요청 내용 */}
        <FormGroup>
          <Label>
            청년에게 부탁하고 싶은 내용을 적어주세요. <Required>*</Required>
          </Label>
          <Desc>
            요청은 자유롭게 작성할 수 있으며, 구체적으로 적을수록 청년이
            이해하기 쉽습니다.
            <br />
            원하는 분위기나 목적을 적어주시면 청년이 더 잘 도와드릴 수 있어요.
          </Desc>

          <Input
            type="text"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="예: 신메뉴 출시 기념으로 사용할 전단지를 트렌디한 느낌 원해요."
          />
        </FormGroup>
        <SubmitButton type="submit">요청 등록하기</SubmitButton>
      </Form>
    </Wrapper>
  );
};

export default RequestCreate;
