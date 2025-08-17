import { styled } from "styled-components";
import Topnav from "../../../components/Topnav/Topnav";

const Title = styled.h1`
    color: blue;
`
//메인 Div//
const Div = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  margin-top: 88px;
  overflow: scoll;
`

function SignUp() {
  return (
    <>
      <Topnav/>
      <Div>
        <Title>회원가입 페이지</Title>
      </Div>
      
    </>
  );
};

export default SignUp;