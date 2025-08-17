import { styled } from "styled-components";
import Topnav from "../../../components/Topnav/Topnav";
import InputField from "../../../components/Input/InputField";
import InputButton from "../../../components/Input/InputButton";

//-----Div-----//
const Div = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  gap: 80px;
  align-items: center;
`

//메인 카피//
const Title = styled.div`
  color: var(--sub-003, #59418F);
  text-align: center;
  font-family: "Pretendard Variable";
  font-size: 45px;
  font-style: normal;
  font-weight: 700;
  line-height: normal;
  margin-top: 60px;/*임의*/
`

//Input 외부 레이아웃//
const InputContainer = styled.div`
  display: flex;
  width: 620px;
  padding: 80px 50px;
  flex-direction: column;
  justify-content: center;
  gap: 3rem;
  align-self: stretch;
  border-radius: 60px;
  background: var(--white, #FFF);
  box-shadow: 0 2px 48px -8px rgba(0, 0, 0, 0.20);
  margin: 0 auto;
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
  gap: 2rem;
  align-self: stretch;
`

function SignUpNickname() {
  return (
    <>
      <Topnav/>
      <Div>
        <Title>닉네임을 정하고 미션을 시작하세요!</Title>
        <InputContainer>
          <Info>
          <InputTitle>닉네임 입력</InputTitle>
          <InputDescription>LOFO에서 사용할 닉네임을 설정해주세요</InputDescription>
          </Info>
          <Input>
            <InputField placeholder="김로포"/>
            <InputButton button="가입 완료"/>
          </Input>
        </InputContainer>
      </Div>
      
    </>
  );
};

export default SignUpNickname;