import { styled } from "styled-components";

const Title = styled.h1`
    color: blue;
`
//스타일 컴포넌트 테스트!! 자유롭게 변경해서 써주세용

function Home() {
  return (
    <>
      <Title>메인 페이지</Title>
    </>
  );
};

export default Home;