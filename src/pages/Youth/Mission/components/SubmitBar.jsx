import styled from "styled-components";

export function SubmitBar({ disabled, loading, onClick }) {
  return (
    <SubmitBtn type="submit" disabled={disabled} onClick={onClick}>
      {loading ? "저장 중..." : "작성 완료"}
    </SubmitBtn>
  );
}

const SubmitBtn = styled.button`
  margin-top: 16px;
  width: 100%;
  height: 52px;
  border: none;
  border-radius: 12px;
  background: #3b82f6;
  color: white;
  font-weight: 700;
  font-size: 16px;
  cursor: pointer;

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;
