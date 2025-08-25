import styled from "styled-components";

//-----Div-----//
export const Div = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  gap: 40px;
  align-items: center;
`

//메인 카피//
export const Title = styled.div`
  color: var(--sub-003, #59418F);
  text-align: center;
  font-family: "Pretendard Variable";
  font-size: 32px;
  font-style: normal;
  font-weight: 700;
  line-height: normal;
  margin-top: 60px;/*임의*/
`

//Input 외부 레이아웃//
export const InputContainer = styled.div`
  display: flex;
  width: 480px;
  padding: 74px 50px;
  flex-direction: column;
  justify-content: center;
  gap: 1.5rem;
  align-self: stretch;
  border-radius: 60px;
  background: var(--white, #FFF);
  box-shadow: 0 2px 48px -8px rgba(0, 0, 0, 0.20);
`
//텍스트
export const Info = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`
export const InputTitle = styled.div`
color: var(--text-001, #333);
font-size: 28px;
font-style: normal;
font-weight: 600;
line-height: normal;
`
export const InputDescription = styled.span`
  color: var(--text-002, #4F4F4F);
font-size: 18px;
font-style: normal;
font-weight: 400;
line-height: normal;
`

//input칸
export const InputWrap = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 1rem;
  align-self: stretch;
`

//하단 안내 문구
export const SubDescription = styled.span`
  color: var(--main-003, #8B6FD4);
text-align: center;
font-family: "Pretendard Variable";
font-size: 12px;
font-style: normal;
font-weight: 400;
line-height: normal;
`