import styled from "styled-components";
import { Sparkles } from "lucide-react";

export function MissionBtn({ onClick }) {
  return (
      <Button type="button" onClick={onClick}>
        미션 참여하기
      </Button>

  );
}

const Button = styled.button`
  display: inline-flex; justify-content: center; align-items: center;
  padding: 10px 20px; gap: 10px;
  border: none;
  border-radius: 22px; background: #fff; color: #59418F;
  font-size: 20px; font-weight: 600;
  box-shadow: 0 2px 8px rgba(0,0,0,.25);
  transition: transform .1s ease, box-shadow .2s ease;

  &:hover { box-shadow: 0 4px 24px rgba(2,72,255,.12); }
  &:active { transform: translateY(1px); }
`;
