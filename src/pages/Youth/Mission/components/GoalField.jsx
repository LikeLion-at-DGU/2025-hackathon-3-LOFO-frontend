import styled from "styled-components";

export function GoalField({ value, onChange, error }) {
  return (
    <Block>
      <BlockTitle>목표</BlockTitle>
      <Help>
        상인의 요청을 확인하고, 제작할 최종 콘텐츠의 목표를 입력하세요.
        구체적으로 작성할수록 AI가 더 정확한 미션을 만듭니다.
      </Help>
      <Textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="목표를 구체적으로 적어주세요. (예: 젊은 고객층 유입을 위한 가게 소개 카드뉴스를 만들고 싶어.)"
        aria-invalid={!!error}
      />
      {error && <FieldError>{error}</FieldError>}
    </Block>
  );
}

const Block = styled.div`
  background: #fff;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  padding: 16px;
`;

const BlockTitle = styled.h2`
  font-size: 18px;
  font-weight: 700;
  margin-bottom: 6px;
`;

const Help = styled.p`
  font-size: 13px;
  color: #6b7280;
  line-height: 1.5;
  margin-bottom: 12px;
`;


const Textarea = styled.textarea`
  width: 100%;
  min-height: 120px;
  padding: 12px;
  border: 1px solid #d1d5db;
  border-radius: 10px;
  font-size: 15px;
  resize: vertical;

  &:focus {
    outline: none;
    border-color: #5c98ff;
    box-shadow: 0 0 0 3px rgba(124, 58, 237, 0.15);
  }
`;

const FieldError = styled.p`
  color: #dc2626;
  font-size: 12px;
  margin-top: 8px;
`;
