import { styled } from "styled-components";
import { Link } from "react-router-dom";

import Topnav from "../../../components/Topnav/Topnav";
import InputField from "../../../components/Input/InputField";
import InputButton from "../../../components/Input/SubmitButton";

//-----Div-----//
const Div = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  gap: 40px;
  align-items: center;
`

//메인 카피//
const Title = styled.div`
  color: var(--sub-003, #59418F);
  text-align: center;
  font-family: "Pretendard Variable";
  font-size: 43px;
  font-style: normal;
  font-weight: 700;
  line-height: normal;
  margin-top: 60px;/*임의*/
`

//Input 외부 레이아웃//
const InputContainer = styled.div`
  display: flex;
  width: 600px;
  padding: 80px 60px;
  flex-direction: column;
  justify-content: center;
  gap: 3rem;
  align-self: stretch;
  border-radius: 60px;
  background: var(--white, #FFF);
  box-shadow: 0 2px 48px -8px rgba(0, 0, 0, 0.20);
`
//텍스트
const Info = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`
const InputTitle = styled.div`
color: var(--text-001, #333);
font-size: 32px;
font-style: normal;
font-weight: 600;
line-height: normal;
`
const InputDescription = styled.span`
  color: var(--text-002, #4F4F4F);
font-size: 22px;
font-style: normal;
font-weight: 400;
line-height: normal;
`

//input란
const Input = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 1.8rem;
  align-self: stretch;
`

//하단 안내 문구
const SubDescription = styled.span`
  color: var(--main-003, #8B6FD4);
text-align: center;
font-family: "Pretendard Variable";
font-size: 14px;
font-style: normal;
font-weight: 400;
line-height: normal;
`


function SignUp() {
  return (
    <>
      <Topnav/>
      <Div>
        <Title>안녕하세요, LOFO와 함께<br/>포트폴리오를 쌓는 경험을 해봐요</Title>
        <InputContainer>
          <Info>
          <InputTitle>전화번호 입력 </InputTitle>
          <InputDescription>1분만에 가입하고 포트폴리오 미션을 시작하세요!</InputDescription>
          </Info>
          <Input>
            <InputField placeholder="01012345678"/>
            <InputButton button="청년으로 가입하기" />
          </Input>
          <SubDescription>이미 LOFO 사용자이신가요?<br/>가입하신 전화번호로 이용할 수 있어요.
          <Link to="/auth/login-youth/nickname" style={{ cursor: "pointer", textDecoration: "none"}}>임시버튼</Link></SubDescription>
        </InputContainer>
      </Div>
      
    </>
  );
};

export default SignUp;