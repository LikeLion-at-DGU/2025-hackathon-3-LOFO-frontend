import styled from "styled-components";

const Btn = styled.button`
display: flex;
padding: 16px 40px;
justify-content: center;
align-items: center;
gap: 10px;
border-radius: 100px;
background: var(--white, #FFF);
box-shadow: 0 4px 12px 0 rgba(0, 0, 0, 0.25);
color: var(--main-003, #8B6FD4);
font-size: 22px;
font-style: normal;
font-weight: 600;
line-height: normal;
  
  border: 0; padding: 12px 16px; 
  cursor: pointer;
`;

export default function AimissionBtn({ onClickAIMission }) {
  return (
    
        <Btn onClick={onClickAIMission}>AI 미션 하러가기</Btn>

  );
}
