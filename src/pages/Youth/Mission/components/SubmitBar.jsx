import styled from "styled-components";

export function SubmitBar({ disabled, loading, onClick }) {
  return (
    <SubmitBtn type="submit" disabled={disabled} onClick={onClick}>
      {loading ? "저장 중..." : "작성 완료"}
    </SubmitBtn>
  );
}

const SubmitBtn = styled.button`

display: flex;
width: 520px;
padding: 20px;
margin: 50px 260px;
justify-content: center;
align-items: center;
gap: 10px;
border-radius: 15px;
background: var(--main-001, #368FEF);
  height: 52px;
  border: none;
  color: white;
  font-weight: 700;
  font-size: 16px;
  cursor: pointer;

  &:disabled {
    background-color: #999;
  }
`;
