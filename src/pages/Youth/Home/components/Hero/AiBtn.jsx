import styled from "styled-components";

const Btn = styled.button`
  border: 0; padding: 12px 16px; border-radius: 999px; box-shadow: 0 2px 10px rgba(0,0,0,.08);
  cursor: pointer;
`;

export default function AimissionBtn({ onClickAIMission }) {
  return (
    
        <Btn onClick={onClickAIMission}>AI 미션 하러가기</Btn>

  );
}
