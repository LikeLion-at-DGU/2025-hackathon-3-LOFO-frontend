import styled from "styled-components";
import { Sparkles } from "lucide-react";

export function RecommendCTA({ onClick }) {
  return (
    <Wrap>
      <Button type="button" onClick={onClick}>
        <Sparkles size={18} />
        유사 미션 추천 받기
      </Button>
    </Wrap>
  );
}

const Wrap = styled.div`
  display: flex;
  justify-content: flex-end;
`;

const Button = styled.button`
  display: inline-flex;
  gap: 8px;
  align-items: center;
  height: 40px;
  padding: 0 16px;
  border: 1px solid #dbe2ea;
  border-radius: 999px;
  background: white;
  font-weight: 600;
  color: #111827;
  box-shadow: 0 1px 0 rgba(16, 24, 40, 0.04);
  transition: transform 80ms ease, box-shadow 120ms ease;

  &:hover {
    box-shadow: 0 4px 24px rgba(2, 72, 255, 0.12);
  }
  &:active {
    transform: translateY(1px);
  }
`;
